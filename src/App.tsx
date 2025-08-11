import { FaHome, FaUser, FaCog, FaRobot } from "react-icons/fa";
import { NavLink, Outlet } from "react-router";

const menuItems = [
  { icon: <FaHome size={24} />, label: "Home" },
  { icon: <FaUser size={24} />, label: "Profile" },
  { icon: <FaCog size={24} />, label: "Settings" },
  { icon: <FaRobot size={24} />, label: "Bot" },
];

function App() {
  return (
    <div className="min-h-screen ">
      <div className="flex">
        <main className="flex flex-row w-full ">
          {/* Left Sidebar - 8% width */}
          <nav className="flex flex-col sticky top-0 items-center min-h-screen overflow-hidden justify-start gap-8 py-8 w-[8%] bg-gray-100 border-r border-gray-300">
            {/* {menuItems.map(({ icon, label }, i) => (
              <button
                key={i}
                title={label}
                className="flex items-center justify-center w-10 h-10 text-gray-700 transition rounded-md hover:text-blue-600 hover:bg-blue-100"
              >
                {icon}
              </button>
            ))} */}
            <NavLink to={"/"}
              title="Home"
              className="flex items-center justify-center w-10 h-10 text-gray-700 transition rounded-md hover:text-blue-600 hover:bg-blue-100"
            >
              {menuItems[0].icon}
                 
            </NavLink>
            <NavLink to={"/bot"}
              title="Bot"
              className="flex items-center justify-center w-10 h-10 text-gray-700 transition rounded-md hover:text-blue-600 hover:bg-blue-100"
            >
               {menuItems[3].icon}
              
            </NavLink>

            <div className="mt-3 text-base font-normal ">Bengali</div>
            <div className="mt-3 text-base font-normal ">Hindi</div>
            <div className="mt-3 text-base font-normal ">Chinese </div>
            <div className="mt-3 text-base font-normal ">German</div>
            <div className="mt-3 text-base font-normal ">Turkish</div>
            <div className="mt-3 text-base font-normal ">Portuguese </div>
            <div className="mt-3 text-base font-normal ">Portuguese </div>
          </nav>
          {/* Right side ai prompt - 52% width */}
               <section className="w-[92%] border-r overflow-hidden border-gray-300  items-center justify-center ">
              <div className="w-full h-full overflow-hidden rounded-md">
               {/* <ChatInterface/> */}
                <Outlet/>
              </div>
            </section>
          
        </main>
      </div>
    </div>
  );
}

export default App;
