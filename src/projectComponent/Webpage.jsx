import Landing from "./Landing.jsx"
import Authentication from "./Authentication.jsx"
import Home from "./Home.jsx"
import PostPage from "./PostPage.jsx"
import Profile from "./Profile.jsx"
import Explore from "./Explore.jsx"
import Notification from "./Notification.jsx"
import Message from "./Message.jsx"
import Moderator from "./ModDash.jsx"
import AdminDashboard from "./AdmDash.jsx"

import { Routes, Route, Navigate } from "react-router-dom"
import { useUser } from "../context/UserContext.jsx"

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useUser()
    if(loading) return null
    if(!user) return <Navigate to="/authentication"/>
    return children
}

const ModeratorRoute = ({ children }) => {
    const { user, loading } = useUser()
    if(loading) return null
    if(!user) return <Navigate to="/authentication" />
    if(user.role !== "moderator") return <Navigate to="/home" />
    return children
}

const AdminRoute = ({ children }) => {
    const { user, loading } = useUser()
    if(loading) return null
    if(!user) return <Navigate to="/authentication" />
    if(user.role !== "admin") return <Navigate to="/home" />
    return children
}

function Webpage() {
    return(
        <Routes>
            <Route path="/" element={<Landing />}/>
            <Route path="/authentication" element={<Authentication />}/>
            
            {/* Home is now the layout wrapper */}
            <Route path="/home" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            }>
                {/* Nested routes render inside <Outlet /> */}
                {/* <Route index element={<PostPage />} />          /home */}
                <Route path="profile" element={<Profile />} />       {/* /home/profile */}
                <Route path="explore" element={<Explore />} />       {/* /home/explore */}
                <Route path="notifications" element={<Notification />} /> {/* /home/notifications */}
                <Route path="messages" element={<Message />} />      {/* /home/messages */}
                <Route path="mod-dashboard" element={
                    <ModeratorRoute>
                        <Moderator />
                    </ModeratorRoute>
                }/>
                <Route path="admin-dashboard" element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                } />
            </Route>
        </Routes>
    )
}
export default Webpage