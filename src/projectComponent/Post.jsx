import { useState, useEffect, useRef } from "react"
import PostCard from "./postCard.jsx"
import PostSkeleton from "./PostSkeleton.jsx"
import { usePosts } from "../context/PostContext.jsx"
import pic from "../assets/pic.jpg"

function Post ({ pageType = "feed" }) {
    const { fetchPosts, posts, loadingPost, hasMore, currentPage } = usePosts()
    const sentinelRef = useRef(null)
    const observerRef = useRef(null)

    useEffect(() => {
        fetchPosts(1)
    }, [])

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect()

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loadingPost) {
                fetchPosts(currentPage + 1)
            }
        }, { threshold: 0.1 })

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current)
        }

        return () => observerRef.current?.disconnect()
    }, [hasMore, loadingPost, currentPage])

    return (
        <div className="relative">
            {loadingPost && posts.length === 0 ? (
                <PostSkeleton />
            ) : (
                <div className="flex flex-col gap-2">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            id={post._id}
                            userID={post.user._id}
                            profilePic={post.user?.profilePic || pic}
                            firstName={post.user?.firstName}
                            lastName={post.user?.lastName}
                            username={post.user?.username}
                            content={post.description}
                            images={post.image}
                            visibility={post.visibility}
                            dateUpdated={post.updatedAt}
                            pageType={pageType}
                            likes={post.likes}
                            likedByMe={post.likedByMe}
                        />
                    ))}

                    {/* Infinite scroll sentinel */}
                    <div ref={sentinelRef} className="h-1" />

                    {loadingPost && posts.length > 0 && <PostSkeleton />}

                    {!hasMore && posts.length > 0 && (
                        <p className="text-center text-gray-400 text-sm">You're all caught up</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Post