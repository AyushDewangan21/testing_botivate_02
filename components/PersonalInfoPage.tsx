"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Edit2, Save, X } from "lucide-react";

interface PersonalInfoPageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
}

export function PersonalInfoPage({ user, onClose, isOpen }: PersonalInfoPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
  });

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log("Saving data:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dob: user?.dob || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode || "",
    });
    setIsEditing(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Side Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50 w-full max-w-md transform overflow-y-auto bg-gray-50 shadow-2xl
          transition-all duration-300 ease-in-out dark:bg-neutral-900
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-black dark:text-white" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Manage your personal details
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-[#3D3066] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="bg-red-500 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4  text-white" />
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Picture Section */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#3D3066] to-[#8B7FA8] p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800">
                  <User className="h-12 w-12 text-[#3D3066] dark:text-[#8B7FA8]" />
                </div>
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 rounded-full bg-[#3D3066] p-2 text-white shadow-lg hover:bg-[#4D3F7F]">
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              {isEditing ? "Click edit icon to change photo" : "Profile picture"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                <User className="h-4 w-4" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900 dark:bg-neutral-800 dark:text-white">
                  {formData.name || "Not provided"}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900 dark:bg-neutral-800 dark:text-white">
                  {formData.email || "Not provided"}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900 dark:bg-neutral-800 dark:text-white">
                  {formData.phone || "Not provided"}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                />
              ) : (
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900 dark:bg-neutral-800 dark:text-white">
                  {formData.dob || "Not provided"}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                <MapPin className="h-4 w-4" />
                Address
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                    placeholder="Street address"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                      placeholder="State"
                    />
                  </div>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                    placeholder="Pincode"
                  />
                </div>
              ) : (
                <div className="space-y-2 rounded-lg bg-gray-50 px-4 py-3 text-gray-900 dark:bg-neutral-800 dark:text-white">
                  <p>{formData.address || "Not provided"}</p>
                  {(formData.city || formData.state || formData.pincode) && (
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      {[formData.city, formData.state, formData.pincode].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info Message */}
          {isEditing && (
            <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                All changes will be saved automatically. Make sure your information is accurate and up-to-date.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}