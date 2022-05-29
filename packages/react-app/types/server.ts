import {PipeableStream, RenderToPipeableStreamOptions} from 'react-dom/server'

export interface ReactPageProps {
  url: string
}

export type RenderToReactString = (props: ReactPageProps) => {
  html: string
  head: string
}

export type RenderToReactStream = (props: ReactPageProps, streamOptions?: RenderToPipeableStreamOptions) => {
  stream: PipeableStream
  renderHead: () => string
}
