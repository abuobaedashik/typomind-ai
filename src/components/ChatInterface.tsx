/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, AlertCircle } from "lucide-react";
import { detectLanguage, generateMedicalResponse } from "../utils/aiService";
import bot from "../Accets/bot.png";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  language?: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const detectedLanguage = await detectLanguage(userMessage.text);
      const botResponse = await generateMedicalResponse(
        userMessage.text,
        detectedLanguage
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        language: detectedLanguage,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I encountered an error processing your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-[1980px] rounded-lg shadow-lg bg-[#1D232A] relative">
      {/* Header */}
      <div className="md:flex items-center p-3 hidden sm:p-4 space-x-3 text-[#ffff] border-b border-[#685752] flex-shrink-0">
        <div className="p-1 rounded-full sm:p-2">
          <img
            src={bot}
            alt="bot"
            className="object-cover w-10 h-10 sm:w-12 sm:h-12 p-1 border border-[#685752] rounded-full"
          />
        </div>
        <div>
          <h2 className="text-base font-semibold sm:text-lg">
            Medical Assistant
          </h2>
          <p className="text-xs sm:text-sm text-[#ffffff]">
            Ask me any health-related questions
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 space-y-4 overflow-y-auto sm:p-4">
        {messages.length === 0 && (
          <div className="mt-8 text-center text-[#ffffff]">
            <p className="text-lg font-bold sm:text-2xl">
              Welcome to Medical Assistant
            </p>
            <p className="mt-2 text-xs sm:text-sm">
              I can help you with health-related questions in multiple
              languages.
              <br />
              Start by typing your medical query below.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] sm:max-w-xs lg:max-w-md ${
                message.sender === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <div
                className={`p-1.5 sm:p-2 rounded-full ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : " text-white"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="w-4 h-4 sm:w-4 sm:h-4" />
                ) : (
                  // <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                   <div className="flex items-center justify-center w-8 h-8 bg-[#D91656] rounded-full">
                        <img src={bot} alt="bot" className="w-4 h-4 rounded-full " />
                   </div>
                //  <Bot className="w-8 h-8 sm:w-4 sm:h-4" />
                //  <img src={bot} alt="bot" className="object-cover object-center w-5 h-5 p-3 border rounded-full sm:w-4 sm:h-4" />
                )}
              </div>
              <div
                className={`rounded-lg p-2 sm:p-3 text-sm sm:text-base ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-[#D91656] text-[#ffffff] "
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <p className="mt-1 text-[10px] sm:text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start max-w-[80%] space-x-2">
              <div className="p-1.5 sm:p-2 text-white bg-green-600 rounded-full">
                {/* <Bot className="w-3 h-3 sm:w-4 sm:h-4" /> */}
                <Bot className="w-8 h-8 sm:w-4 sm:h-4" />
              </div>
              <div className="p-2 text-gray-800 bg-white border border-gray-200 rounded-lg sm:p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 delay-75 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 delay-150 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="bottom-0 flex-shrink-0 p-3 border-t border-[#685752] sm:p-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your medical question..."
              className="w-full p-2 text-sm border border-[#685752] bg-[#1D232A] rounded-lg resize-none text-[#ffffff] sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-base"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="p-2 bg-[#1D232A] border border-[#685752] transition-colors duration-200 text-[#ffff]
            rounded-lg sm:p-3  "
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        {/* <div className="flex items-center mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500">
          <AlertCircle className="w-3 h-3 mr-1 font-bold text-white" />
          This is for informational purposes only. Always consult healthcare
          professionals.
        </div> */}
      </div>
    </div>
  );
};

export default ChatInterface;
