import React from 'react';
import { MessageSquare, History, Settings, Info, Languages } from 'lucide-react';

const Sidebar: React.FC = () => {
  const supportedLanguages = [
    'English', 'Bengali', 'Hindi', 'Spanish', 'French', 'German', 
    'Arabic', 'Chinese', 'Japanese', 'Portuguese'
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-full">
      <div className="p-4">
        <nav className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
            <MessageSquare className="w-5 h-5" />
            <span>New Chat</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
            <History className="w-5 h-5" />
            <span>Chat History</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <Languages className="w-4 h-4 mr-2" />
            Supported Languages
          </h3>
          <div className="space-y-1">
            {supportedLanguages.slice(0, 5).map((lang) => (
              <div key={lang} className="text-xs text-gray-600 px-2 py-1 bg-gray-50 rounded">
                {lang}
              </div>
            ))}
            <div className="text-xs text-gray-500 px-2 py-1">
              + {supportedLanguages.length - 5} more...
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Medical Disclaimer</h4>
              <p className="text-xs text-blue-700 mt-1">
                This AI provides general health information only. Always consult qualified healthcare professionals for medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;