import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Both username and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200 && response.data?.token) {
        // ✅ Store data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userid);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("fullname", response.data.fullname);

        navigate("/home"); // Redirect
      } else {
        setError(response.data?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      // 🔴 Handle different types of errors
      if (err.response) {
        // Server responded with a status code outside 2xx
        switch (err.response.status) {
          case 400:
            setError("Invalid request. Please check your input.");
            break;
          case 401:
            setError("Incorrect password.");
            break;
          case 403:
            setError("Access denied. Your account may be locked.");
            break;
          case 404:
            setError("User not found. Please sign up first.");
            break;
          case 409:
            setError("Conflict. This account might already exist.");
            break;
          case 429:
            setError("Too many login attempts. Please try again later.");
            break;
          case 500:
            setError("Internal server error. Please try again later.");
            break;
          case 503:
            setError("Service unavailable. Please try again later.");
            break;
          default:
            setError(
              err.response.data?.message || "An unexpected error occurred."
            );
        }
      } else if (err.request) {
        // Request was made but no response
        setError("No response from server. Please check your connection.");
      } else {
        // Something else happened
        setError("Request failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignupPage = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transition-all duration-300 ">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 border ${
                error && !username.trim() ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
            />
            {error && !username.trim() && (
              <p className="mt-1 text-sm text-red-600">Username is required</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border ${
                error && !password.trim() ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
            />
            {error && !password.trim() && (
              <p className="mt-1 text-sm text-red-600">Password is required</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all ${
              isLoading ? "opacity-80 cursor-not-allowed" : "hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">Don't have an account?</p>
          <button
            onClick={goToSignupPage}
            className="w-full py-2.5 border border-gray-300 rounded-lg text-indigo-600 hover:text-indigo-800 font-medium transition hover:bg-gray-50 flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
