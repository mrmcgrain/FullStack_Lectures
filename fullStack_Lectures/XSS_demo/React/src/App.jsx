import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import XSSDemo from './XssDemo'
import { Helmet } from 'react-helmet';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
{/* heello pokemon */}
        <XSSDemo />
    </>
  )
}

export default App
