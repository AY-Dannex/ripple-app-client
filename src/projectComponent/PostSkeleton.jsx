import { Skeleton } from "@/components/ui/skeleton";

function PostSkeleton (){
    return(
        <div className="flex flex-col">
            <div>
                <div className="flex px-5 gap-2 items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Skeleton className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-3 w-30"/>
                                <Skeleton className="h-3 w-20"/>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Skeleton className="h-3 w-20"/>
                                <Skeleton className="h-3 w-30"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ml-17 mb-5">
                    <div className="mt-2 pr-5 h-10 flex flex-col gap-2">
                        <Skeleton className="w-full h-full"/>
                    </div>
                    <div className="rounded-3xl h-100 mt-5 mr-5">
                        <Skeleton className="w-full h-full"/>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex px-5 gap-2 items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Skeleton className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-3 w-30"/>
                                <Skeleton className="h-3 w-20"/>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Skeleton className="h-3 w-20"/>
                                <Skeleton className="h-3 w-30"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ml-17 mb-5">
                    <div className="mt-2 pr-5 h-10 flex flex-col gap-2">
                        <Skeleton className="w-full h-full"/>
                    </div>
                    <div className="rounded-3xl h-100 mt-5 mr-5">
                        <Skeleton className="w-full h-full"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PostSkeleton