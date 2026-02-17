import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PartnersTabSkeleton } from "@/components/skeletons/PartnersTabSkeleton";
import {
  MapPin,
  Phone,
  Star,
  Search,
  Map,
  List,
  Navigation,
  Clock,
  ShoppingBag,
  Truck,
  Repeat,
  X,
  ShieldCheck,
  Award,
  BadgeCheck,
  Plus,
} from "lucide-react";

interface PartnerTabProps {
  isLoading: boolean;
}

interface Partner {
  id: string;
  name: string;
  ownerName?: string;
  username?: string;
  email?: string;
  area: string;
  city: string;
  phone: string;
  timings: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviews: number;
  services: string[];
  offers: string[];
  distance?: number;
  commission?: string;
  bankAccount?: string;
}

const PartnersMap = dynamic(() => import("./PartnersMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center bg-gray-100 dark:bg-neutral-700">
      <Map className="h-16 w-16 text-gray-300 dark:text-neutral-600 animate-pulse" />
    </div>
  ),
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export function PartnersTab({ isLoading: _isLoading }: PartnerTabProps) {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isInternalLoading, setIsInternalLoading] = useState(true);
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    username: "",
    password: "",
    email: "",
    area: "",
    city: "",
    phone: "",
    timings: "",
    coordinates: "",
    commission: "",
    bankAccount: "",
    services: [] as string[],
    rating: "",
    reviews: "",
    offers: [] as string[],
  });

  // Fetch partners from API
  const fetchPartners = async () => {
    try {
      setIsInternalLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/partners`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      const data = await response.json();

      if (data.success) {
        setPartners(data.partners);
      } else {
        setError(data.message || 'Failed to fetch partners');
      }
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError('Failed to connect to server');
    } finally {
      setIsInternalLoading(false);
    }
  };

  // Add new partner
  const handleAddPartner = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Parse coordinates
      const coords = formData.coordinates.split(',').map(c => c.trim());
      if (coords.length !== 2) {
        setError('Please enter coordinates in format: latitude, longitude');
        setIsSubmitting(false);
        return;
      }

      const partnerData = {
        name: formData.name,
        area: formData.area,
        city: formData.city,
        phone: formData.phone,
        timings: formData.timings,
        latitude: parseFloat(coords[0]),
        longitude: parseFloat(coords[1]),
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviews: formData.reviews ? parseInt(formData.reviews) : 0,
        services: formData.services,
        offers: formData.offers,
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/partners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(partnerData),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh partners list
        await fetchPartners();

        // Reset form and close modal
        setFormData({
          name: "",
          ownerName: "",
          username: "",
          password: "",
          email: "",
          area: "",
          city: "",
          phone: "",
          timings: "",
          coordinates: "",
          commission: "",
          bankAccount: "",
          services: [],
          rating: "",
          reviews: "",
          offers: [],
        });
        setIsAddPartnerOpen(false);
      } else {
        setError(data.message || 'Failed to add partner');
      }
    } catch (err) {
      console.error('Error adding partner:', err);
      setError('Failed to add partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch {
        console.error('Failed to parse user data');
      }
    }
    fetchPartners();
  }, []);


  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.area.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Removed static loading check - components render immediately
  // Only show skeletons for dynamic data sections

  return (
    <div className="min-h-screen pb-6 dark:bg-neutral-900 dark:text-gray-100">
      {/* Header */}
      <div className="rounded-b-3xl 
  bg-gradient-to-br 
  from-[#4B3B80] 
  via-[#3A2C66] 
  to-[#1F173D] 
  px-6 pt-6 pb-8
  shadow-[0_10px_40px_rgba(31,23,61,0.35)]">

        <div className="mb-4 flex items-center justify-between">
          <img src="01.jpg" alt="Zold Logo" className="h-16 rounded-xl" />
          {userRole === 'ADMIN' && (
            <button
              onClick={() => setIsAddPartnerOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-white hover:bg-white/30 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Partner</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-3 dark:bg-neutral-800">
          <Search className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by store, city, or area"
            className="flex-1 text-gray-800 outline-none dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
          />
        </div>

        {/* View Toggle */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 transition-colors ${viewMode === "list"
              ? "bg-white text-[#3D3066] dark:bg-neutral-800 dark:text-white"
              : "bg-white/20 text-white hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20"
              }`}
          >
            <List className="h-5 w-5" />
            List View
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 transition-colors ${viewMode === "map"
              ? "bg-white text-[#3D3066] dark:bg-neutral-800 dark:text-white"
              : "bg-white/20 text-white hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20"
              }`}
          >
            <Map className="h-5 w-5" />
            Map View
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Certifications Section */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg dark:bg-neutral-800 dark:shadow-neutral-900/50">
          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">Certifications & Licenses</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-700/50">
              <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
                <ShieldCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">BIS Hallmarked</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">Bureau of Indian Standards</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-700/50">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">ISO 9001:2015</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">Quality Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-700/50">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <BadgeCheck className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Sequoia Insured</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">100% Vault Insurance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 px-6">
        {viewMode === "list" ? (
          <div className="space-y-4">
            {isInternalLoading ? (
              // Show skeleton loaders while loading
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 animate-pulse">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 h-5 w-48 rounded bg-gray-200 dark:bg-neutral-700" />
                      <div className="mb-2 flex items-center gap-1">
                        <div className="h-4 w-4 rounded bg-gray-200 dark:bg-neutral-700" />
                        <div className="h-3 w-32 rounded bg-gray-200 dark:bg-neutral-700" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-12 rounded bg-gray-100 dark:bg-neutral-700" />
                        <div className="h-3 w-20 rounded bg-gray-100 dark:bg-neutral-700" />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 flex gap-2">
                    <div className="h-6 w-16 rounded bg-gray-100 dark:bg-neutral-700" />
                    <div className="h-6 w-20 rounded bg-gray-100 dark:bg-neutral-700" />
                  </div>
                  <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-700" />
                </div>
              ))
            ) : (
              <>
                {filteredPartners.map((partner) => (
                  <div
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner)}
                    className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#8B7FA8] dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[#8B7FA8]"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 text-black dark:text-white">
                          {partner.name}
                        </h3>
                        <div className="mb-2 flex items-center gap-1 text-sm text-gray-500 dark:text-neutral-500">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {partner.area}, {partner.city} • {partner.distance} km
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 rounded bg-[#F3F1F7] px-2 py-1 dark:bg-neutral-700">
                            <Star className="h-3 w-3 fill-current text-[#8B7FA8] dark:text-[#8B7FA8]" />
                            <span className="text-xs text-[#3D3066] dark:text-white">
                              {partner.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-neutral-500">
                            ({partner.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mb-3 flex flex-wrap gap-2">
                      {partner.services.includes("pickup") && (
                        <span className="flex items-center gap-1 rounded bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <Truck className="h-3 w-3" />
                          Pickup
                        </span>
                      )}
                      {partner.services.includes("jewellery") && (
                        <span className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          <ShoppingBag className="h-3 w-3" />
                          Jewellery
                        </span>
                      )}
                      {partner.services.includes("loan") && (
                        <span className="flex items-center gap-1 rounded bg-purple-50 px-2 py-1 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          <Repeat className="h-3 w-3" />
                          Loan
                        </span>
                      )}
                    </div>

                    {/* Offers */}
                    {partner.offers.length > 0 && (
                      <div className="mb-3 rounded-lg border border-orange-200 bg-orange-50 p-2 dark:border-orange-800 dark:bg-orange-900/20">
                        <p className="text-xs text-orange-800 dark:text-orange-300">
                          {partner.offers[0]}
                        </p>
                      </div>
                    )}

                    <button className="w-full rounded-lg bg-[#3D3066] py-2 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]">
                      View Details
                    </button>
                  </div>
                ))}

                {filteredPartners.length === 0 && (
                  <div className="py-12 text-center text-gray-500 dark:text-neutral-500">
                    <MapPin className="mx-auto mb-2 h-12 w-12 text-gray-300 dark:text-neutral-700" />
                    <p>No partners found</p>
                    <p className="mt-1 text-sm">Try adjusting your search</p>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="overflow-hidden bg-white dark:bg-neutral-800">
            <PartnersMap
              partners={filteredPartners}
              onSelectPartner={setSelectedPartner}
            />

            <div className="p-4 border border-t-0 border-gray-200 dark:border-neutral-700 rounded-b-xl">
              {isInternalLoading ? (
                <div className="mx-auto h-4 w-48 animate-pulse rounded bg-gray-100 dark:bg-neutral-700" />
              ) : (
                <p className="text-center text-sm text-gray-600 dark:text-neutral-400">
                  Showing {filteredPartners.length} partners nearby
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Partner Details Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center dark:bg-black/70">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white sm:rounded-2xl dark:bg-neutral-800">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-neutral-700 dark:bg-neutral-800">
              <h2 className="text-black dark:text-white">{selectedPartner.name}</h2>
              <button
                onClick={() => setSelectedPartner(null)}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                <X className="h-6 w-6 text-black" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
              {/* Location */}
              <div>
                <div className="mb-3 flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      {selectedPartner.area}, {selectedPartner.city}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                      {selectedPartner.distance} km away
                    </p>
                  </div>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F3F1F7] py-2 text-[#3D3066] transition-colors hover:bg-[#E5E1F0] dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600">
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 rounded-lg bg-[#F3F1F7] px-3 py-2 dark:bg-neutral-700">
                  <Star className="h-5 w-5 fill-current text-[#8B7FA8]" />
                  <span className="text-[#3D3066] dark:text-white">
                    {selectedPartner.rating}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-neutral-400">
                  {selectedPartner.reviews} reviews
                </span>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-black mb-3 dark:text-white">Services Available</h3>
                <div className="space-y-2">
                  {selectedPartner.services.includes("pickup") && (
                    <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/30">
                      <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-green-900 dark:text-green-300">
                        Gold Pickup Available
                      </span>
                    </div>
                  )}
                  {selectedPartner.services.includes("jewellery") && (
                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/30">
                      <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-900 dark:text-blue-300">
                        Jewellery Conversion
                      </span>
                    </div>
                  )}
                  {selectedPartner.services.includes("loan") && (
                    <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3 dark:bg-purple-900/30">
                      <Repeat className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-purple-900 dark:text-purple-300">
                        Loan Assistance
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timings & Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
                  <div className="mb-1 flex items-center gap-2 text-gray-600 dark:text-neutral-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Timings</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPartner.timings}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
                  <div className="mb-1 flex items-center gap-2 text-gray-600 dark:text-neutral-400">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Contact</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPartner.phone}
                  </p>
                </div>
              </div>

              {/* Offers */}
              {selectedPartner.offers.length > 0 && (
                <div>
                  <h3 className="text-black mb-3 dark:text-white">Current Offers</h3>
                  <div className="space-y-2">
                    {selectedPartner.offers.map((offer: string, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20"
                      >
                        <p className="text-sm text-orange-900 dark:text-orange-300">
                          {offer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full rounded-lg bg-[#3D3066] py-3 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]">
                  Convert Gold to Jewellery Here
                </button>
                <button className="w-full rounded-lg border border-gray-300 bg-white py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600">
                  Deposit Physical Gold
                </button>
                <button className="w-full rounded-lg border border-gray-300 bg-white py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600">
                  Book Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal - Enhanced */}
      {isAddPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center dark:bg-black/70 overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-2xl dark:bg-neutral-800 max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between sticky top-0 bg-white dark:bg-neutral-800 pb-4 border-b dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create Partner Account
              </h2>
              <button
                onClick={() => setIsAddPartnerOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Business Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Business Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Golden Jewellers"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Area
                      </label>
                      <input
                        type="text"
                        placeholder="MG Road"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="Raipur"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Timings
                      </label>
                      <input
                        type="text"
                        placeholder="10:00 AM - 9:00 PM"
                        value={formData.timings}
                        onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Coordinates (Lat, Lng)
                      </label>
                      <input
                        type="text"
                        placeholder="21.2514, 81.6296"
                        value={formData.coordinates}
                        onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner/Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Owner Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Rajesh Kumar"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="owner@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Credentials */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Login Credentials</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Username *
                      </label>
                      <input
                        type="text"
                        placeholder="rajesh_golden"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password *
                      </label>
                      <input
                        type="password"
                        placeholder="Min 8 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Business Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Commission % (Optional)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="2.5"
                        value={formData.commission}
                        onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bank Account (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="HDFC1234567890"
                        value={formData.bankAccount}
                        onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Services Offered
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['jewellery', 'pickup', 'loan'].map(service => (
                        <label key={service} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, services: [...formData.services, service] });
                              } else {
                                setFormData({ ...formData, services: formData.services.filter(s => s !== service) });
                              }
                            }}
                            className="rounded border-gray-300 text-[#3D3066]"
                          />
                          <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsAddPartnerOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPartner}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-[#3D3066] py-2.5 text-white hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Partner Account'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
