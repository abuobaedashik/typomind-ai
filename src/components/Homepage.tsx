import { NavLink } from "react-router";
import logo from "../Accets/bot.png";

const Homepage = () => {
    return (
        <div className="flex items-center justify-center gap-3 mt-8 md:mt-16">
            {/* <FeaturesSectionDemo/> */}
            <div className="flex flex-col items-center justify-center max-w-3xl gap-4 mt-8">
                <div>
                    <img src={logo} alt="bot-logo" className="object-cover w-20 h-20 rounded-full" />
                </div>
                <div className="px-20  text-4xl text-[#ffffff] font-bold text-center">Welcome to the Medical Assistant </div>
                <div className="mt-4 text-center px-20 lg:px-32 text-2xl text-[#ffffff]">Your Smart Health Partner, Anytime, Anywhere.</div>
                <div className="mt-4 text-center px-20 lg:px-32 text-[#ffff] text-base">This medical chatbot is designed for general informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Never disregard professional medical advice or delay seeking it because of something you have read or received through this chatbot. If you are experiencing a medical emergency, call your local emergency services immediately. Use of this chatbot is at your own risk. The creators and providers of this service are not responsible for any actions taken based on the information provided.</div>
                <NavLink to="/bot" className="inline-block px-6 py-3 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Get Started</NavLink>
            </div>
        </div>
    );
};

export default Homepage;