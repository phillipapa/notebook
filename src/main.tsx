import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

root.render(
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>
)
