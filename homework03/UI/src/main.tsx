import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider} from '@react-oauth/google'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="716983225646-bo7c7e8nd0p6g4539mup39tvkl2mu2e5.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
)
