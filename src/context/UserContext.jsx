import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [contacts, setContacts] = useState([])
    const [loadingProfile, setLoadingProfile] = useState(false)
    const [loadingContact, setLoadingContact] = useState(false)
    const baseURL = import.meta.env.VITE_BASE_URL

    const getUserProfile = async () => {
        try {
            const response = await fetch(`${baseURL}/user/profile`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Cache-Control": "no-cache"
                }
            })
          
            const data = await response.json()

            if(response.ok){
                setUser(data.profile)
            }else{
                setUser(null)
            }
        } catch (error) {
            setUser(null)
        }finally{
            setLoading(false)
        }
    }

    const getOtherUserProfile = async (ID) => {
        setProfile(null)
        setLoadingProfile(true)
        try {
            const response = await fetch(`${baseURL}/user/get-other-user-profile?ID=${ID}`, {
                method: "GET",
                credentials: "include"
            })

            const data = await response.json()

            if(response.ok){
                setProfile(data.user)
            }
        } catch (error) {
            // console.log(error.message)
        } finally{
            setLoadingProfile(false)
        }
    }

    const getAllUsers = async () => {
        setLoadingContact(true)
        try {
            const response = await fetch(`${baseURL}/user/get-all-users`, {
                method: "GET",
                credentials: "include"
            })

            const data = await response.json()

            if (response.ok) {
                setContacts(data.users)
            }
        } catch (error) {
            console.log(error.message)
        } finally{
            setLoadingContact(false)
        }
    }

    useEffect(() => {
        getAllUsers() 
        getUserProfile()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, loading, profile, loadingProfile, contacts, loadingContact, getOtherUserProfile, getAllUsers }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext)