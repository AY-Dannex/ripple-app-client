import Post from "./Post";
import UploadPost from "./UploadPost";
import WritePost from "./WritePost";

function PostPage (){
    return(
        <div className="px-2">
            <WritePost />
            <Post />
            <UploadPost />
        </div>
    );
}
export default PostPage