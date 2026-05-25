import { Skeleton } from "@/components/ui/skeleton";

function OtherUserProfileSkeleton(){
    return(
        <div className="px-5 py-4">
                    {/* <h1 className="text-[20px] font-medium mb-3">My Profile</h1> */}
                    <div className="w-full flex gap-5 items-center  py-5 px-5 rounded-xl border shadow-md">
                        <div className="pic w-30 h-30 rounded-[300px] relative cursor-pointer overflow-hidden">
                             <Skeleton className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Skeleton className="w-40 h-5 object-cover"/>
                            <Skeleton className="w-20 h-5 object-cover"/>
                        </div>
                    </div>
                    <div className="w-full py-4 px-5 mt-3 rounded-xl border shadow-md">
                        <div className="w-full flex justify-between">
                            <Skeleton className="ml-2 w-70 h-8 object-cover"/>
                        </div>
                        <br />
                        <div className="grid grid-cols-3 gap-6 mb-10">
                            <div className="flex flex-col gap-1">
                                <Skeleton className="ml-2 w-20 h-4 object-cover"/>
                                <Skeleton className="ml-2 w-30 h-4 object-cover"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Skeleton className="ml-2 w-20 h-4 object-cover"/>
                                <Skeleton className="ml-2 w-30 h-4 object-cover"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Skeleton className="ml-2 w-20 h-4 object-cover"/>
                                <Skeleton className="ml-2 w-30 h-4 object-cover"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="flex flex-col justify-center gap-1">
                                <Skeleton className="ml-2 w-20 h-4 object-cover"/>
                                <Skeleton className="ml-2 w-30 h-4 object-cover"/>
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                                <Skeleton className="ml-2 w-20 h-4 object-cover"/>
                                <Skeleton className="ml-2 w-30 h-4 object-cover"/>
                            </div>
                        </div>
                        <div className="w-full mt-10 flex flex-col gap-3">
                            <Skeleton className="ml-2 w-20 h-4 object-cover"/>
                            <Skeleton className="ml-2 w-full h-30 object-cover"/>
                            
                        </div>
                    </div>
                </div>
    );
}
export default OtherUserProfileSkeleton