import React from 'react'
import {HelmetProvider} from 'react-helmet-async'
import {StaticRouter} from 'react-router-dom/server'
import App from '@/App'

interface Props {
  url: string
  helmetContext: Record<string, never>
}

const Page = ({ url, helmetContext }: Props) => {
  return (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App/>
      </StaticRouter>
    </HelmetProvider>
  )
}

export default Page
