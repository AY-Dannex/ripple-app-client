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
    const [comments, setComments] = useState([])
    const [loadingComments, setLoadingComments] = useState(false)
    const [hasMoreComments, setHasMoreComments] = useState(true)
    const [currentCommentPage, setCurrentCommentPage] = useState(1)
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
                    setPosts(data.allPost)
                } else {
                    setPosts(prev => [...prev, ...data.allPost])
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

    const fetchComments = async (postId, page = 1) => {
        setLoadingComments(true)
        try {
            const response = await fetch(`${baseURL}/comment/${postId}?page=${page}&limit=10`, {
                credentials: "include"
            })
            const data = await response.json()

            if (response.ok) {
                if (page === 1) {
                    setComments(data.comments)
                    console.log(data.comments)
                } else {
                    setComments(prev => [...prev, ...data.comments])
                }
                setHasMoreComments(data.hasMore)
                setCurrentCommentPage(data.currentPage)
            } else {
                setComments([])
            }
        } catch (error) {
            setComments([])
        } finally {
            setLoadingComments(false)
        }
    }

    const addComment = async (postId, text) => {
        try {
            const response = await fetch(`${baseURL}/comment/add/${postId}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            })
            const data = await response.json()

            if (response.ok) {
                // Add new comment to the top of the list
                setComments(prev => [{ ...data.comment, replies: [] }, ...prev])

                // Increment comment count on the post in both arrays
                const increment = (prev) => prev.map(post =>
                    post._id === postId
                        ? { ...post, commentCount: (post.commentCount || 0) + 1 }
                        : post
                )
                setPosts(increment)
                setUserPosts(increment)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Failed to add comment")
        }
    }

    const addReply = async (commentId, text) => {
        try {
            const response = await fetch(`${baseURL}/comment/reply/${commentId}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            })
            const data = await response.json()

            if (response.ok) {
                // Add reply to the correct comment
                setComments(prev => prev.map(comment =>
                    comment._id === commentId
                        ? { ...comment, replies: [...comment.replies, data.reply] }
                        : comment
                ))

                // Increment comment count on the post
                const increment = (prev) => prev.map(post =>
                    post._id === data.reply.post
                        ? { ...post, commentCount: (post.commentCount || 0) + 1 }
                        : post
                )
                setPosts(increment)
                setUserPosts(increment)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Failed to add reply")
        }
    }

    const deleteComment = async (commentId, postId) => {
        try {
            const response = await fetch(`${baseURL}/comment/delete/${commentId}`, {
                method: "DELETE",
                credentials: "include"
            })
            const data = await response.json()

            if (response.ok) {
                // Find the comment to know how many replies it has
                const comment = comments.find(c => c._id === commentId)
                const replyCount = comment?.replies?.length || 0

                // Remove comment from list
                setComments(prev => prev.filter(c => c._id !== commentId))

                // Decrement count on post
                const decrement = (prev) => prev.map(post =>
                    post._id === postId
                        ? { ...post, commentCount: Math.max(0, (post.commentCount || 0) - (1 + replyCount)) }
                        : post
                )
                setPosts(decrement)
                setUserPosts(decrement)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Failed to delete comment")
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

    const toggleLike = async (ID) => {
        const update = (prev) => prev.map(post => {
            if (post._id !== ID) return post
            const alreadyLiked = post.likedByMe
            return {
                ...post,
                likedByMe: !alreadyLiked,
                likes: { length: alreadyLiked ? post.likes.length - 1 : post.likes.length + 1 }
            }
        })

        setPosts(update)
        setUserPosts(update)

        try {
            const response = await fetch(`${baseURL}/post/like/${ID}`, {
                method: "PATCH",
                credentials: "include"
            })
            const data = await response.json()

            if (!response.ok) {
                const rollback = (prev) => prev.map(post => {
                    if (post._id !== ID) return post
                    const alreadyLiked = post.likedByMe
                    return {
                        ...post,
                        likedByMe: !alreadyLiked,
                        likes: { length: alreadyLiked ? post.likes.length - 1 : post.likes.length + 1 }
                    }
                })
                setPosts(rollback)
                setUserPosts(rollback)
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
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
            comments,
            loadingComments,
            hasMoreComments,
            currentCommentPage,
            fetchPosts,
            fetchUserPosts,
            fetchComments,
            addComment,
            addReply,
            deleteComment,
            editPost,
            deletePost,
            toggleLike,
        }}>
            {children}
        </PostContext.Provider>
    )
}

export const usePosts = () => useContext(PostContext)