import { useState, useEffect, useMemo } from "react";
import {
  Search,
  MoreVertical,
  Shield,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  UserCircle
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "USER";
  riskLevel: string;
  isVerified: boolean;
  goldBalance: number;
  rupeeBalance: number;
  kycStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] =
    useState<"ALL" | "ADMIN" | "USER">("ALL");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState(false);

  /* ---------------- FETCH USERS (non-blocking) ---------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setAuthError(false);

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/users`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });

        if (response.status === 401) {
          setAuthError(true);
          return;
        }

        const data = await response.json();
        if (data.success) {
          setUsers(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  /* ---------------- MEMOIZED FILTER (performance) ---------------- */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        filterRole === "ALL" || user.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  /* ---------------- AUTH ERROR ---------------- */
  if (authError) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-900">
            Authentication Required
          </h3>
          <p className="mt-2 text-sm text-red-800">
            Session expired. Please login again.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-4 pb-96 md:p-6 md:pb-96">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Manage system users and verify accounts
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 shadow-sm md:flex-row md:items-center dark:bg-neutral-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-gray-800 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#3D3066] focus:ring-1 focus:ring-[#3D3066] dark:border-neutral-700 dark:bg-neutral-700 dark:text-gray-700"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) =>
              setFilterRole(e.target.value as "ALL" | "ADMIN" | "USER")
            }
            className="rounded-lg text-gray-700 border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#3D3066] dark:border-neutral-700 dark:bg-neutral-700 dark:text-gray-700"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </div>

        {/* Table (ALWAYS VISIBLE) */}
        <div className="rounded-xl bg-gray-50 shadow-sm dark:bg-neutral-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-700/50 text-gray-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Gold (g)</th>
                  <th className="px-6 py-4">₹ Balance</th>
                  <th className="px-6 py-4">KYC</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-neutral-700 text-gray-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-500 dark:text-neutral-400"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                    >
                      <td className="px-6 py-4 font-medium">
                        {user.name}
                      </td>
                      <td className="px-6 py-4">
                        {user.phone || "—"}
                      </td>
                      <td className="px-6 py-4 text-amber-600">
                        {user.goldBalance.toFixed(3)}
                      </td>
                      <td className="px-6 py-4 text-green-600">
                        ₹{Number(user.rupeeBalance).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {user.kycStatus}
                      </td>
                      <td className="px-6 py-4">
                        {user.role}
                      </td>
                      <td className="px-6 py-4">
                        {user.isVerified ? "Verified" : "Pending"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            setSelectedUser(user)
                          }
                          className="text-[#3D3066] hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-gray-50 p-6 dark:bg-neutral-800">
            <h2 className="text-xl font-bold mb-4">
              {selectedUser.name}
            </h2>
            <p>Email: {selectedUser.email}</p>
            <p>Gold: {selectedUser.goldBalance}g</p>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full rounded-lg bg-[#3D3066] py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
