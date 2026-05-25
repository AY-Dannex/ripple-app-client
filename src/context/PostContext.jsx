import { createContext, useState, useContext, useRef } from "react";
import { toast } from "sonner";

const PostContext = createContext()

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [userPosts, setUserPosts] = useState([])
    const [loadingPost, setLoadingPost] = useState(false)
    const [postsLoaded, setPostsLoaded] = useState(false)
    // const fetchingRef = useRef(false)
    const baseURL = import.meta.env.VITE_BASE_URL
    // const [userPostsLoaded, setUserPostsLoaded] = useState(false)

    const fetchPosts = async () => {
        if (postsLoaded) return
        // fetchingRef.current = true
        setLoadingPost(true)
        try {
            const response = await fetch(`${baseURL}/post`, {
                method: "GET",
                credentials: "include",
                // headers: {
                //     "Cache-Control": "no-cache"
                // }
            })
            const data = await response.json()
         
            if(response.ok){
                setPosts(data.allPost)
                setPostsLoaded(true)
            }else{
                setPosts([])
            }
        } catch (error) {
            console.log(error.message)
            setPosts([])
        } finally {
            setLoadingPost(false)
        }
    }

    const fetchUserPosts = async () => {
        // if (userPostsLoaded) return
        setLoadingPost(true)
        try {
            const response = await fetch(`${baseURL}/post/user`, {
                method: "GET",
                credentials: "include",
                // headers: {
                //     "Cache-Control": "no-cache"
                // }
            })
            const data = await response.json()
            if(response.ok){
                setUserPosts(data.userPost)
                // console.log(data.userPost)
                // setUserPostsLoaded(true)
            }else{
                setUserPosts([])
            }
        } catch (error) {
            console.log(error.message)
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
                console.log(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error.message)
        }
    }

    return (
        <PostContext.Provider value={{ posts, setPosts, userPosts, loadingPost, setPostsLoaded, fetchPosts, fetchUserPosts, deletePost }}>
            {children}
        </PostContext.Provider>
    )
}

export const usePosts = () => useContext(PostContext)