import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NsecsProvider } from './contexts/NsecContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NsecsProvider>
    <App />
  </NsecsProvider>
)
