import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, CameraIcon } from "lucide-react";
import PostCard from "./postCard"
import pic from "../assets/pic.jpg"
import PostSkeleton from "./PostSkeleton.jsx"
import { usePosts } from "../context/PostContext.jsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"

function Profile (){
    const { user, setUser } = useUser()
    const [readOnly, setReadOnly] = useState(true)
    const [loading, setLoading] = useState(false)
    const [picLoading, setPicLoading] = useState(false)
    const [profilePic, setProfilePic] = useState(null)
    const {userPosts, loadingPost, fetchUserPosts} = usePosts()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        created: "",
        bio: ""
    })
    const baseURL = import.meta.env.VITE_BASE_URL

    const roleStyles = {
        admin: "bg-purple-100 text-purple-500",
        moderator: "bg-blue-100 text-blue-500",
        user: "bg-green-100 text-green-500"
    }

    const handleEdit = () => {
        setReadOnly(false)
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${baseURL}/user/update-profile`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username,
                    email: formData.email,
                    bio: formData.bio
                })
            })
            const data = await response.json()

            if(response.ok){
                toast.success(data.message)
                setUser(data.profile)
                // console.log(data.profile)
                setReadOnly(true)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally{
            setLoading(false)
        }
    }

    const handleUploadProfilePic = async (e) =>{
        try {
            setPicLoading(true)
            const file = e.target.files[0]

            if(!file) return

            setProfilePic(URL.createObjectURL(file))

            const formData = new FormData()
            formData.append("profilePic", file)

            const response = await fetch (`${baseURL}/user/upload-profile-pic`, {
                method: "PATCH",
                credentials: "include",
                body: formData
            })

            const data = await response.json()

            if(response.ok){
                toast.success(data.message)
                setUser(data.profile)
                setPicLoading(false)
            }else{
                toast.error(data.message)
                setPicLoading(false)
            }
        } catch (error) {
            toast.error(error.message)
            setPicLoading(false)
        }
    }

    const handleDeleteProfilePic = async () => {
        try {
            setPicLoading(true)
            const response = await fetch(`${baseURL}/user/delete-profile-pic`, {
                method: "DELETE",
                credentials: "include"
            })

            const data = await response.json()

            if(response.ok){
                toast.success(data.message)
                setUser(data.profile)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            // console.log(`Error: ${error.message}`)
        } finally{
            setPicLoading(false)
        }
    }

    const allUserPosts = userPosts?.slice().reverse().map((post) => (
        <PostCard
            key={post._id}
            id={post._id}
            profilePic={user?.profilePic || pic}
            username={post.user.username}
            firstName={post.user.firstName}
            lastName={post.user.lastName}
            content={post.description}
            images={post.image}
            visibility={post.visibility}
            dateUpdated={post.updatedAt}
            role={post.user.role}
            pageType="profile"
        />
    ))

    useEffect(() => {
        setFormData({
            id: user?.id || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            username: user?.username || "",
            email: user?.email || "",
            bio: user?.bio || "",
            role: user?.role || "",
            created: user?.created || "",
        })

        setProfilePic(user?.profilePic || pic)

        fetchUserPosts()
    }, [])

    return(
        <div className="w-full px-3 py-2">
            <h1 className="text-[20px] font-medium mb-3">My Profile</h1>
            <div className="w-full flex gap-5 items-center py-5 px-5 rounded-xl border shadow-md">

                {/* PROFILE PIC SECTION */}
                <div className="w-20 h-20 relative sm:w-20 sm:h-20 md:w-30 md:h-30">
                    <div className="pic w-20 h-20 rounded-[300px] border overflow-hidden cursor-pointer relative sm:w-20 sm:h-20 md:w-30 md:h-30">
                        {profilePic && <img src={user.profilePic || pic} alt="profile-pic" className="w-full h-full object-cover cursor-pointer" />}

                        {/* Dropdown overlay */}
                        {!picLoading && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="outline-none">
                                    <div className="absolute inset-0 z-10 cursor-pointer rounded-[300px]"></div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-fit">
                                    <DropdownMenuItem className="px-4 py-2 cursor-pointer">
                                        <label htmlFor="picture" className="cursor-pointer w-full">Upload Photo</label>
                                    </DropdownMenuItem>
                                    {user.profilePic && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={(e) => e.preventDefault()} className="px-4 py-2 cursor-pointer">
                                                <Dialog>
                                                    <DialogTrigger className="cursor-pointer">See Profile Picture</DialogTrigger>
                                                    <DialogContent>
                                                        <div>
                                                            <img src={user.profilePic} alt="" />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleDeleteProfilePic} className="px-4 py-2 text-red-500 cursor-pointer">
                                                Delete Profile Picture
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Loading state */}
                        {picLoading && (
                            <div className="absolute inset-0 bg-black/50 rounded-[300px] flex items-center justify-center z-20">
                                <Loader2 className="animate-spin text-white" />
                            </div>
                        )}
                    </div>

                    {/* Camera icon - OUTSIDE overflow hidden */}
                    <div className="absolute bottom-0 right-0 bg-black rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-20">
                        <label htmlFor="picture" className="cursor-pointer flex items-center justify-center w-full h-full">
                            <CameraIcon className="text-white" size={18}/>
                        </label>
                        <input
                            type="file"
                            id="picture"
                            disabled={picLoading}
                            accept="image/*"
                            onChange={(e) => handleUploadProfilePic(e)}
                            className="hidden"
                        />
                    </div>
                </div>

                <div>
                    <h2 className="font-medium text-[16px] md:text-[18px]">{user?.lastName} {user?.firstName}</h2>
                    <small className={`rounded px-1 font-medium text-[#555] ${roleStyles[user.role]}`}>{user?.role}</small>
                </div>
            </div>

            <div className="w-full py-4 px-5 mt-3 rounded-xl border shadow-md">
                <div className="w-full flex gap-2 items-center justify-between">
                    <h1 className="text-[16px] sm:text-[20px] font-medium">Personal Information</h1>
                    <Button onClick={readOnly ? handleEdit : handleSave} className="cursor-pointer w-20 py-3 px-5">
                        {loading ? <Loader2 className="animate-spin"/> : readOnly ? "Edit" : "Save"}
                    </Button>
                </div>
                <br />
                <div className="grid grid-cols-2 gap-2 mb-5 lg:grid-cols-3">
                    <div className="flex flex-col gap-1">
                        <small className="pl-3">First Name</small>
                        <Input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} readOnly={readOnly} className="font-medium !border-none outline-none !ring-0 focus:!ring-0 focus:!border-none shadow-none text-[14px] lg:text-[16px]"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <small className="pl-3">Last Name</small>
                        <Input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} readOnly={readOnly} className="font-medium !border-none outline-none !ring-0 focus:!ring-0 focus:!border-none shadow-none text-[14px] lg:text-[16px]"/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <small className="pl-3">Username</small>
                        <Input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} readOnly={readOnly} className="font-medium !border-none outline-none !ring-0 focus:!ring-0 focus:!border-none shadow-none text-[14px] lg:text-[16px]"/>
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                        <small className="pl-3">Role</small>
                        <p className="font-medium pl-3 text-[14px] lg:text-[16px]">{formData.role}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="flex flex-col justify-center gap-1">
                        <small className="pl-3">Email</small>
                        <Input type="text" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} readOnly={readOnly} className="font-medium !border-none outline-none !ring-0 focus:!ring-0 focus:!border-none shadow-none text-[14px] lg:text-[16px]"/>
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                        <small className="pl-3 mb-2">Member Since</small>
                        <p className="font-medium text-[14px] lg:text-[16px] pl-3">{new Date(formData.created).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="w-full mt-10 flex flex-col gap-3">
                    <small className="px-3">Bio</small>
                    <textarea
                        readOnly={readOnly}
                        placeholder="Add a bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full h-30 border rounded-xl p-2 text-[14px] resize-none"
                    ></textarea>
                </div>
            </div>

            <div className="mt-15">
                <h1 className="text-[20px] font-medium text-center">My Posts ({userPosts.length})</h1>
                <div className="flex flex-col gap-2 mt-10">
                    {loadingPost ? (
                        <PostSkeleton />
                    ) : (
                        allUserPosts
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile