import React, { useState, useEffect } from "react";
import axios from "axios";

import ProfilePostCard from "./ProfilePostCard";
import ProfileProjectCard from "./ProfileProjectCard";
import ProfileEventCard from "./ProfileEventCard";

import {
  FiMoreHorizontal,
  FiX,
  FiUser,
  FiAtSign,
  FiMail,
  FiCalendar,
  FiBookOpen,
  FiMapPin,
  FiSmartphone,
  FiInstagram,
  FiFacebook,
  FiLinkedin,
  FiGithub,
} from "react-icons/fi";

import { FaPaperPlane } from "react-icons/fa";

const TABS = [
  { key: "posts", label: "Posts", icon: <FaPaperPlane size={20} /> },
  { key: "events", label: "Events", icon: <FiCalendar size={20} /> },
  { key: "projects", label: "Projects", icon: <FiBookOpen size={20} /> },
];

const Profile = ({ setPagename }) => {
  const [user, setUser] = useState(null);
  const [moreDetails, setMoreDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);

  // For edit form inputs
  const [formData, setFormData] = useState({});

  // For edit form submit state
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Fetch user and related data
  useEffect(() => {
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    async function fetchAllData() {
      try {
        setLoading(true);
        setError(null);

        const config = {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        };

        const [userRes, postsRes, eventsRes, projectsRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/user/profile/${userId}`, config),
          axios.get(`http://localhost:3000/api/user/post/${userId}`, config),
          axios.get(`http://localhost:3000/api/user/event/${userId}`, config),
          axios.get(`http://localhost:3000/api/user/project/${userId}`, config),
        ]);

        setUser(userRes.data);
        setPosts(postsRes.data);
        setEvents(eventsRes.data);
        setProjects(projectsRes.data);
        setFormData(userRes.data); // Pre-fill formData with user data
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message || err.response.statusText);
        } else if (err.request) {
          setError("No response from server.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [token]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md">
          Error: {error}
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg shadow-md">
          User not found.
        </div>
      </div>
    );

  const handleMoreDetailsToggle = () => {
    if (moreDetails) setMoreDetails(null);
    else {
      setMoreDetails(user);
      setEditMode(false); // close edit if open
    }
  };

  const handleEditToggle = () => {
    setEditMode((prev) => {
      const newState = !prev;
      if (newState) {
        setMoreDetails(null); // close more details if open
        setFormData(user); // reset formData to current user on open
        setSubmitError(null);
        setSubmitSuccess(null);
      }
      return newState;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      // Remove username to avoid editing it even if present
      const { username, ...editableData } = formData;

      // PUT request to update user profile
      await axios.put(
        `http://localhost:3000/api/user/update/${userId}`,
        editableData,
        config
      );
      setSubmitSuccess("Profile updated successfully!");
      setEditMode(false);
      setMoreDetails(null);

      // Refresh user data from server
      const res = await axios.get(
        `http://localhost:3000/api/user/profile/${userId}`,
        config
      );
      setUser(res.data);
      setFormData(res.data);
    } catch (err) {
      if (err.response)
        setSubmitError(err.response.data.message || err.response.statusText);
      else if (err.request) setSubmitError("No response from server.");
      else setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Prepare tab data based on activeTab
  const tabData =
    activeTab === "posts" ? posts : activeTab === "events" ? events : projects;

  return (
    <div className="max-w-5xl mx-auto pt-8 px-4 lg:px-0 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Profile Picture */}
          <div className="md:w-1/3 p-6 flex flex-col items-center">
            <img
              src={
                user.profilePic?.url ||
                "https://randomuser.me/api/portraits/men/32.jpg"
              }
              alt="Profile"
              className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-indigo-500 shadow-xl hover:scale-105 transition-transform duration-300"
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              @{user.username}
            </h2>
          </div>

          {/* Profile Details */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {user.fullname || "Full Name"}
                </h4>
                <div className="flex space-x-3">
                  <button
                    onClick={handleEditToggle}
                    className={`px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-colors
                      ${
                        editMode
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                  >
                    {editMode ? "Cancel Edit" : "Edit Profile"}
                  </button>
                  <button
                    onClick={handleMoreDetailsToggle}
                    className="flex items-center space-x-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition"
                    aria-expanded={!!moreDetails}
                  >
                    <FiMoreHorizontal size={20} />
                    <span>More Details</span>
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
                {user.bio || "No bio available"}
              </p>

              {/* Stats Section */}
              <div className="flex space-x-6 border-t border-gray-200 pt-4">
                {[
                  { label: "Posts", value: posts.length },
                  { label: "Projects", value: projects.length },
                  { label: "Followers", value: user.followers?.length || 0 },
                  { label: "Following", value: user.following?.length || 0 },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center bg-white shadow-sm px-4 py-2 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-700">
                      {stat.label}
                    </h3>
                    <p className="text-indigo-600 font-bold text-lg">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Details Section */}
      {moreDetails && (
        <div
          className="bg-white border border-indigo-300 rounded-2xl shadow-lg p-6 relative animate-slideDown"
          style={{ animationDuration: "0.4s", animationTimingFunction: "ease" }}
        >
          <button
            onClick={() => setMoreDetails(null)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-indigo-200 transition"
            aria-label="Close more details"
          >
            <FiX size={24} className="text-indigo-600" />
          </button>

          <h3 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center space-x-2">
            <FiUser size={28} />
            <span>More Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-indigo-900">
            <div>
              <h4 className="font-semibold mb-4 flex items-center space-x-2 border-b border-indigo-300 pb-1">
                <FiUser />
                <span>Personal Info</span>
              </h4>
              <p className="mb-1">
                <strong>Full Name:</strong> {moreDetails.fullname || "-"}
              </p>
              <p className="mb-1 flex items-center space-x-1">
                <FiAtSign />
                <span>{moreDetails.username || "-"}</span>
              </p>
              <p className="mb-1 flex items-center space-x-1">
                <FiMail />
                <span>{moreDetails.email || "-"}</span>
              </p>
              <p className="mb-1">
                <strong>Gender:</strong> {moreDetails.gender || "-"}
              </p>
              <p className="mb-1 flex items-center space-x-1">
                <FiCalendar />
                <span>
                  {moreDetails.dateOfBirth
                    ? new Date(moreDetails.dateOfBirth).toLocaleDateString()
                    : "-"}
                </span>
              </p>
              <p className="mb-1">
                <strong>Bio:</strong> {moreDetails.bio || "-"}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 flex items-center space-x-2 border-b border-indigo-300 pb-1">
                <FiBookOpen />
                <span>Education</span>
              </h4>
              <p className="mb-1">
                <strong>College:</strong> {moreDetails.college || "-"}
              </p>
              <p className="mb-1">
                <strong>Course:</strong> {moreDetails.course || "-"}
              </p>
              <p className="mb-1">
                <strong>Branch:</strong> {moreDetails.branch || "-"}
              </p>
              <p className="mb-1">
                <strong>Division:</strong> {moreDetails.division || "-"}
              </p>
              <p className="mb-1">
                <strong>Specialization:</strong>{" "}
                {moreDetails.specialization || "-"}
              </p>
              <p className="mb-1">
                <strong>Year of Study:</strong> {moreDetails.yearOfStudy || "-"}
              </p>
              <p className="mb-1">
                <strong>Student ID:</strong> {moreDetails.studentID || "-"}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 flex items-center space-x-2 border-b border-indigo-300 pb-1">
                <FiSmartphone />
                <span>Contact</span>
              </h4>
              <p className="mb-1">
                <strong>Mobile:</strong> {moreDetails.mobile || "-"}
              </p>
              <p className="mb-1 flex items-center space-x-1">
                <FiMapPin />
                <span>{moreDetails.address || "-"}</span>
              </p>
              <p className="mb-1">
                <strong>City:</strong> {moreDetails.city || "-"}
              </p>
              <p className="mb-1">
                <strong>State:</strong> {moreDetails.state || "-"}
              </p>
              <p className="mb-1">
                <strong>Country:</strong> {moreDetails.country || "-"}
              </p>
              <p className="mb-1">
                <strong>Postal Code:</strong> {moreDetails.postalCode || "-"}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 flex items-center space-x-2 border-b border-indigo-300 pb-1">
                <FiInstagram />
                <span>Social</span>
              </h4>
              <p className="mb-1 flex items-center space-x-1">
                <FiInstagram />
                <span>{moreDetails.instagram || "Not provided"}</span>
              </p>
              <p className="mb-1 flex items-center space-x-1">
                <FiFacebook />
                <span>{moreDetails.facebook || "Not provided"}</span>
              </p>
              <p className="mb-1 flex items-center space-x-1">
                <FiLinkedin />
                <span>{moreDetails.linkedin || "Not provided"}</span>
              </p>
              <p className="mb-1 flex items-center space-x-1">
                <FiGithub />
                <span>{moreDetails.github || "Not provided"}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Section */}
      {editMode && (
        <div
          className="bg-white border border-indigo-400 rounded-2xl shadow-lg p-6 relative animate-slideDown"
          style={{ animationDuration: "0.4s", animationTimingFunction: "ease" }}
        >
          <button
            onClick={() => setEditMode(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-indigo-300 transition"
            aria-label="Close edit profile"
          >
            <FiX size={24} className="text-indigo-700" />
          </button>

          <h3 className="text-2xl font-bold mb-6 text-indigo-900 flex items-center space-x-2">
            <FiUser size={28} />
            <span>Edit Profile</span>
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-indigo-900"
          >
            {/* Username - disabled */}
            <div>
              <label htmlFor="username" className="block font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ""}
                disabled
                className="w-full px-3 py-2 border border-indigo-300 rounded-md bg-gray-200 cursor-not-allowed"
              />
            </div>

            {/* Fullname */}
            <div>
              <label htmlFor="fullname" className="block font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block font-semibold mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block font-semibold mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={
                  formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""
                }
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block font-semibold mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* College */}
            <div>
              <label htmlFor="college" className="block font-semibold mb-1">
                College
              </label>
              <input
                type="text"
                id="college"
                name="college"
                value={formData.college || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Course */}
            <div>
              <label htmlFor="course" className="block font-semibold mb-1">
                Course
              </label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Branch */}
            <div>
              <label htmlFor="branch" className="block font-semibold mb-1">
                Branch
              </label>
              <input
                type="text"
                id="branch"
                name="branch"
                value={formData.branch || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Division */}
            <div>
              <label htmlFor="division" className="block font-semibold mb-1">
                Division
              </label>
              <input
                type="text"
                id="division"
                name="division"
                value={formData.division || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Specialization */}
            <div>
              <label
                htmlFor="specialization"
                className="block font-semibold mb-1"
              >
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Year Of Study */}
            <div>
              <label htmlFor="yearOfStudy" className="block font-semibold mb-1">
                Year Of Study
              </label>
              <input
                type="number"
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy || ""}
                onChange={handleInputChange}
                min={1}
                max={10}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Student ID */}
            <div>
              <label htmlFor="studentID" className="block font-semibold mb-1">
                Student ID
              </label>
              <input
                type="text"
                id="studentID"
                name="studentID"
                value={formData.studentID || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="block font-semibold mb-1">
                Mobile
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block font-semibold mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block font-semibold mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block font-semibold mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block font-semibold mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block font-semibold mb-1">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Social Media */}
            <div>
              <label htmlFor="instagram" className="block font-semibold mb-1">
                Instagram
              </label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={formData.instagram || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="facebook" className="block font-semibold mb-1">
                Facebook
              </label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                value={formData.facebook || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block font-semibold mb-1">
                LinkedIn
              </label>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="github" className="block font-semibold mb-1">
                GitHub
              </label>
              <input
                type="text"
                id="github"
                name="github"
                value={formData.github || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex items-center space-x-4 mt-4">
              <button
                type="submit"
                disabled={submitLoading}
                className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                {submitLoading ? "Saving..." : "Save Changes"}
              </button>
              {submitError && (
                <p className="text-red-600 font-semibold">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-green-600 font-semibold">{submitSuccess}</p>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div>
        <nav className="flex space-x-8 border-b rounded-2xl border-gray-200 bg-white  p-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-4 font-semibold ${
                activeTab === tab.key
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <section className="py-4 bg-blue-100 rounded-2xl">
          {tabData.length === 0 ? (
            <p className="text-center text-gray-400 italic">
              No {activeTab} to display.
            </p>
          ) : (
            <>
              {(() => {
                switch (activeTab) {
                  case "posts":
                    return (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {posts.map((item) => (
                          <ProfilePostCard key={item._id} {...item} />
                        ))}
                      </ul>
                    );
                  case "events":
                    return (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {events.map((event) => (
                          <ProfileEventCard
                            key={event._id}
                            name={event.name}
                            description={event.description}
                            category={event.category}
                            tags={event.tags}
                            hostName={event.hostName}
                            createdBy={event.createdBy}
                            location={event.location}
                            date={event.date}
                            image={event.image}
                            attendees={event.attendees}
                            upvotes={event.upvotes}
                            goingCount={event.goingCount} // corrected prop
                            comments={event.comments}
                            createdAt={event.createdAt}
                            userId={userId}
                          />
                        ))}
                      </ul>
                    );
                  case "projects":
                    return (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                        {projects.map((project) => (
                          <ProfileProjectCard
                            key={project._id}
                            userId={userId}
                            project={project}
                          />
                        ))}
                      </ul>
                    );
                  default:
                    return null;
                }
              })()}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
