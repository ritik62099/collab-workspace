import React, { useState, useEffect } from "react";
import {
  Camera,
  CalendarDays,
  Building2,
  ShieldCheck,
  MapPin,
  Circle,
  User,
  Mail,
  FileText,
  CheckCircle2,
} from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Avatar from "../../components/common/Avatar";
import Loader from "../../components/common/Loader";

const Profile = () => {
  const { user, updateProfile, loading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
    console.log("User data updated:", user);
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) clearError();
    if (successMsg) setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(formData);
      setSuccessMsg("Profile updated successfully!");

      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <Loader fullScreen />;

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="mx-auto space-y-8 max-w-7xl">
        {/* PAGE TITLE */}

        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>

        {/* HEADER */}

        <div className="overflow-hidden bg-white border shadow-sm rounded-3xl border-slate-200">
          {/* ================= Banner ================= */}

          <div className="relative h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.15),transparent_35%)]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,.08),transparent_40%)]" />

            {/* Blur */}

            <div className="absolute rounded-full -top-20 -right-20 h-80 w-80 bg-white/10 blur-3xl" />

            {/* Header Content */}

            <div className="absolute flex items-end gap-6 -bottom-16 left-10">
              {/* Avatar */}

              <div className="relative">
                <div className="h-48 w-48 overflow-hidden rounded-full border-[6px] border-white bg-white shadow-2xl">
                  {user?.avatar ? (
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-5xl font-bold text-white uppercase bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
                      {user?.name
                        ?.trim()
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  )}
                </div>

                <button className="absolute flex items-center justify-center w-10 h-10 bg-white border rounded-full shadow-lg bottom-3 right-3 border-slate-200 hover:bg-slate-100">
                  <Camera size={18} />
                </button>
              </div>

              {/* User Info */}

              <div className="self-start pb-5 mt-6 text-white">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-4xl font-bold">{user.name}</h2>

                  <span className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                    <Circle
                      size={8}
                      fill="currentColor"
                      className="text-green-500"
                    />
                    Online
                  </span>
                </div>

                <p className="mt-2 text-lg text-blue-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* ================= White Section ================= */}

          <div className="py-2 pl-12 pr-8">
            <div className="ml-[180px] grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoCard
                icon={<CalendarDays size={20} />}
                title="Joined"
                value="Jan 2024"
              />

              <InfoCard
                icon={<Building2 size={20} />}
                title="Workspace"
                value="CollabSpace"
              />

              <InfoCard
                icon={<ShieldCheck size={20} />}
                title="Role"
                value={user.role || "Administrator"}
              />

              <InfoCard
                icon={<MapPin size={20} />}
                title="Location"
                value="Surat"
              />
            </div>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}

        <div className="p-8 bg-white border shadow-sm rounded-3xl border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">
            Personal Information
          </h2>

          <p className="mt-2 text-slate-500">
            Update your personal details and account information.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                />

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full py-3 pl-12 pr-4 transition bg-white border outline-none rounded-xl border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-3 pl-12 pr-4 transition bg-white border outline-none rounded-xl border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Bio
              </label>

              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-4 top-5 text-slate-400"
                />

                <textarea
                  rows={4}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="w-full py-3 pl-12 pr-4 transition bg-white border outline-none resize-none rounded-xl border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 px-4 py-3 text-red-700 border border-red-200 rounded-xl bg-red-50">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-3 px-4 py-3 text-green-700 border border-green-200 rounded-xl bg-green-50">
                <CheckCircle2 size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl"
              >
                {loading ? <Loader size="sm" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   Information Card
------------------------------*/

const InfoCard = ({ icon, title, value }) => {
  return (
    <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r last:border-r-0 border-slate-200">
      <div className="flex items-center justify-center text-blue-600 h-14 w-14 rounded-2xl bg-blue-50">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">{title}</p>

        <h4 className="mt-1 text-lg font-semibold text-slate-800">{value}</h4>
      </div>
    </div>
  );
};

export default Profile;
