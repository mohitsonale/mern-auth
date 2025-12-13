import { useNavigate } from "react-router";
import { assets } from "../assets/assets"

function Navbar(){

    const navigate=useNavigate()

    return(
        <div className="w-full flex justify-between item-center p-4 sm:p-6 sm:px-24 absolute top-0 mt-4">
            <img src={assets.logo} alt="" className="w-28 sm:w-32" />
            <button onClick={()=>navigate('/login')} 
            className="flex item-center gap-2  border border-gray-400 rounded-full px-6 py-2
             text-gray-800 hover:bg-gray-100 transition-all cursor-pointer  ">Login <img src={assets.arrow_icon} alt="" /></button>
        </div>
    )
}

export default Navbar;