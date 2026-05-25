import Webpage from "./projectComponent/Webpage"
import { Toaster } from "sonner"
import { SidebarProvider } from "./components/ui/sidebar"
function App() {

  return (
    <>
      <SidebarProvider>
        <Toaster position="top-right" richColors />
        
        <Webpage />
      </SidebarProvider>
    </>
  )
}

export default App
