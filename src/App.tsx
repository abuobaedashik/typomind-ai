import { useState, useRef } from "react";
import { FaHome, FaUser, FaCog, FaRobot } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiArrowDownWideFill } from "react-icons/ri";
import { NavLink, Outlet } from "react-router";

const menuItems = [
  { icon: <FaHome size={24} />, label: "Home", path: "/" },
  { icon: <FaUser size={24} />, label: "Profile", path: "/profile" },
  { icon: <FaCog size={24} />, label: "Settings", path: "/settings" },
  { icon: <FaRobot size={24} />, label: "Bot", path: "/bot" },
];

function App() {
  const [hideNavigationItems, setHideNavigationItems] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row">
        <main className="flex flex-col w-full md:flex-row">
          {/* Navigation */}
          <nav
            className={`
              ${hideNavigationItems ? "flex" : "hidden "}
              bg-gray-100 border-b md:border-b-0 md:border-r border-gray-300
              gap-4 p-4
              flex-row md:flex-col
              sticky top-0 z-50
              md:min-h-screen md:w-[8%] w-full
              items-center justify-center md:justify-start
              transition-all duration-300 md:hidden
            `}
          >
            {/* Hamburger menu (only for mobile) */}
            <div
              onClick={() => setHideNavigationItems(false)}
              className="cursor-pointer"
            >
              <RiArrowDownWideFill />
            </div>

          </nav>
          <nav
            className={`
              ${hideNavigationItems ? "hidden" : "flex"}
              bg-gray-100 border-b md:border-b-0 md:border-r border-gray-300
              gap-4 p-4
              flex-row md:flex-col
              sticky top-0 z-50
              md:min-h-screen md:w-[8%] w-full
              items-center justify-center md:justify-start
              transition-all duration-300
            `}
          >
            {/* Hamburger menu (only for mobile) */}
            <div
              onClick={() => setHideNavigationItems(true)}
              className="cursor-pointer"
            >
              <GiHamburgerMenu />
            </div>

            {/* Menu items */}
            {menuItems.map(({ icon, path, label }, i) => (
              <NavLink
                key={i}
                to={path}
                title={label}
                className="flex items-center justify-center w-10 h-10 text-gray-700 transition rounded-md hover:text-blue-600 hover:bg-blue-100"
              >
                {icon}
              </NavLink>
            ))}

            {/* Language selector */}
            <select
              defaultValue="English"
              className="border-none w-28 select select-primary"
            >
              <option>English</option>
              <option>Bengali</option>
              <option>Hindi</option>
              <option>Chinese</option>
              <option>German</option>
              <option>Turkish</option>
              <option>Portuguese</option>
            </select>
          </nav>

          {/* Hidden nav trigger */}
          <div
            onMouseEnter={() => {
              timerRef.current = setTimeout(() => {
                setHideNavigationItems(false);
              }, 100);
            }}
            onMouseLeave={() => {
              if (timerRef.current) {
                clearTimeout(timerRef.current);
              }
            }}
            className={`${
              hideNavigationItems
                ? "w-4 min-h-screen flex items-start gap-2"
                : "hidden"
            } overflow-hidden w-6 items-center justify-center md:flex hidden`}
          ></div>

          {/* Main Content */}
          <section
            className={`${
              hideNavigationItems
                ? "w-full"
                : "md:w-[92%] w-full"
            } min-h-screen overflow-hidden`}
          >
            <div className="w-full h-full overflow-hidden rounded-md">
              <Outlet />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
