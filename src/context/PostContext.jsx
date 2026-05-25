import { createContext, useState, useContext, useRef } from "react";
import { toast } from "sonner";

const PostContext = createContext()

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [userPosts, setUserPosts] = useState([])
    const [loadingPost, setLoadingPost] = useState(false)
    const [postsLoaded, setPostsLoaded] = useState(false)
    const baseURL = import.meta.env.VITE_BASE_URL

    const fetchPosts = async () => {
        if (postsLoaded) return
        setLoadingPost(true)
        try {
            const response = await fetch(`${baseURL}/post`, {
                method: "GET",
                credentials: "include",
            })
            const data = await response.json()
         
            if(response.ok){
                setPosts(data.allPost)
                setPostsLoaded(true)
            }else{
                setPosts([])
            }
        } catch (error) {
            setPosts([])
        } finally {
            setLoadingPost(false)
        }
    }

    const fetchUserPosts = async () => {
        setLoadingPost(true)
        try {
            const response = await fetch(`${baseURL}/post/user`, {
                method: "GET",
                credentials: "include",
            })
            const data = await response.json()
            if(response.ok){
                setUserPosts(data.userPost)
            }else{
                setUserPosts([])
            }
        } catch (error) {
            setUserPosts([])
        } finally {
            setLoadingPost(false)
        }
    }

       const deletePost = async (ID) => {
        try {
            const response = await fetch (`${baseURL}/post/delete/${ID}`, {
                method: "DELETE",
                credentials: "include"
            })

            const data = await response.json()

            if (response.ok){
                setPosts(prev => prev.filter(post => post._id !== ID))
                setUserPosts(prev => prev.filter(post => post._id !== ID))
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <PostContext.Provider value={{ posts, setPosts, userPosts, loadingPost, setPostsLoaded, fetchPosts, fetchUserPosts, deletePost }}>
            {children}
        </PostContext.Provider>
    )
}

export const usePosts = () => useContext(PostContext)