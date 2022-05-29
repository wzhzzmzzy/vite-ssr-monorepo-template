import { createApp as createClientApp, createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import devalue from '@nuxt/devalue'
import {createHead, HeadClient, renderHeadToString} from '@vueuse/head'
import { renderToNodeStream, renderToString } from 'vue/server-renderer'
import App from './App.vue'
import router from './router'
import {RenderToVueStream, RenderToVueString, VuePageProps} from '../types/server'

function createApp (props?: VuePageProps) {
  const app = (import.meta.env.SSR ? createSSRApp : createClientApp)(App)
  const head = createHead()
  const pinia = createPinia()

  app.use(head).use(pinia).use(router)

  if (import.meta.env.SSR && props) {
    void router.push(props.url)
  }

  return {
    app,
    router,
    pinia,
    head
  }
}

const renderHead = (head: HeadClient) => {
  const result = renderHeadToString(head)
  return result.headTags
}

const serverRenderToString : RenderToVueString = async (props, { ctx }) => {
  const { app, router, pinia, head } = createApp(props)
  void await router.isReady()
  const html = await renderToString(app, ctx)
  return {
    html,
    head: renderHead(head),
    state: devalue(pinia.state.value)
  }
}

const serverRenderToStream : RenderToVueStream = (props, { ctx }) => {
  const { app, router, pinia, head } = createApp(props)
  return {
    stream: router.isReady().then(() => renderToNodeStream(app, ctx)),
    getHead: () => renderHead(head),
    getState: () => devalue(pinia.state.value)
  }
}

function clientHydrate () {
  const {
    app,
    router,
    pinia
  } = createApp()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  void router.isReady().then(() => {
    pinia.state.value = window.__pinia
    app.mount('#app')
  })
}

export default import.meta.env.SSR ? {
  render: serverRenderToString,
  renderToStream: serverRenderToStream
} : clientHydrate()
