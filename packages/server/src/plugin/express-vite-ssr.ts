import * as fs from 'fs'
import * as path from 'path'
import type {ViteDevServer} from 'vite'
import * as express from 'express'
import type {Express, Request, Response} from 'express'
import type {PipeableStream, RenderToPipeableStreamOptions} from 'react-dom/server'

export interface ViteRenderOptions {
  appPackage: string
  framework: 'react'
}

type ViteRenderServerModule<T> = {
  default: {
    renderToStream: (props: Record<string, string>, streamOptions?:RenderToPipeableStreamOptions) => T
  }
}

type ReactRenderStreamModule = ViteRenderServerModule<{
  stream: PipeableStream
  renderHead: () => string
}>

function reactModuleRender (
  res: Response,
  template: string,
  serverModule : ReactRenderStreamModule,
  props: Record<string, string>
) {
  const [headPrefix, headRestString] = template.split('<!--head-outlet-->')
  const [ssrPrefix, ssrRestString] = headRestString.split('<!--ssr-outlet-->')
  const { stream, renderHead } = serverModule.default.renderToStream(props, {
    identifierPrefix: 'identifierPrefix',
    namespaceURI: 'namespaceURI',
    nonce: 'nonce',
    onShellReady() {
      res.statusCode = 200
      res.type('html')
      res.write(headPrefix)
      res.write(renderHead().trim())
      res.write(ssrPrefix)
      stream.pipe(res)
    },
    onAllReady() {
      res.end(ssrRestString)
    }
  })
}

interface ServerRenderModule {
  renderOptions: ViteRenderOptions
}

export class ViteRenderModule implements ServerRenderModule {
  _initPromise: Promise<void>
  viteServer: ViteDevServer
  renderOptions: ViteRenderOptions

  constructor(app: Express, opts: ViteRenderOptions) {
    this.renderOptions = opts
    this._initPromise = import('vite')
      .then(({ createServer }) => createServer({
        configFile: require.resolve(`${opts.appPackage}/vite.config.ts`),
      }))
      .then((server : ViteDevServer) => {
        app.use(server.middlewares)
        this.viteServer = server
      })
  }

  async ready() {
    await this._initPromise
    return this
  }

  async render(req: Request, res: Response) {
    await this.ready()
    const { baseUrl } = req
    const { appPackage, framework } = this.renderOptions
    try {
      const template = await this.viteServer.transformIndexHtml(
        baseUrl,
        fs.readFileSync(
          require.resolve(`${appPackage}/index.html`),
          'utf-8'
        )
      )
      const serverModule = await this.viteServer.ssrLoadModule(
        require.resolve(
          framework === 'react'
            ? `${appPackage}/src/main.tsx`
            : `${appPackage}/src/main.ts`
        )
      )

      if (framework === 'react') {
        return reactModuleRender(res, template, serverModule as ReactRenderStreamModule, { url: baseUrl })
      } else {
        throw new Error(`Unsupported framework: ${framework as string}`)
      }

    } catch (e) {
      this.viteServer.ssrFixStacktrace(e as Error)
      throw e
    }
  }
}

export class BundleRenderModule implements ServerRenderModule {
  renderOptions: ViteRenderOptions
  template: string
  serverModule: ViteRenderServerModule<unknown>

  constructor(app: Express, opts: ViteRenderOptions) {
    this.renderOptions = opts
    const distPath = path.join(process.cwd(), 'dist')
    this.template = fs.readFileSync(path.join(distPath, 'client/index.html'), 'utf-8')
    // const manifest = require(path.join(distPath, 'client/ssr-manifest.json'))
    this.serverModule = require(path.join(distPath, 'server/main.js')) as ViteRenderServerModule<unknown>

    app.use(express.static(path.join(distPath, 'client'), { index: false }))
  }

  render(req: Request, res: Response) {
    const { baseUrl } = req
    const { framework } = this.renderOptions
    if (framework === 'react') {
      return reactModuleRender(res, this.template, this.serverModule as ReactRenderStreamModule, { url: baseUrl })
    } else {
      throw new Error(`Unsupported framework: ${framework as string}`)
    }
  }
}

export default function createRenderModule (app: Express, opts: ViteRenderOptions) {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve().then(() => {
      const renderModule = new ViteRenderModule(app, opts)
      return renderModule.ready()
    })
  } else {
    return new BundleRenderModule(app, opts)
  }
}
