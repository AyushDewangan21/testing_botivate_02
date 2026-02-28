"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  MapPin,
  Home,
  Briefcase,
  Star,
  Navigation,
  Check,
  Phone,
  Clock,
  Tag,
} from "lucide-react";

interface SavedAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
  landmark?: string;
  phone: string;
  lat?: number;
  lng?: number;
}

interface SavedAddressesPageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
}

export function SavedAddressesPage({ user, onClose, isOpen }: SavedAddressesPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);

  // Sample saved addresses data - including partner locations
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: "1",
      name: "Home",
      address: "123 Main Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      type: "home",
      isDefault: true,
      landmark: "Near Metro Station",
      phone: user?.phone || "+91 98765 43210",
    },
    {
      id: "2",
      name: "Office",
      address: "456 Business Avenue",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122002",
      type: "work",
      isDefault: false,
      landmark: "DLF Cyber City",
      phone: "+91 98765 43211",
    },
    // Partner locations
    {
      id: "3",
      name: "Shree Ganesh Jewellers",
      address: "Connaught Place",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      type: "other",
      isDefault: false,
      landmark: "Near Central Park",
      phone: "+91 98765 43210",
    },
    {
      id: "4",
      name: "AT Plus Jewellers",
      address: "Lajpat Nagar",
      city: "Delhi",
      state: "Delhi",
      pincode: "110024",
      type: "other",
      isDefault: false,
      landmark: "Main Market",
      phone: "+91 98765 43211",
    },
    {
      id: "5",
      name: "Kalyan Jewellers",
      address: "Saket",
      city: "Delhi",
      state: "Delhi",
      pincode: "110017",
      type: "other",
      isDefault: false,
      landmark: "DLF Place",
      phone: "+91 98765 43212",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "home" as "home" | "work" | "other",
    landmark: "",
    phone: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewAddress = () => {
    if (!formData.name || !formData.address || !formData.city || !formData.pincode || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      ...formData,
      isDefault: savedAddresses.length === 0, // First address becomes default
    };

    setSavedAddresses([...savedAddresses, newAddress]);
    resetForm();
    setIsAddingNew(false);
  };

  const handleSetDefault = (addressId: string) => {
    setSavedAddresses(addresses =>
      addresses.map(address => ({
        ...address,
        isDefault: address.id === addressId
      }))
    );
  };

  const handleDeleteAddress = (addressId: string) => {
    if (savedAddresses.find(addr => addr.id === addressId)?.isDefault) {
      alert("Cannot delete default address. Please set another address as default first.");
      return;
    }

    setSavedAddresses(addresses => addresses.filter(addr => addr.id !== addressId));
  };

  const handleEditAddress = (address: SavedAddress) => {
    setSelectedAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      type: address.type,
      landmark: address.landmark || "",
      phone: address.phone,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedAddress) return;

    setSavedAddresses(addresses =>
      addresses.map(address =>
        address.id === selectedAddress.id
          ? { ...address, ...formData }
          : address
      )
    );
    resetEdit();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      type: "home",
      landmark: "",
      phone: "",
    });
  };

  const resetEdit = () => {
    setIsEditing(false);
    setSelectedAddress(null);
    resetForm();
  };

  const handleCancelEdit = () => {
    resetEdit();
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-4 w-4" />;
      case "work":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case "home":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "work":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case "home":
        return "Home";
      case "work":
        return "Work";
      default:
        return "Other";
    }
  };

  const handleGetDirections = (address: SavedAddress) => {
    // In a real app, this would open maps with the address
    const addressString = `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`;
    console.log("Getting directions to:", addressString);
    alert(`Directions to ${address.name} would open in maps app`);
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
                Saved Addresses
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Manage your delivery and pickup locations
              </p>
            </div>
          </div>

          {!isAddingNew && !isEditing && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-2 rounded-lg bg-[#3D3066] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
            >
              <Plus className="h-4 w-4" />
              Add New
            </button>
          )}

          {(isAddingNew || isEditing) && (
            <div className="flex gap-2">
              <button
                onClick={isAddingNew ? () => setIsAddingNew(false) : handleCancelEdit}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={isAddingNew ? handleAddNewAddress : handleSaveEdit}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info Message */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your saved addresses include both personal locations and partner jeweller locations for easy pickup/delivery.
            </p>
          </div>

          {/* Add/Edit Form */}
          {(isAddingNew || isEditing) && (
            <div className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {isEditing ? "Edit Address" : "Add New Address"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Address Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                    placeholder="e.g., Home, Office, Partner Name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Address Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#8B7FA8]"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                    placeholder="House no., Building, Street, Area"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                      placeholder="Pincode"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                    placeholder="Nearby landmark"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Saved Addresses List */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              All Addresses ({savedAddresses.length})
            </h3>

            {savedAddresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-neutral-700">
                <MapPin className="mx-auto h-12 w-12 text-gray-400 dark:text-neutral-500" />
                <p className="mt-2 text-gray-600 dark:text-neutral-400">
                  No addresses saved yet
                </p>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="mt-4 rounded-lg bg-[#3D3066] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              savedAddresses.map((address) => (
                <div
                  key={address.id}
                  className={`rounded-xl border p-4 transition-all ${address.isDefault
                      ? "border-[#3D3066] bg-[#3D3066]/5 dark:border-[#8B7FA8] dark:bg-[#3D3066]/10"
                      : "border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/50"
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <div className={`rounded-full p-1.5 ${getAddressTypeColor(address.type)}`}>
                          {getAddressTypeIcon(address.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {address.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getAddressTypeColor(address.type)}`}>
                              {getAddressTypeLabel(address.type)}
                            </span>
                            {address.isDefault && (
                              <span className="rounded-full bg-[#3D3066] px-2 py-0.5 text-xs text-white dark:bg-[#8B7FA8]">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-gray-400 dark:text-neutral-500" />
                          <div>
                            <p className="text-gray-900 dark:text-white">{address.address}</p>
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            {address.landmark && (
                              <p className="text-xs text-gray-500 dark:text-neutral-500">
                                Landmark: {address.landmark}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400 dark:text-neutral-500" />
                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                            {address.phone}
                          </span>
                        </div>

                        {/* Special indicator for partner jewellers */}
                        {(address.name.includes("Jewellers") || address.type === "other") && (
                          <div className="mt-2 flex items-center gap-2 rounded-lg bg-yellow-50 p-2 dark:bg-yellow-900/20">
                            <Tag className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                              Partner Jeweller Location
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleGetDirections(address)}
                          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
                          title="Get Directions"
                        >
                          <Navigation className="h-4 w-4 text-gray-600 dark:text-neutral-400" />
                        </button>
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
                          title="Edit Address"
                        >
                          <Edit2 className="h-4 w-4 text-gray-600 dark:text-neutral-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="rounded p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete Address"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>

                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="rounded-lg border border-[#3D3066] px-3 py-1 text-xs font-medium text-[#3D3066] transition-colors hover:bg-[#3D3066]/10 dark:border-[#8B7FA8] dark:text-[#8B7FA8] dark:hover:bg-[#8B7FA8]/10"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Usage Tips */}
          <div className="mt-8 rounded-lg border border-gray-200 p-4 dark:border-neutral-800">
            <h4 className="mb-2 flex items-center gap-2 font-medium text-gray-900 dark:text-white">
              <Star className="h-4 w-4" />
              Quick Tips
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-neutral-400">
              <li>• Set a default address for faster checkout</li>
              <li>• Partner jeweller locations are marked with a yellow tag</li>
              <li>• Use "Get Directions" for navigation to any address</li>
              <li>• Add multiple addresses for different pickup/delivery needs</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}