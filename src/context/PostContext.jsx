import { createContext, useState, useContext } from "react";
import { toast } from "sonner";

const PostContext = createContext()

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [userPosts, setUserPosts] = useState([])
    const [loadingPost, setLoadingPost] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [hasMoreUserPosts, setHasMoreUserPosts] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [currentUserPage, setCurrentUserPage] = useState(1)
    const baseURL = import.meta.env.VITE_BASE_URL

    const fetchPosts = async (page = 1) => {
        setLoadingPost(true)
        try {
            const response = await fetch(`${baseURL}/post?page=${page}&limit=10`, {
                method: "GET",
                credentials: "include",
            })
            const data = await response.json()

            if (response.ok) {
                if (page === 1) {
                    setPosts(data.allPost)           // fresh load or refresh
                } else {
                    setPosts(prev => [...prev, ...data.allPost])  // append next page
                }
                setHasMore(data.hasMore)
                setCurrentPage(data.currentPage)
            } else {
                setPosts([])
            }
        } catch (error) {
            setPosts([])
        } finally {
            setLoadingPost(false)
        }
    }

    const fetchUserPosts = async (page = 1) => {
        setLoadingPost(true)
        try {
            const response = await fetch(`${baseURL}/post/user?page=${page}&limit=10`, {
                method: "GET",
                credentials: "include",
            })
            const data = await response.json()

            if (response.ok) {
                if (page === 1) {
                    setUserPosts(data.userPost)
                } else {
                    setUserPosts(prev => [...prev, ...data.userPost])
                }
                setHasMoreUserPosts(data.hasMore)
                setCurrentUserPage(data.currentPage)
            } else {
                setUserPosts([])
            }
        } catch (error) {
            setUserPosts([])
        } finally {
            setLoadingPost(false)
        }
    }

    const editPost = async (ID, formData) => {
        try {
            const response = await fetch(`${baseURL}/post/edit/${ID}`, {
                method: "PATCH",
                credentials: "include",
                body: formData
            })
            const data = await response.json()

            if (response.ok) {
                setPosts(prev => prev.map(p => p._id === ID ? data.post : p))
                setUserPosts(prev => prev.map(p => p._id === ID ? data.post : p))
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("An error occurred while editing the post.")
        }
    }

    const deletePost = async (ID) => {
        try {
            const response = await fetch(`${baseURL}/post/delete/${ID}`, {
                method: "DELETE",
                credentials: "include"
            })
            const data = await response.json()

            if (response.ok) {
                setPosts(prev => prev.filter(post => post._id !== ID))
                setUserPosts(prev => prev.filter(post => post._id !== ID))
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <PostContext.Provider value={{
            posts, setPosts,
            userPosts,
            loadingPost,
            hasMore,
            hasMoreUserPosts,
            currentPage,
            currentUserPage,
            fetchPosts,
            fetchUserPosts,
            editPost,
            deletePost
        }}>
            {children}
        </PostContext.Provider>
    )
}

export const usePosts = () => useContext(PostContext)