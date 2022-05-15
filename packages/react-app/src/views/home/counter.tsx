import {useState} from 'react'
import { css } from '@emotion/react'

// some css style with emotion
const counterStyle = css`
  display: flex;
  flex-direction: row;
  background: azure;
  
  .count-text {
    margin: 5px;
  }
`

export default function Counter () {
  const [count, setCount] = useState(0)

  return (
    <div css={counterStyle}>
      <p className="count-text">count is {count}</p>
      <button className="count-btn" onClick={() => setCount(c => c+1)}>+1</button>
    </div>
  )
}
