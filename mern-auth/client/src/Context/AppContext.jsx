import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';


export const Appcontext=createContext()

export const AppContextProvider=(props)=>{

    const backendurl=import.meta.env.VITE_BACKEND_URL
    const[isLoggedin,SetisLoggedin]=useState(false)
    const[userData,SetuserData]=useState(false)

    
 const getAuthstate=async()=>{

        try {

            const {data}=await axios.get(backendurl + '/api/auth/is-authenticated',{withCredentials:true})

            if(data.success){
                SetisLoggedin(true)
                getuserdata()
            }
            
        } catch (error) {

            toast.error(error.message)
            
        }
    }

    const getuserdata= async ()=>{

        try{

            const {data}=await axios.get(backendurl + '/api/user/userdata',{withCredentials:true})

            data.success ? SetuserData(data.userData):toast.error(data.message)

        }
        catch(error){

            toast.error(error.message)

        }

    }

    useEffect(()=>{

        getAuthstate()
    },[])

    const value={

        backendurl,
        isLoggedin,SetisLoggedin,
        userData,SetuserData,
        getuserdata

    }

    return(
        <Appcontext.Provider value={value}>
            {props.children}

        </Appcontext.Provider>
    )
}