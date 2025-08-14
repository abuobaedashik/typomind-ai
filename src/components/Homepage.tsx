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
                <div className="mt-4 text-center px-20 lg:px-32 text-[#ffff] text-base">Our Medical Assistant helps you get instant, reliable, and multilingual health information. Whether you need quick advice, medical translations, or symptom guidance, we are here to support your well-being 24/7.</div>
                <NavLink to="/bot" className="inline-block px-6 py-3 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Get Started</NavLink>
            </div>
        </div>
    );
};

export default Homepage;