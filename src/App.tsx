// import Header from './components/Header';

import ChatInterface from "./components/ChatInterface";

function App() {
  return (
    <div className="min-h-screen border border-black">
      {/* <Header /> */}
      <div className="flex ">
        <main className="flex flex-col items-center w-full gap-3 px-6 border md:flex-row border-b-rose-400">
          {/* col 1 */}
          <div className="flex flex-col items-start gap-5 text-left w-full md:w-[15%]">
            <div>menu</div>
            <div>menu</div>
            <div>menu</div>
            <div>menu</div>
          </div>
          {/* col 2 */}
          <div className="flex flex-col gap-10 border-2 border-green-700 colum-2 w-full md:w-[45%] min-h-screen">
            content
          </div>
          {/* col 3 */}
          <div className="w-full md:w-[40%]">
            <div className="h-full max-w-6xl mx-auto border border-black">
              <ChatInterface />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
