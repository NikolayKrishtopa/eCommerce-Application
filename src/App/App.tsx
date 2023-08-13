import { useState } from 'react'
import SystMsgAlert from '../Components/SystMsgAlert/SystMsgAlert'

import AppRouter from '../Components/AppRouter/AppRouter'
import './App.scss'

export default function App() {
  const [systMsg, setSystMsg] = useState('')
  const [isError, setIsError] = useState(true)

  const resetSystMsg = () => {
    setSystMsg('')
    setIsError(false)
  }

  return (
    <>
    <AppRouter />
    <SystMsgAlert
      msg={systMsg}
      onResetMsg={resetSystMsg}
      type={isError ? 'fail' : 'success'}
      />
      <button type="button" onClick={() => setSystMsg('test message')} style={{marginTop: '100px'}}>
        test use only-needs to be removed then
      </button>
    </>
  )
}
