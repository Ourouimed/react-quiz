import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.body).render(
  <StrictMode>
    <App />
    <p className='text-center mt-2 text-xl'>
      Built by <a href="https://github.com/ourouimed" target='_blank' className='text-cyan-500 font-bold'>ourouimed </a>
        &copy;{new Date().getFullYear()}
    </p>
  </StrictMode>,
)
