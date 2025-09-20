const EditForm = () => {

     // For edit form submit state
      const [submitLoading, setSubmitLoading] = useState(false);
      const [submitError, setSubmitError] = useState(null);
      const [submitSuccess, setSubmitSuccess] = useState(null);

      
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const config = {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      // Remove username to avoid editing it even if present
      const { username, ...editableData } = formData;

      // PUT request to update user profile
      await axios.put(
        "http://localhost:3000/api/user/update",
        editableData,
        config
      );

      setSubmitSuccess("Profile updated successfully!");
      setEditMode(false);
      setMoreDetails(null);

      // Refresh user data from server
      const res = await axios.get("http://localhost:3000/api/user/me", config);
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

  return (
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
          <label htmlFor="specialization" className="block font-semibold mb-1">
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
  );
};
export default EditForm;
