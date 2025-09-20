import React, { useState } from "react";
import Navbar from "../Pages/MySpace/Navbar";
import Sidebar from "../Pages/MySpace/Sidebar";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main layout */}
      <div className="flex flex-1 pt-[64px]">
        {/* Sidebar: left on desktop, bottom on mobile */}
        <Sidebar user={user} />

        {/* Content */}
        <main className="flex-1 h-[calc(100vh-64px)] overflow-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
