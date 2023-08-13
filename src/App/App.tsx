import { useState } from 'react'
import SystMsgAlert from '../Components/SystMsgAlert/SystMsgAlert'

export default function App() {
  const [systMsg, setSystMsg] = useState('')
  const [isError, setIsError] = useState(true)

  const resetSystMsg = () => {
    setSystMsg('')
    setIsError(false)
  }

  return (
    <>
    <h1 className="title">Welcome from task crushers</h1>
      <SystMsgAlert
        msg={systMsg}
        onResetMsg={resetSystMsg}
        type={isError ? 'fail' : 'success'}
      />
      <button type="button" onClick={() => setSystMsg('test message')}>
        test
      </button>
    </>
  )
}
