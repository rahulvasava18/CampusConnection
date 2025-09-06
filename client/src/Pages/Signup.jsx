import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate(); // ✅ Call hook at top

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");
    setPasswordError("");
    setGeneralError("");

    if (!username) {
      setNameError("Username is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", {
        username,
        password,
      });

      if (response.data) {
        alert("Account created successfully!");
        navigate("/login"); // ✅ Correct redirect
      }
    } catch (err) {
      if (err.response && err.response.data?.message) {
        const message = err.response.data.message.toLowerCase();

        if (message.includes("username")) {
          setNameError("Username already taken");
        } else if (message.includes("password")) {
          setPasswordError(err.response.data.message);
        } else {
          setGeneralError("Signup failed. Please try again.");
        }
      } else {
        setGeneralError("An unexpected error occurred");
      }
    }
    setIsLoading(false);
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Create an Account</h1>
          <p className="text-gray-600">Join our community</p>
        </div>

        {generalError && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="text-red-600 font-medium">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setNameError("");
              }}
              placeholder="Enter your username"
              className={`w-full px-4 py-3 border ${nameError ? 'border-red-300' : 'border-gray-300'} rounded-lg`}
            />
            {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 border ${passwordError ? 'border-red-300' : 'border-gray-300'} rounded-lg`}
            />
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t text-center">
          <p className="text-gray-600 mb-4">Already have an account?</p>
          <button
            onClick={goToLoginPage}
            className="w-full py-2.5 border border-gray-300 rounded-lg text-indigo-600 font-medium"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
