import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react"
import ContactSkeleton from "./ContactSkeleton.jsx";
import pic from "../assets/pic.jpg"

function Contact(){
    const {user, getAllUsers, contacts, loadingContact } = useUser()
    const users = contacts?.filter((contact) => String(user.id) !== String(contact._id)).map((contact) => (
        <div key={contact._id} className="flex gap-2 items-center border p-2 rounded-xl cursor-pointer hover:bg-gray-100">
            <div className="w-10 h-10 overflow-hidden border-2 border-purple-300 rounded-3xl">
                <img className="w-full h-full object-cover" src={contact.profilePic || pic} alt="" />
            </div>
            <div className="flex flex-col ">
                <h1 className="text-[14px] font-medium">{contact.lastName} {contact.firstName}</h1>
                <small>@{contact.username}</small>
            </div>
        </div>
    ))

    
    useEffect(() => {
        getAllUsers()
        console.log("Logged in user id:", user.id, typeof user.id)
        console.log("Contacts:", contacts?.map(c => ({ id: c._id, type: typeof c._id })))
        // console.log(contacts)
     }, [])
     
    return(
        <div className="border px-5 py-3 h-screen ">
            <h1 className="text-lg font-medium">People you may know</h1>
            <div className="flex flex-col gap-3 mt-4">
                {
                    loadingContact ? <ContactSkeleton /> : users
                }
            </div>
        </div>
    );
}
export default Contact;