import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {renderToPipeableStream, RenderToPipeableStreamOptions, renderToString} from 'react-dom/server'
import {BrowserRouter} from 'react-router-dom'
import {FilledContext, HelmetProvider} from 'react-helmet-async'
import App from './App'
import Page from './Page'

interface PageProps {
  url: string
}

function serverHelmetRender() {
  const helmetContext = {}
  const renderHead = () => {
    const { helmet: helmetStatic } = (helmetContext as FilledContext)
    return `
      ${helmetStatic.title.toString()}
      ${helmetStatic.priority.toString()}
      ${helmetStatic.meta.toString()}
      ${helmetStatic.link.toString()}
      ${helmetStatic.script.toString()}
      `
  }
  return {
    helmetContext,
    renderHead
  }
}

function serverRenderToString({ url }: PageProps) {
  const { helmetContext, renderHead } = serverHelmetRender()
  const html = renderToString(
    <Page url={url} helmetContext={helmetContext} />
  )
  return {html, head: renderHead()}
}

function serverRenderToSteam({ url }: PageProps, streamOption?: RenderToPipeableStreamOptions) {
  const { helmetContext, renderHead } = serverHelmetRender()
  const stream = renderToPipeableStream(
    <Page url={url} helmetContext={helmetContext} />,
    streamOption
  )
  return {stream, renderHead}
}

function clientHydrate () {
  hydrateRoot(
    document.getElementById('app') as HTMLElement,
    <HelmetProvider>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default import.meta.env.SSR ? {
  render: serverRenderToString,
  renderToStream: serverRenderToSteam
} : clientHydrate()
