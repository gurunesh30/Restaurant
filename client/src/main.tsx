import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext' // Import your AuthProvider
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Nest the providers so they cover the whole app */}
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)