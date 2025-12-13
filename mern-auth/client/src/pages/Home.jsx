import Header from "../Component/Header";
import Navbar from "../Component/Navbar";

function Home(){

    return(

        <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
            <Navbar />
            <Header/>
        </div>
    )
}

export default Home;