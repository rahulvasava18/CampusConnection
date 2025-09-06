import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";

import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

import Home from "./Pages/MySpace/Home";
import Profile from "./Pages/MySpace/Profile";
import Post from "./Pages/MySpace/Post";
import Chat from "./Pages/MySpace/Chat";
import Settings from "./Pages/MySpace/Settings";

import ProjectsDashboard from "./Pages/MySpace/ProjectDashboard";
import EventDashboard from "./Pages/MySpace/EventDashboard";  

const App = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes with Layout */}
      <Route
        path="/home"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/post"
        element={
          <Layout>
            <Post />
          </Layout>
        }
      />
      <Route
        path="/projects/*"
        element={
          <Layout>
            <ProjectsDashboard />
          </Layout>
        }
      />
      <Route
        path="/events/*"
        element={
          <Layout>
            <EventDashboard />
          </Layout>
        }
      />
      <Route
        path="/message"
        element={
          <Layout>
            <Chat />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
    </Routes>
  </Router>
);

export default App;
