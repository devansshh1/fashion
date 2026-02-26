import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './Router/Route.jsx'
import './style.css'
import App from './App'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
        <AuthProvider>
        <App />
        </AuthProvider>
    
);
