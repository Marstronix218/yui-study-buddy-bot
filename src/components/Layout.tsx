
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Users, Clock } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <main className="flex-1 container mx-auto max-w-md p-4">
        {children}
      </main>
      
      <nav className="border-t border-gray-200 bg-white">
        <div className="container mx-auto max-w-md">
          <div className="flex justify-around py-3">
            <Link to="/chat" className={`flex flex-col items-center p-2 ${location.pathname === '/chat' ? 'text-blue-500' : 'text-gray-500'}`}>
              <MessageSquare size={24} />
              <span className="text-xs mt-1">チャット</span>
            </Link>
            <Link to="/" className={`flex flex-col items-center p-2 ${location.pathname === '/' ? 'text-blue-500' : 'text-gray-500'}`}>
              <Users size={24} />
              <span className="text-xs mt-1">キャラクター</span>
            </Link>
            <Link to="/study-log" className={`flex flex-col items-center p-2 ${location.pathname === '/study-log' ? 'text-blue-500' : 'text-gray-500'}`}>
              <Clock size={24} />
              <span className="text-xs mt-1">学習記録</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
