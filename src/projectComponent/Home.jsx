import Navbar from "./Navbar.jsx"
import { Outlet, useLocation} from "react-router-dom"
import Contact from "./Contacts.jsx"
import PostPage from "./PostPage.jsx"

function Home() {
    const location = useLocation()
    const isHomePage = location.pathname === "/home"
    const showPage = location.pathname === "/home" || location.pathname === "/home/profile"
    return (
        <div className="w-full h-screen">
            <div className="max-w-[1440px] h-screen m-auto flex">
                {/* Left - Navbar: hidden on mobile, visible on lg */}
                <div className="hidden md:block border h-full w-[190px] flex-shrink-0">
                    <Navbar />
                </div>

                {/* Main content — add bottom padding on mobile so content isn't hidden behind bottom nav */}
                <div className="overflow-y-auto scrollbar-hide flex-1 pb-16 lg:pb-0">
                    {isHomePage ? <PostPage /> : <Outlet />}
                </div>

                {/* Right Section - Only on home/profile page */}
                {showPage && (
                    <div className="hidden lg:block border-right h-full w-[250px] flex-shrink-0 overflow-y-auto scrollbar-hide">
                        <Contact />
                    </div>
                )} 
            </div>

            {/* Bottom Navbar — mobile only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-5 bg-white border-t">
                <Navbar />
            </div>
        </div>
    )
}
export default Home