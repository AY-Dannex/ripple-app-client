import { useState, useEffect } from "react"
import { usePosts } from "../context/PostContext.jsx"
import { useUser } from "../context/UserContext.jsx"
import { Loader2, Trash2, CornerDownRight,  SendHorizonal} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import pic from "../assets/pic.jpg"

function CommentSection({ postId }) {
    const { user } = useUser()
    const {
        comments, loadingComments, hasMoreComments, currentCommentPage,
        fetchComments, addComment, addReply, deleteComment
    } = usePosts()

    const [text, setText] = useState("")
    const [replyText, setReplyText] = useState("")
    const [replyingTo, setReplyingTo] = useState(null) // comment ID being replied to
    const [showReplies, setShowReplies] = useState({})  // track which comments have replies open

    useEffect(() => {
        fetchComments(postId, 1)
    }, [postId])

    const handleAddComment = async () => {
        if (!text.trim()) return
        await addComment(postId, text.trim())
        setText("")
    }

    const handleAddReply = async (commentId) => {
        if (!replyText.trim()) return
        await addReply(commentId, replyText.trim())
        setReplyText("")
        setReplyingTo(null)
        setShowReplies(prev => ({ ...prev, [commentId]: true }))
    }

    const toggleReplies = (commentId) => {
        setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }))
    }

    return (
        <div className="flex flex-col h-full">

            {/* Comment input */}
            <div className="flex gap-2 items-center p-4 border-b">
                <div className="w-8 h-8 rounded-full border-2 border-purple-400 overflow-hidden flex-shrink-0">
                    <img src={user?.profilePic || pic} alt="" className="w-full h-full object-cover" />
                </div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    placeholder="Write a comment..."
                    className="flex-1 text-[14px] outline-none border border-gray-200 rounded-full px-4 py-2"
                />
                <button
                    onClick={handleAddComment}
                    disabled={!text.trim()}
                    className="text-purple-500 font-medium text-[14px] disabled:opacity-40 cursor-pointer"
                >
                    <SendHorizonal className="w-5 h-5" />
                </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {loadingComments && comments.length === 0 ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-purple-400" />
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-center text-gray-400 text-[14px] py-10">No comments yet. Be the first!</p>
                ) : (
                    <>
                        {comments.map((comment) => (
                            <div key={comment._id} className="flex flex-col gap-2">

                                {/* Comment */}
                                <div className="flex gap-2 items-start">
                                    <div className="w-8 h-8 rounded-full border-2 border-purple-400 overflow-hidden flex-shrink-0">
                                        <img src={comment.user?.profilePic || pic} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="bg-gray-100 rounded-2xl px-3 py-2">
                                            <p className="font-medium text-[13px]">
                                                {comment.user?.lastName} {comment.user?.firstName}
                                            </p>
                                            <p className="text-[14px] text-gray-600">{comment.text}</p>
                                        </div>
                                        <div className="flex gap-4 px-2 mt-1 items-center">
                                            <small className="text-gray-400 text-[11px]">
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                            </small>
                                            <button
                                                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                                className="text-[12px] text-purple-500 font-medium cursor-pointer"
                                            >
                                                Reply
                                            </button>
                                            {comment.replies?.length > 0 && (
                                                <button
                                                    onClick={() => toggleReplies(comment._id)}
                                                    className="text-[12px] text-gray-500 cursor-pointer"
                                                >
                                                    {showReplies[comment._id]
                                                        ? "Hide replies"
                                                        : `View ${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`
                                                    }
                                                </button>
                                            )}
                                            {(user?.id === comment.user?._id || user.role === "admin" ) && (
                                                <button
                                                    onClick={
                                                        // () => deleteComment(comment._id, postId)
                                                        () => console.log(user.id, comment.user?._id, user.role)
                                                    }
                                                    className="text-red-400 cursor-pointer ml-auto"
                                                >
                                                    <Trash2 size={15} color="red"/>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Reply input */}
                                {replyingTo === comment._id && (
                                    <div className="flex gap-2 items-center ml-10">
                                        <div className="w-7 h-7 rounded-full border-2 border-purple-400 overflow-hidden flex-shrink-0">
                                            <img src={user?.profilePic || pic} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <input
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddReply(comment._id)}
                                            placeholder={`Reply to ${comment.user?.firstName}...`}
                                            className="flex-1 text-[13px] outline-none border border-gray-200 rounded-full px-3 py-1.5"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleAddReply(comment._id)}
                                            disabled={!replyText.trim()}
                                            className="text-purple-500 font-medium text-[13px] disabled:opacity-40 cursor-pointer"
                                        >
                                            Post
                                        </button>
                                    </div>
                                )}

                                {/* Replies */}
                                {showReplies[comment._id] && comment.replies?.length > 0 && (
                                    <div className="ml-10 flex flex-col gap-2">
                                        {comment.replies.map((reply) => (
                                            <div key={reply._id} className="flex gap-2 items-start">
                                                <CornerDownRight size={14} className="text-gray-300 mt-2 flex-shrink-0" />
                                                <div className="w-7 h-7 rounded-full border-2 border-purple-400 overflow-hidden flex-shrink-0">
                                                    <img src={reply.user?.profilePic || pic} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <div className="bg-gray-100 rounded-2xl px-3 py-2">
                                                        <p className="font-medium text-[12px]">
                                                            {reply.user?.lastName} {reply.user?.firstName}
                                                        </p>
                                                        <p className="text-[13px]">{reply.text}</p>
                                                    </div>
                                                    <small className="text-gray-400 text-[11px] px-2 mt-1">
                                                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                                        {/* <Trash2 size={13} /> */}
                                                    </small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Load more comments */}
                        {hasMoreComments && (
                            <button
                                onClick={() => fetchComments(postId, currentCommentPage + 1)}
                                disabled={loadingComments}
                                className="text-center text-purple-500 text-[13px] cursor-pointer py-2"
                            >
                                {loadingComments ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Load more comments"}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default CommentSection
