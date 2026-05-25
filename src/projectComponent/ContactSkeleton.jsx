import { Skeleton } from "@/components/ui/skeleton";

function ContactSkeleton(){
    return(
        <div className="flex gap-2 items-center p-2 rounded-xl">
            <div className="w-10 h-10 overflow-hidden rounded-3xl">
                <Skeleton className="w-full h-full"/>
            </div>
            <div className="flex flex-col gap-2">
                 <Skeleton className="w-30 h-3"/>
                 <Skeleton className="w-15 h-3"/>
            </div>
        </div>
    );
}
export default ContactSkeleton