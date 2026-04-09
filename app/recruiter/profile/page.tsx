"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CompanyProfile() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <div className="flex justify-between items-center px-20 py-6 border-b border-neutral-900">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={26} height={26} />
          <span className="font-semibold">Mr. Hyre</span>
        </div>

        {/* Profile Icon */}
        <div
          onClick={() => router.push("/recruiter/profile")}
          className="w-10 h-10 bg-neutral-800 rounded-full cursor-pointer hover:bg-neutral-700 transition"
        ></div>
      </div>

      {/* Center Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">

          {/* Title */}
          <div className="mt-12 mb-8 text-center">
            <h1 className="text-4xl font-bold">Company Profile</h1>
            <p className="text-neutral-400 mt-2">
              Complete your company profile to start hiring with AI.
            </p>
          </div>

          {/* Company Logo */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg mb-4">Company Logo</h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-neutral-800 rounded-xl"></div>
              <button className="bg-white text-black px-4 py-2 rounded-lg">
                Upload Logo
              </button>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg mb-6">Company Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <input
                placeholder="Company Name"
                className="px-4 py-3 bg-black border border-neutral-800 rounded-lg"
              />
              <input
                placeholder="Company Website"
                className="px-4 py-3 bg-black border border-neutral-800 rounded-lg"
              />
              <input
                placeholder="Industry"
                className="px-4 py-3 bg-black border border-neutral-800 rounded-lg"
              />
              <input
                placeholder="Company Size"
                className="px-4 py-3 bg-black border border-neutral-800 rounded-lg"
              />
              <input
                placeholder="Location"
                className="px-4 py-3 bg-black border border-neutral-800 rounded-lg col-span-2"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg mb-4">Company Description</h2>
            <textarea
              placeholder="Tell candidates about your company..."
              className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg h-32"
            />
          </div>

          {/* Social Links */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg mb-4">Social Links</h2>
            <div className="space-y-4">
              <input
                placeholder="LinkedIn Company Page"
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg"
              />
              <input
                placeholder="Contact Email"
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg"
              />
              <input
                placeholder="Contact Phone"
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mb-20">
            <button
              onClick={() => router.push("/recruiter/dashboard")}
              className="bg-white text-black px-10 py-3 rounded-full"
            >
              Save Company Profile
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}