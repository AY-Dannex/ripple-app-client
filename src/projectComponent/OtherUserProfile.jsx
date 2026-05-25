import { useUser } from "../context/UserContext";
import pic from "../assets/pic.jpg"
import OtherUserProfileSkeleton from "./OtherUserProfileSkeleton";

function OtherUserProfile(){
    const { profile, loadingProfile } = useUser()

    const roleStyles = {
        admin: "bg-purple-100 text-purple-500",
        moderator: "bg-blue-100 text-blue-500",
        user: "bg-green-100 text-green-500"
    }

    return(
        <div>
            {
                loadingProfile ? (
                    <OtherUserProfileSkeleton />
                ) : (
                    <div className="px-5 py-4">
                        <div className="w-full flex gap-5 items-center  py-5 px-5 rounded-xl border shadow-md">
                            <div className="pic w-20 h-20 rounded-[300px] relative border cursor-pointer overflow-hidden">
                                <img src={profile?.profilePic || pic} alt="profile-pic" className="z-5 w-full h-full object-cover cursor-pointer " />
                            </div>
                            <div>
                                <h2 className="font-medium text-[18px]">{profile?.lastName} {profile?.firstName}</h2>
                                <small className={`rounded px-1 font-medium text-[#555] ${roleStyles[profile.role]}`}>{profile?.role}</small>
                            </div>
                        </div>
                        <div className="w-full py-4 px-5 mt-3 rounded-xl border shadow-md">
                            <div className="w-full flex justify-between">
                                <h1 className="text-[20px] font-medium">Persornal Information</h1>
                            </div>
                            <br />
                            <div className="grid grid-cols-2 gap-5 mb-5 lg:grid-cols-3">
                                <div className="flex flex-col gap-1">
                                    <small className="pl-3">First Name</small>
                                    <p className="pl-3 font-medium">{profile?.firstName}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <small className="pl-3">Last Name</small>
                                    <p className="pl-3 font-medium">{profile?.lastName}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <small className="pl-3">Username</small>
                                    <p className="pl-3 font-medium">{profile?.username}</p>
                                </div>
                                <div className="flex flex-col justify-center gap-1">
                                    <small className="pl-3">Role</small>
                                    <p className="font-medium pl-3 text-sm">{profile?.role}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6 ">
                                <div className="flex flex-col justify-center gap-1">
                                    <small className="pl-3">Email</small>
                                    <p className="pl-3 font-medium">{profile?.email}</p>
                                </div>
                            </div>
                            <div className="w-full mt-5 flex flex-col gap-3">
                                <small className="px-3">Bio</small>
                                <textarea readOnly placeholder="Add a bio" value={profile?.bio} className="w-full h-25 border rounded-xl px-3 py-2 text-[14px] resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
export default OtherUserProfile