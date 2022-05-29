import {SSRContext} from 'vue/server-renderer'
import {Readable} from 'stream'

export interface VuePageProps {
  url: string
}

export interface RenderOptions {
  ctx: SSRContext
}

export type RenderToVueString = (props: VuePageProps, { ctx }: RenderOptions) => Promise<{
  html: string
  head: string
  state: string
}>

export type RenderToVueStream = (props: VuePageProps, { ctx }: RenderOptions) => {
  stream: Promise<Readable>
  head: string
  state: string
}
