import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import UserManagement from "./UserManagement";
import PostManagement from "./PostManagement";

function AdminDashboard (){
    const [tabName, setTabName] = useState("User Management")
    // const [tabName, setTabName] = useState("User Management")
    const links = ["User Management", "Post Management"]
    const tabs = links.map((tab) => (<Button key={tab} onClick={() => setTabName(tab)} className={`px-5 py-5 cursor-pointer transition text-[12px] sm:text-[14px] px-4 py-4  ${tabName === tab ? "bg-purple-200 text-purple-500" : "bg-transparent text-purple-500"}`}> {tab} </Button>))
    
    useEffect(() => {
        // console.log(tabName)
    }, [tabName])
    
    return(
        <div>
            <div className="w-full h-fit py-1 bg-white sticky top-0 z-10">
                <div className="w-fit gap-1 border rounded rounded-xl  py-1 px-1 m-auto flex flex-row  justify-between">
                    {tabs}
                </div>
            </div>
            <div className="px-5 py-5">
                {
                    tabName === "Post Management" ? <PostManagement />  : <UserManagement />
                }
            </div>
        </div>
    )
};
export default AdminDashboard