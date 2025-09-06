import React from "react";
import Navbar from "../Pages/MySpace/Navbar";
import Sidebar from "../Pages/MySpace/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const userId = localStorage.getItem("userId");
  //       if (!token) {
  //         navigate("/login");
  //         return;
  //       }

  //       const res = await fetch(`http://localhost:3000/api/user/profile/${userId}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`, // if your backend uses JWT
  //         },
  //       });

  //       if (res.status === 200) {
  //       console.log("side bar data",res);
  //       const data = await res.json();
  //       setUser(data);} 
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchUser();
  // }, []);
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main layout below navbar */}
      <div className="flex flex-1 pt-[64px]"> 
        {/* Sidebar */}
        <div className="fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-white shadow z-40">
          <Sidebar user={user}/>
        </div>

        {/* Content */}
        <main className="ml-64 flex-1 h-[calc(100vh-64px)] overflow-auto  bg-indigo-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
