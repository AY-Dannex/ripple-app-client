import { useUser } from "../context/UserContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
    Home, 
    Compass, 
    Bell, 
    MessageCircle, 
    User, 
    Shield, 
    MoreHorizontal,
    Waves
} from "lucide-react"
import { toast } from "sonner";
import pic from "../assets/pic.jpg"

function Navbar({ setShowAdminPanel, setActivePage }){
    const { user, setUser } = useUser()
    const navigate = useNavigate()
    const location = useLocation()
    const baseURL = import.meta.env.VITE_BASE_URL

    const handleLogout = async () => {
        try {
            const response = await fetch(`${baseURL}/user/logout`, {
                method: "POST",
                credentials: "include"
            })
            const data = await response.json()

            if(response.ok){
                toast.success(data.message)
                setUser(null)
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                navigate("/authentication")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const navLinks = [
        { to: "/home", label: "Home", icon: Home },
        { to: "/home/profile", label: "Profile", icon: User },
        { to: "/home/explore", label: "Explore", icon: Compass },
        // { to: "/home/notifications", label: "Notifications", icon: Bell },
        { to: "/home/messages", label: "Messages", icon: MessageCircle },
    ]

    if (user?.role === "admin") {
        navLinks.push({ to: "/home/admin-dashboard", label: "Admin Dashboard", icon: Shield })
    }
    if (user?.role === "moderator") {
        navLinks.push({ to: "/home/mod-dashboard", label: "Mod Dashboard", icon: Shield })
    }

    // ── Mobile bottom bar ──────────────────────────────────────────
    // Rendered inside the fixed bottom strip (lg:hidden in Home.jsx)
    const MobileNav = () => (
        <div className="flex items-center justify-around px-2 h-16">
            {navLinks.filter((link) => (link.label !== "Admin Dashboard" && link.label !== "Mod Dashboard")).map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to
                return (
                    <Link
                        key={to}
                        to={to}
                        className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-200
                            ${isActive 
                                ? "text-purple-500" 
                                : "text-gray-400 hover:text-gray-700"
                            }`}
                    >
                        <Icon size={26} />
                        <span className="text-[10px] font-medium">{label}</span>
                    </Link>
                )
            })}

            {/* Avatar with dropdown for logout/profile on mobile */}
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none flex flex-col items-center gap-0.5 p-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-purple-200">
                        <img 
                            className="w-full h-full object-cover" 
                            src={user?.profilePic || pic} 
                            alt="profile pic" 
                        />
                    </div>
                    <span className="text-[10px] font-medium text-gray-400">More</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    {
                        user?.role === "admin" && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/home/admin-dashboard")}>
                                    Admin Dash
                                </DropdownMenuItem>
                            </>
                        )
                    }
                    {
                        user?.role === "moderator" && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/home/mod-dashboard")}>
                                    Mod Dash
                                </DropdownMenuItem>
                            </>
                        )
                    }
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

    // ── Desktop sidebar ────────────────────────────────────────────
    // Only rendered when this component is placed in the lg: sidebar slot
    const DesktopNav = () => (
        <div className="h-screen flex flex-col justify-between py-4 px-1">
            {/* Logo */}
            <div>
                <div className="flex items-center gap-2 px-2 mb-8">
                    <Waves size={24} className="text-purple-500" />
                    <span className="font-bold text-xl tracking-tight">Ripple</span>
                </div>

                {/* Nav Links */}
                <ul className="flex flex-col gap-1">
                    {navLinks.map(({ to, label, icon: Icon }) => {
                        const isActive = location.pathname === to
                        return (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-medium text-sm
                                        ${isActive 
                                            ? "bg-purple-500/10 text-purple-500" 
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{label}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* User section at bottom */}
            <div className="flex items-center justify-between px-[2px] py-3 rounded-xl hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-purple-200 flex-shrink-0">
                        <img 
                            className="w-full h-full object-cover" 
                            src={user?.profilePic || pic} 
                            alt="profile pic" 
                        />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="font-semibold text-[13px] leading-tight">
                            {user?.lastName} {user?.firstName} 
                        </h4>
                        <small className="text-gray-400 text-[11px]">@{user?.username}</small>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer outline-none p-1 rounded-lg hover:bg-gray-200 transition-all">
                        <MoreHorizontal size={18} className="text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/home/admin-dashboard")}>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )

    // Render mobile or desktop version based on context
    // Home.jsx places this inside lg:hidden (bottom bar) OR hidden lg:block (sidebar)
    return (
        <>
            <div className="md:hidden"><MobileNav /></div>
            <div className="hidden md:block h-full"><DesktopNav /></div>
        </>
    )
}
export default Navbar