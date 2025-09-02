import React from 'react';
import { MessageSquare, History, Settings, Info, Languages } from 'lucide-react';

const Sidebar: React.FC = () => {
  const supportedLanguages = [
    'English', 'Bengali', 'Hindi', 'Spanish', 'French', 'German', 
    'Arabic', 'Chinese', 'Japanese', 'Portuguese'
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 shadow-lg">
      <div className="p-4">
        <nav className="space-y-2">
          <button className="flex items-center w-full px-3 py-2 space-x-3 text-left text-gray-700 transition-colors duration-200 rounded-lg hover:bg-blue-50 hover:text-blue-600">
            <MessageSquare className="w-5 h-5" />
            <span>New Chat</span>
          </button>
          
          <button className="flex items-center w-full px-3 py-2 space-x-3 text-left text-gray-700 transition-colors duration-200 rounded-lg hover:bg-blue-50 hover:text-blue-600">
            <History className="w-5 h-5" />
            <span>Chat History</span>
          </button>
          
          <button className="flex items-center w-full px-3 py-2 space-x-3 text-left text-gray-700 transition-colors duration-200 rounded-lg hover:bg-blue-50 hover:text-blue-600">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <h3 className="flex items-center mb-2 text-sm font-semibold text-gray-800">
            <Languages className="w-4 h-4 mr-2" />
            Available Languages
          </h3>
          <div className="space-y-1">
            {supportedLanguages.slice(0, 5).map((lang) => (
              <div key={lang} className="px-2 py-1 text-xs text-gray-600 rounded bg-gray-50">
                {lang}
              </div>
            ))}
            <div className="px-2 py-1 text-xs text-gray-500">
              + {supportedLanguages.length - 5} more...
            </div>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-blue-50">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Medical Disclaimer</h4>
              <p className="mt-1 text-xs text-blue-700">
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