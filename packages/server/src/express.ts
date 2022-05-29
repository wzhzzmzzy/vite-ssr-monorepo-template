import * as express from 'express'
import createRenderModule, {ViteRenderOptions} from './plugin/express-vite-ssr'

async function createServer () {
  const app = express()

  const reactRenderOptions: ViteRenderOptions = {
    appPackage: '@my-monorepo/vue-app',
    framework: 'vue'
  }
  
  const ssrModule = await createRenderModule(app, reactRenderOptions)

  app.get('*', (req, res) => {
    void ssrModule.render(req, res)
  })

  return app
}

async function startServer() {
  const server = await createServer()
  server.listen(3003, () => {
    console.log('Server is listening at http://localhost:3003')
  })
}

void startServer()
