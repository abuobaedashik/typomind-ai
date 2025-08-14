import { useState } from "react";
import { FaHome, FaRobot } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiArrowDownWideFill } from "react-icons/ri";
import { NavLink, Outlet } from "react-router";
import bot from "./Accets/bot.png"; // Adjust the path as necessary
import { ThemeProvider } from "./components/theme-provider";
import { BotIcon } from "lucide-react";

const menuItems = [
  { icon: <FaHome size={24} />, label: "Home", path: "/" },
  // { icon: <img src={bot} alt="Bot" className="w-6 h-6" />, label: "Bot", path: "/bot" },
  { icon: <BotIcon size={24} />, label: "Setting", path: "/bot" },
];

function App() {
  const [hideNavigationItems, setHideNavigationItems] = useState(false);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {
        <div className="min-h-screen">
          <div className="flex flex-col md:flex-row">
            <main className="flex flex-col w-full h-full md:flex-row">
              {/* Mobile top bar */}
              <div className="sticky top-0 z-50 flex items-center p-4 bg-[#1D232A] border-b border-[#685752] md:hidden">
                <button
                  onClick={() => setHideNavigationItems(true)}
                  aria-label="Open Menu"
                  className="text-[#ffff]"
                >
                  <GiHamburgerMenu size={28} />
                </button>
                <div className="flex items-center space-x-3 text-[#131313] lex-shrink-0 pl-5">
                  <div className="p-1 rounded-full sm:p-2">
                    <img
                      src={bot}
                      alt="bot"
                      className="object-cover w-10 h-10 sm:w-12 sm:h-12 p-1 border border-[#685752] rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-base text-[#ffffff] font-semibold sm:text-lg">
                      Medical Assistant
                    </h2>
                    <p className="text-xs sm:text-sm text-[#ffffff]">
                      Ask me any health-related questions
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1D232A] border-r border-[#685752] p-4 flex flex-col items-start transition-transform duration-300 md:hidden ${
                  hideNavigationItems ? "translate-x-0" : "-translate-x-full"
                } shadow-lg`}
              >
                <button
                  onClick={() => setHideNavigationItems(false)}
                  aria-label="Close Menu"
                  className="self-end mb-6 text-[#ffffff]"
                >
                  <RiArrowDownWideFill size={24} />
                </button>

                {menuItems.map(({ icon, path, label }, i) => (
                  <NavLink
                    key={i}
                    to={path}
                    title={label}
                    className="flex items-center justify-start w-full p-2 mb-3 text-[#ffffff] rounded-md hover:text-blue-600 hover:bg-blue-100"
                    onClick={() => setHideNavigationItems(false)}
                  >
                    {icon}
                    <span className="ml-3">{label}</span>
                  </NavLink>
                ))}
                <div className="flex flex-col items-start gap-2 language">
                  <div className="mt-3 text-[#ffffff]">Choose Language</div>
                  <select
                    defaultValue="English"
                    className="w-full px-2 py-1 mt-auto border border-[#685752] rounded"
                  >
                    <option>English</option>
                    <option>Bengali</option>
                    <option>Hindi</option>
                    <option>Chinese</option>
                    <option>German</option>
                    <option>Turkish</option>
                    <option>Portuguese</option>
                  </select>
                </div>
              </nav>

              {/* Desktop Sidebar */}
              {hideNavigationItems ? (
                /* Show only a small button when hidden */
                <div className="hidden md:flex flex-col items-center justify-start p-2 bg-[#1D232A] b-b border-[#685752] md:min-h-screen md:w-[3%]">
                  <button
                    onClick={() => setHideNavigationItems(false)}
                    aria-label="Show Menu"
                    className="text-[#ffffff]"
                  >
                    <GiHamburgerMenu size={28} />
                  </button>
                </div>
              ) : (
                <nav className="hidden md:flex bg-[#1D232A] border-r border-[#685752] p-4 flex-col sticky top-0 z-50 md:min-h-screen md:w-[8%] w-full items-center justify-start gap-4">
                  <button
                    onClick={() => setHideNavigationItems(true)}
                    aria-label="Hide Menu"
                    className="text-[#ffff]"
                  >
                    <GiHamburgerMenu size={28} />
                  </button>

                  {menuItems.map(({ icon, path, label }, i) => (
                    <NavLink
                      key={i}
                      to={path}
                      title={label}
                      className="flex items-center justify-center w-10 h-10 text-[#ffff]  transition rounded-md hover:text-blue-600 hover:bg-blue-100"
                    >
                      {icon}
                    </NavLink>
                  ))}

                  <div className="mt-auto">
                    <div className="mt-3 text-[#ffffff] text-sm">Choose Language</div>
                    <select
                      defaultValue="English"
                      className="hidden mt-2 border-none w-28 select select-primary md:block"
                    >
                      <option>English</option>
                      <option>Bengali</option>
                      <option>Hindi</option>
                      <option>Chinese</option>
                      <option>German</option>
                      <option>Turkish</option>
                      <option>Portuguese</option>
                    </select>
                  </div>
                </nav>
              )}

              {/* Main Content */}
              <section
                className={`min-h-screen overflow-auto ${
                  hideNavigationItems ? "w-full" : "md:w-[92%]"
                } bg-[#1D232A] text-[#ffff] `}
              >
                <div className="w-full h-full overflow-auto">
                  <Outlet />
                </div>
              </section>
            </main>
          </div>
        </div>
      }
    </ThemeProvider>
  );
}

export default App;
