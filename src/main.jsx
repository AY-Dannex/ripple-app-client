import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { TooltipProvider } from './components/ui/tooltip'
import { UserProvider } from "./context/UserContext"
import { PostProvider } from "./context/PostContext"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <UserProvider>
          <PostProvider>
            <App />
          </PostProvider>
        </UserProvider>
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
)
