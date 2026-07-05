import { formatDistanceToNow } from "date-fns"
import { useState, useEffect } from "react"
import { X, MoreVertical, Heart } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import OtherUserProfile from "./OtherUserProfile.jsx"
import { useUser } from "../context/UserContext.jsx"
import { usePosts } from "../context/PostContext.jsx"
import {
    Dialog, 
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Plus, Loader2,  } from "lucide-react"

function PostCard ({ profilePic, images, firstName, lastName, username, content, visibility, dateUpdated, id, pageType, userID, likes, likedByMe }) {
    const timeAgo = formatDistanceToNow(new Date(dateUpdated), { addSuffix: true })
    const [selectedImage, setSelectedImage] = useState(null)
    const { user, getOtherUserProfile } = useUser()
    const { deletePost, editPost, likeCount, toggleLike } = usePosts()

    // Edit state
    // const [editDescription, setEditDescription] = useState(content)
    // const [editVisibility, setEditVisibility] = useState(visibility)
    // const [keepImages, setKeepImages] = useState(images || [])
    // const [newImages, setNewImages] = useState([])
    // const [newImagePreviews, setNewImagePreviews] = useState([])
    // const [editLoading, setEditLoading] = useState(false)

    // Cleanup object URLs on unmount
    // useEffect(() => {
    //     return () => newImagePreviews.forEach(url => URL.revokeObjectURL(url))
    // }, [newImagePreviews])

    const canDelete = () => {
        if (pageType === "admin") return true
        if (pageType === "profile") return user.id === userID
        if (pageType === "feed") return false   
    }

    const canView = () => {
        if (pageType === "profile") return false
        if (pageType === "feed") return true
        if (pageType === "admin") return true
    }

    // const canEdit = () => {
    //     if (pageType === "admin") return false
    //     if (pageType === "profile") return user._id === userID
    //     if (pageType === "feed") return false   
    // }

    // // Remove an existing image (already on Cloudinary)
    // const removeKeepImage = (index) => {
    //     setKeepImages(prev => prev.filter((_, i) => i !== index))
    // }

    // // Remove a newly selected image (not yet uploaded)
    // const removeNewImage = (index) => {
    //     URL.revokeObjectURL(newImagePreviews[index])
    //     setNewImages(prev => prev.filter((_, i) => i !== index))
    //     setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
    // }

    // // Handle new file selection — mirrors UploadPost's handleFileChange
    // const handleImageSelect = (e) => {
    //     const selected = Array.from(e.target.files)
    //     const merged = [...newImages, ...selected]

    //     if (keepImages.length + merged.length > 4) {
    //         toast.error("You can upload at most 4 images.")
    //         return
    //     }

    //     setNewImages(merged)
    //     setNewImagePreviews(merged.map(file => URL.createObjectURL(file)))
    //     e.target.value = "" // reset so same file can be re-selected
    // }

    // // Submit the edit — mirrors UploadPost's handlePost
    // const handleEdit = async () => {
    //     setEditLoading(true)
    //     try {
    //         const formData = new FormData()
    //         formData.append("description", editDescription)
    //         formData.append("visibility", editVisibility)
    //         formData.append("keepImages", JSON.stringify(keepImages))
    //         newImages.forEach(file => formData.append("images", file))

    //         await editPost(id, formData)
    //     } catch (error) {
    //         toast.error("An error occurred while editing the post.")
    //         console.error("Edit post error:", error)
    //     } finally {
    //         setEditLoading(false)
    //     }
    // }

    const imageCount = images?.length ?? 0

    const gridClass = {
        1: "grid-cols-1 grid-rows-1",
        2: "grid-cols-2 grid-rows-1",
        3: "grid-cols-2 grid-rows-2",
        4: "grid-cols-2 grid-rows-2",
    }[imageCount] ?? "grid-cols-2"

    const getImageClass = (index) => {
        if (imageCount === 3 && index === 2) return "row-span-2"
        return ""
    }

    const renderImages = () => {
        if (!images || imageCount === 0) return null

        if (imageCount === 4) {
            return (
                <div className="grid grid-cols-2 grid-rows-2 gap-1 rounded-3xl overflow-hidden border border-purple-200 w-full h-60 sm:h-70 md:h-80">
                    <div className="overflow-hidden col-start-1 row-start-1">
                        <img src={images[0]} alt="post" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(images[0])} />
                    </div>
                    <div className="overflow-hidden col-start-1 row-start-2">
                        <img src={images[1]} alt="post" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(images[1])} />
                    </div>
                    <div className="overflow-hidden col-start-2 row-start-1">
                        <img src={images[2]} alt="post" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(images[2])} />
                    </div>
                    <div className="overflow-hidden col-start-2 row-start-2">
                        <img src={images[3]} alt="post" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(images[3])} />
                    </div>
                </div>
            )
        }

        if (imageCount === 3) {
            return (
                <div className="grid grid-cols-2 grid-rows-2 gap-1 rounded-3xl overflow-hidden border border-purple-200 w-full h-60 sm:h-70 md:h-80">
                    <div className="overflow-hidden col-start-1 row-start-1">
                        <img src={images[0]} alt="post" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(images[0])} />
                    </div>
                    <div className="overflow-hidden col-start-1 row-start-2">
                        <img src={images[1]} alt="post" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(images[1])} />
                    </div>
                    <div className="overflow-hidden col-start-2 row-start-1 row-span-2">
                        <img src={images[2]} alt="post" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(images[2])} />
                    </div>
                </div>
            )
        }

        return (
            <div className={`grid ${gridClass} gap-1 rounded-3xl overflow-hidden border border-purple-200 w-full h-60 sm:h-70 md:h-80`}>
                {images.map((pic, index) => (
                    <div key={index} className={`overflow-hidden ${getImageClass(index)}`}>
                        <img src={pic} alt="post" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(pic)} />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <div className="flex px-2 gap-2 items-center sm:px-5">
                <div className="w-12">
                    <div className="w-10 h-10 rounded-full border-2 border-purple-400 overflow-hidden">
                        <img src={profilePic} alt="" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center gap-3">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex flex-col">
                                <h4 className="font-medium text-[14px] sm:text-[16px]">{lastName} {firstName}</h4> 
                                <small className="text-gray-500 text-[12px] sm:text-[14px]">@{username}</small>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <small className="text-[12px] sm:text-[14px]">{visibility}</small>
                                <small className="text-[12px] sm:text-[14px]">{timeAgo}</small>
                            </div>
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="cursor-pointer outline-none">
                                    <MoreVertical size={25} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="">
                                    {canView() && (
                                        <DropdownMenuItem className="px-3 py-2" onSelect={(e) => e.preventDefault()}>
                                            <Drawer>
                                                <DrawerTrigger className="cursor-pointer" onClick={() => getOtherUserProfile(userID)}>
                                                    View Profile
                                                </DrawerTrigger>
                                                <DrawerContent className="absolute m-auto max-w-[1000px]">
                                                    <OtherUserProfile />
                                                </DrawerContent>
                                            </Drawer>
                                        </DropdownMenuItem>
                                    )}
                                   
                                    {canDelete() && (
                                        <div>
                                            <DropdownMenuItem
                                                onClick={() => deletePost(id)}
                                                className="text-red-500 cursor-pointer px-3 py-2"
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </div>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ml-12 mb-5 sm:ml-17">
                <div className="mt-2 mb-2 pr-5">
                    <p className="text-[14px] whitespace-pre-wrap sm:text-[16px]">{content}</p>
                </div>
                <div className="pr-5 max-w-230">
                    {renderImages()}
                </div>
                <div className="mt-3 mr-5 flex justify-around items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Heart
                            size={25}
                            onClick={() => toggleLike(id)}
                            className={`cursor-pointer transition-transform active:scale-125 ${
                                likedByMe ? "fill-red-500 text-red-500" : "text-gray-400"
                            }`}
                        />
                        <span className="text-gray-400 text-[14px] sm:text-[16px]">{likes?.length}</span>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white cursor-pointer"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="full screen"
                        className="max-w-[90%] max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    )
}

export default PostCard
