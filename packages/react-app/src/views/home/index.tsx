import {Helmet} from 'react-helmet-async'
import Counter from '@/views/home/counter'

function Home() {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <Counter />
    </>
  )
}

export default Home
