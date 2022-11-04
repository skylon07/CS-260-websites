import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import axios from 'axios'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

if (process.env.NODE_ENV === "production") {
    console.log("Using production URL...")

    const proxyPort = 27633
    axios.defaults.baseURL = `http://thedelta.stream:${proxyPort}`
} else if (process.env.NODE_ENV === "development") {
    console.log("Using development URL...")
    
    const port = 27634
    axios.defaults.baseURL = `http://localhost:${port}`
}
