import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PermisosProvider } from './context/PermisosContext'
import './index.css'
import './styles/button-fixes.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PermisosProvider>
      <App />
    </PermisosProvider>
  </React.StrictMode>,
)
