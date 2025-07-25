import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="h-full max-w-4xl mx-auto">
            <ChatInterface />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;