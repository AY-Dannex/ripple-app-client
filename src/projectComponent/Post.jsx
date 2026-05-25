import { useState, useEffect } from "react"
import PostCard from "./postCard.jsx"
import PostSkeleton from "./PostSkeleton.jsx"
import WritePost from "./WritePost.jsx"
import UploadPost from "./UploadPost.jsx"
import { usePosts } from "../context/PostContext.jsx"
import pic from "../assets/pic.jpg"

function Post ({ pageType = "feed" }) {
    const { fetchPosts, posts, loadingPost } = usePosts()

    useEffect(() => {
        fetchPosts()
    }, [])

    const allPosts = posts?.slice().reverse().map((post) => (
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
        />
    ) )
    return(
        <div className="relative">
            {
                loadingPost ? 
                (
                    <PostSkeleton />
                ) : (
                    <div className="flex flex-col gap-2">
                        {allPosts}
                    </div>
                )
            }
        </div>
    );
}
export default Post