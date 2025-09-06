import React, { useState } from "react";
import {
  FaTag,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaUserAlt,
  FaClock,
  FaComments,
  FaTrashAlt,
} from "react-icons/fa";

const categories = [
  "Academic",
  "Cultural",
  "Sports",
  "Workshop",
  "Hackathon",
  "Social",
  "Other",
];

const locationTypes = ["On-campus", "Online"];

const initialState = {
  name: "",
  description: "",
  category: "",
  tags: [],
  createdBy: "",
  organizer: {
    name: "",
    contact: "",
    college: "",
    userId: "",
  },
  location: {
    type: "",
    venue: "",
    googleMapLink: "",
    meetingLink: "",
  },
  date: {
    start: "",
    end: "",
  },
  timeline: [{ time: "", activity: "", speaker: "" }],
};

const EventForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Event name is required";
    if (!formData.description.trim()) errs.description = "Description is required";
    if (!formData.category) errs.category = "Category is required";
    if (!formData.location.type) errs["location.type"] = "Location type is required";
    if (!formData.date.start) errs["date.start"] = "Start date is required";
    if (!formData.date.end) errs["date.end"] = "End date is required";
    if (new Date(formData.date.end) < new Date(formData.date.start))
      errs["date.end"] = "End date cannot be before start date";
    if (!formData.organizer.name.trim()) errs["organizer.name"] = "Organizer name is required";
    if (!formData.organizer.contact.trim()) errs["organizer.contact"] = "Organizer contact is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleTimelineRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Submitting event:", formData);
      alert("Event submitted! Check console.");
    }
  };

  const inputBaseStyle =
    "w-full rounded-md px-3 py-2 bg-indigo-50 border-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-indigo-900 accent-indigo-600";

  const inputErrorStyle = "border-red-500 bg-red-100 focus:ring-red-500";

  // Custom wrapper for inputs with icon
  const InputWithIcon = ({ icon, children }) => (
    <div className="relative flex items-center gap-2 border-2 rounded-md bg-indigo-50 px-3 py-2 text-indigo-900 focus-within:ring-2 focus-within:ring-indigo-600">
      <div className="text-indigo-600 absolute left-3 pointer-events-none">{icon}</div>
      <div className="flex-grow pl-7">{children}</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-8 p-6 bg-indigo-50 rounded-xl shadow-lg mt-8 font-sans text-indigo-900">
       
      <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-900">Create New Event</h1>
      <form onSubmit={handleSubmit} noValidate>
        {/* Event Name */}
        <label className="block mb-6">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <FaUserAlt className="text-indigo-600" />
            Event Name <span className="text-indigo-700">*</span>
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter event name"
            className={`${inputBaseStyle} ${errors.name ? inputErrorStyle : "border-indigo-300"}`}
          />
          {errors.name && <p className="text-red-600 mt-1 text-sm">{errors.name}</p>}
        </label>

        {/* Description */}
        <label className="block mb-6">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <FaComments className="text-indigo-600" />
            Description <span className="text-indigo-700">*</span>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event"
            className={`${inputBaseStyle} resize-y h-24 ${errors.description ? inputErrorStyle : "border-indigo-300"}`}
          />
          {errors.description && <p className="text-red-600 mt-1 text-sm">{errors.description}</p>}
        </label>

        {/* Category */}
        <label className="block mb-6">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <FaTag className="text-indigo-600" />
            Category <span className="text-indigo-700">*</span>
          </div>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`${inputBaseStyle} ${errors.category ? inputErrorStyle : "border-indigo-300"}`}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 mt-1 text-sm">{errors.category}</p>}
        </label>

        {/* Tags */}
        <label className="block mb-6">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <FaTag className="text-indigo-600" />
            Tags
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag and press Add"
              className={`${inputBaseStyle} border-indigo-300 flex-grow`}
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="bg-indigo-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="bg-indigo-300 text-indigo-900 rounded-full px-3 py-1 flex items-center gap-2 text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="text-indigo-900 hover:text-indigo-700 font-bold"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </label>

        {/* Organizer Info */}
        <fieldset className="border-2 border-indigo-400 rounded-lg p-4 mb-6 bg-indigo-50">
          <legend className="text-indigo-700 font-semibold px-2">Organizer Info</legend>

          <label className="block mb-4">
            Name <span className="text-indigo-700">*</span>
            <input
              type="text"
              name="organizer.name"
              value={formData.organizer.name}
              onChange={handleChange}
              className={`${inputBaseStyle} ${errors["organizer.name"] ? inputErrorStyle : "border-indigo-300"}`}
            />
            {errors["organizer.name"] && (
              <p className="text-red-600 mt-1 text-sm">{errors["organizer.name"]}</p>
            )}
          </label>

          <label className="block mb-4">
            Contact <span className="text-indigo-700">*</span>
            <input
              type="text"
              name="organizer.contact"
              value={formData.organizer.contact}
              onChange={handleChange}
              className={`${inputBaseStyle} ${errors["organizer.contact"] ? inputErrorStyle : "border-indigo-300"}`}
            />
            {errors["organizer.contact"] && (
              <p className="text-red-600 mt-1 text-sm">{errors["organizer.contact"]}</p>
            )}
          </label>

          <label className="block mb-0">
            College
            <input
              type="text"
              name="organizer.college"
              value={formData.organizer.college}
              onChange={handleChange}
              className={`${inputBaseStyle} border-indigo-300`}
            />
          </label>
        </fieldset>

        {/* Location */}
        <fieldset className="border-2 border-indigo-400 rounded-lg p-4 mb-6 bg-indigo-50">
          <legend className="text-indigo-700 font-semibold px-2 flex items-center gap-2">
            <FaMapMarkerAlt /> Location
          </legend>

          <label className="block mb-4">
            Type <span className="text-indigo-700">*</span>
            <select
              name="location.type"
              value={formData.location.type}
              onChange={handleChange}
              className={`${inputBaseStyle} ${errors["location.type"] ? inputErrorStyle : "border-indigo-300"}`}
            >
              <option value="">-- Select Location Type --</option>
              {locationTypes.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {errors["location.type"] && (
              <p className="text-red-600 mt-1 text-sm">{errors["location.type"]}</p>
            )}
          </label>

          {formData.location.type === "On-campus" && (
            <>
              <label className="block mb-4">
                Venue
                <input
                  type="text"
                  name="location.venue"
                  value={formData.location.venue}
                  onChange={handleChange}
                  className={`${inputBaseStyle} border-indigo-300`}
                  placeholder="E.g., Room 101, Main Hall"
                />
              </label>

              <label className="block mb-4">
                Google Map Link
                <input
                  type="url"
                  name="location.googleMapLink"
                  value={formData.location.googleMapLink}
                  onChange={handleChange}
                  className={`${inputBaseStyle} border-indigo-300`}
                  placeholder="https://maps.google.com/..."
                />
              </label>
            </>
          )}

          {formData.location.type === "Online" && (
            <label className="block mb-4">
              Meeting Link
              <input
                type="url"
                name="location.meetingLink"
                value={formData.location.meetingLink}
                onChange={handleChange}
                className={`${inputBaseStyle} border-indigo-300`}
                placeholder="https://meet.example.com/..."
              />
            </label>
          )}
        </fieldset>

        {/* Dates */}
        <fieldset className="border-2 border-indigo-400 rounded-lg p-4 mb-6 bg-indigo-50">
          <legend className="text-indigo-700 font-semibold px-2 flex items-center gap-2">
            <FaCalendarAlt /> Event Dates
          </legend>

          <label className="block mb-4">
            Start Date <span className="text-indigo-700">*</span>
            <InputWithIcon icon={<FaCalendarAlt />}>
              <input
                type="date"
                name="date.start"
                value={formData.date.start}
                onChange={handleChange}
                className={`w-full bg-indigo-50 focus:outline-none text-indigo-900 ${errors["date.start"] ? inputErrorStyle : "border-none"}`}
              />
            </InputWithIcon>
            {errors["date.start"] && (
              <p className="text-red-600 mt-1 text-sm">{errors["date.start"]}</p>
            )}
          </label>

          <label className="block mb-4">
            End Date <span className="text-indigo-700">*</span>
            <InputWithIcon icon={<FaCalendarAlt />}>
              <input
                type="date"
                name="date.end"
                value={formData.date.end}
                onChange={handleChange}
                className={`w-full bg-indigo-50 focus:outline-none text-indigo-900 ${errors["date.end"] ? inputErrorStyle : "border-none"}`}
              />
            </InputWithIcon>
            {errors["date.end"] && <p className="text-red-600 mt-1 text-sm">{errors["date.end"]}</p>}
          </label>
        </fieldset>

        {/* Timeline */}
        <fieldset className="border-2 border-indigo-400 rounded-lg p-4 mb-6 bg-indigo-50">
          <legend className="text-indigo-700 font-semibold px-2 flex items-center gap-2">
            <FaClock /> Timeline
          </legend>

          {formData.timeline.map((item, index) => (
            <div
              key={index}
              className="mb-4 border-b border-indigo-300 pb-4 flex flex-col md:flex-row md:items-center md:gap-4"
            >
              <label className="flex items-center gap-2 flex-grow mb-2 md:mb-0">
                <FaClock className="text-indigo-600" />
                <input
                  type="time"
                  name={`timeline.${index}.time`}
                  value={item.time}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => {
                      const newTimeline = [...prev.timeline];
                      newTimeline[index] = { ...newTimeline[index], time: value };
                      return { ...prev, timeline: newTimeline };
                    });
                  }}
                  className={`${inputBaseStyle} border-indigo-300`}
                />
              </label>

              <label className="flex items-center gap-2 flex-grow mb-2 md:mb-0">
                Activity
                <input
                  type="text"
                  name={`timeline.${index}.activity`}
                  value={item.activity}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => {
                      const newTimeline = [...prev.timeline];
                      newTimeline[index] = { ...newTimeline[index], activity: value };
                      return { ...prev, timeline: newTimeline };
                    });
                  }}
                  className={`${inputBaseStyle} border-indigo-300`}
                />
              </label>

              <label className="flex items-center gap-2 flex-grow mb-2 md:mb-0">
                Speaker
                <input
                  type="text"
                  name={`timeline.${index}.speaker`}
                  value={item.speaker}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => {
                      const newTimeline = [...prev.timeline];
                      newTimeline[index] = { ...newTimeline[index], speaker: value };
                      return { ...prev, timeline: newTimeline };
                    });
                  }}
                  className={`${inputBaseStyle} border-indigo-300`}
                />
              </label>

              <button
                type="button"
                onClick={() => handleTimelineRemove(index)}
                className="self-start md:self-auto mt-2 md:mt-0 text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold"
                title="Remove timeline item"
              >
                <FaTrashAlt />
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                timeline: [...prev.timeline, { time: "", activity: "", speaker: "" }],
              }))
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Add Timeline Item
          </button>
        </fieldset>

        <button
          type="submit"
          className="w-full bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition"
        >
          Submit Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
