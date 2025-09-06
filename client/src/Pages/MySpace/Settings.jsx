import React, { useState } from "react";
import {
  LockSimple,
  Question,
  UserCircle,
  FileText,
  Trash,
  Gear,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  CaretRight,
  SignOut,
  Database,
  Key
} from "phosphor-react";

const Settings = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState("account");

  const settingsCategories = [
    { id: "account", name: "Account", icon: <UserCircle size={20} /> },
    { id: "privacy", name: "Privacy", icon: <Shield size={20} /> },
    { id: "notifications", name: "Notifications", icon: <Bell size={20} /> },
    { id: "display", name: "Display", icon: <Palette size={20} /> },
    { id: "storage", name: "Storage", icon: <Database size={20} /> },
    { id: "security", name: "Security", icon: <Key size={20} /> },
  ];

  return (
    <div className={`h-auto mt-8 rounded-2xl  font-inter flex max-w-6xl mx-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-5`}>
        <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Gear size={24} className="text-blue-500" /> Settings
        </h1>
        
        <div className="space-y-1 rounded-2xl">
          {settingsCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                activeCategory === category.id
                  ? 'bg-blue-100 text-blue-600'
                  : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
              }`}
            >
              {category.icon}
              <span className="font-medium">{category.name}</span>
            </div>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <div className={`mt-8 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span className="font-medium">Dark Mode</span>
            </div>
            <div
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                darkMode ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                  darkMode ? "translate-x-6" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button className={`w-full mt-6 flex items-center justify-center gap-2 p-3 rounded-lg ${
          darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
        } text-white transition-colors`}>
          <SignOut size={18} /> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 capitalize">{activeCategory} Settings</h2>

          {/* Account Privacy */}
          {activeCategory === 'privacy' && (
            <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md p-5 flex items-center justify-between transition mb-4`}>
              <div className="flex items-center gap-3">
                <LockSimple size={24} className="text-purple-500" />
                <div>
                  <span className="font-semibold text-lg">Private Account</span>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Only approved followers can see your content
                  </p>
                </div>
              </div>
              <div
                onClick={() => setIsPrivate(!isPrivate)}
                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                  isPrivate ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${
                    isPrivate ? "translate-x-7" : ""
                  }`}
                />
              </div>
            </div>
          )}

          {/* Account Status */}
          {activeCategory === 'account' && (
            <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md p-5 flex items-center justify-between transition mb-4`}>
              <div className="flex items-center gap-3">
                <UserCircle size={24} className="text-green-500" />
                <div>
                  <span className="font-semibold text-lg">Online Status</span>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Show others when you're online
                  </p>
                </div>
              </div>
              <div
                onClick={() => setIsOnline(!isOnline)}
                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                  isOnline ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${
                    isOnline ? "translate-x-7" : ""
                  }`}
                />
              </div>
            </div>
          )}

          {/* Help */}
          {activeCategory === 'account' && (
            <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md p-5 flex items-center justify-between transition mb-4 cursor-pointer`}>
              <div className="flex items-center gap-3">
                <Question size={24} className="text-blue-500" />
                <span className="font-semibold text-lg">Help & User Manual</span>
              </div>
              <CaretRight size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </div>
          )}

          {/* Terms & Conditions */}
          {activeCategory === 'account' && (
            <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md p-5 transition mb-4`}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowTerms(!showTerms)}
              >
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-yellow-500" />
                  <span className="font-semibold text-lg">Terms & Conditions</span>
                </div>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{showTerms ? "▲" : "▼"}</span>
              </div>
              {showTerms && (
                <p className={`mt-3 text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  facilisi. Sed feugiat sapien a urna feugiat, in malesuada ante
                  tincidunt. Vivamus euismod, nisl quis aliquet vehicula, nunc
                  nisl aliquam nunc, quis aliquam nisl nisl quis nunc.
                </p>
              )}
            </div>
          )}

          {/* Delete Account */}
          {activeCategory === 'account' && (
            <div
              className={`rounded-xl shadow-md p-5 flex items-center justify-between transition cursor-pointer ${
                darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'
              }`}
              onClick={() => setShowDeleteModal(true)}
            >
              <div className="flex items-center gap-3">
                <Trash size={24} className="text-white" />
                <span className="font-semibold text-lg text-white">Delete Account</span>
              </div>
              <CaretRight size={18} className="text-white" />
            </div>
          )}

          {/* Display Settings */}
          {activeCategory === 'display' && (
            <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-5 transition mb-4`}>
              <h3 className="font-semibold text-lg mb-4">Theme Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 ${darkMode ? 'border-blue-500 bg-blue-500/10' : 'border-blue-400 bg-blue-50'} cursor-pointer`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sun size={18} /> Light Theme
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Clean and bright interface</p>
                </div>
                <div className={`p-4 rounded-lg border-2 ${darkMode ? 'border-blue-500 bg-blue-500/10' : 'border-gray-300'} cursor-pointer`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Moon size={18} /> Dark Theme
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Easier on the eyes in low light</p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeCategory === 'notifications' && (
            <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-5 transition mb-4`}>
              <h3 className="font-semibold text-lg mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { title: "Message Notifications", desc: "Get notified when you receive new messages" },
                  { title: "Group Notifications", desc: "Get updates from groups you're in" },
                  { title: "Sound", desc: "Play sound for notifications" },
                  { title: "Vibration", desc: "Vibrate for notifications" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</div>
                    </div>
                    <div
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                        index % 2 === 0 ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                          index % 2 === 0 ? "translate-x-6" : ""
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className={`rounded-xl p-6 w-96 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-3">Confirm Account Deletion</h2>
            <p className={`mb-5 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Are you sure you want to delete your account? This action cannot
              be undone. All your data will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`px-4 py-2 rounded-lg transition ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  alert("Account Deletion Process Started");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;