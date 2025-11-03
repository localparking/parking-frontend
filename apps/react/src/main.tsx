import ReactDOM from 'react-dom/client'
import { App } from './app'
import './main.css'

document.body.classList.add('no-bounce-scroll')
document.documentElement.classList.add('no-bounce-scroll')
document.documentElement.style.overscrollBehavior = 'none'


const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
