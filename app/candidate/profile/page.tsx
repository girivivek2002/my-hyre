"use client";
import { useState } from "react";

export default function CandidateProfile() {
  const [skills, setSkills] = useState([
    "React",
    "Node.js",
    "Python",
  ]);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-20 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-2xl font-semibold">Mr. Hyre</h1>
        <button className="bg-blue-600 px-4 py-2 rounded-lg">
          Help
        </button>
      </div>

      {/* Title */}
      <div className="mb-16">
        <span className="text-blue-500 text-sm">ONBOARDING</span>
        <h1 className="text-5xl font-bold mt-2">
          Create your AI-powered profile
        </h1>
      </div>

      {/* Personal Identity */}
      <Section
        title="Personal Identity"
        description="Let's start with the basics."
      >
        <input className="input" placeholder="Full Name" />
        <input className="input" placeholder="Email Address" />
        <input className="input" placeholder="Phone Number" />
        <input className="input" placeholder="LinkedIn Profile" />
        <input className="input" placeholder="GitHub Profile" />
        <input className="input" placeholder="Portfolio Website" />
      </Section>

      {/* Role Section */}
      <Section
        title="Role & Experience"
        description="Tell us what roles you're targeting."
      >
        <input className="input" placeholder="Desired Role (e.g. Frontend Developer)" />
        <input className="input" placeholder="Years of Experience" />
      </Section>

      {/* Resume Upload */}
      <Section
        title="Experience Architecture"
        description="Upload your resume."
      >
        <div className="col-span-2 border border-dashed border-neutral-700 rounded-2xl p-10 text-center">
          <p className="mb-4 text-neutral-400">
            Drag and drop your resume here
          </p>
          <button className="bg-white text-black px-6 py-2 rounded-lg">
            Select File
          </button>
        </div>
      </Section>

      {/* Skills Section */}
      <Section
        title="Skills Matrix"
        description="These will be used for AI matching."
      >
        <div className="col-span-2">
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="input flex-1"
              placeholder="Add skill"
            />
            <button
              onClick={addSkill}
              className="bg-blue-600 px-4 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>
      </Section>

      {/* Career Preferences */}
      <Section
        title="Career Trajectory"
        description="Work preferences and salary expectations."
      >
        <select className="input">
          <option>Work Type</option>
          <option>Full Time</option>
          <option>Contract</option>
          <option>Remote</option>
        </select>

        <input className="input" placeholder="Expected Salary" />
        <input className="input" placeholder="Preferred Location" />
        <input className="input" placeholder="Notice Period" />
      </Section>

      {/* Submit */}
      <div className="text-center mt-20">
        <button className="bg-blue-600 px-12 py-4 rounded-full text-lg">
          Submit Application
        </button>
        <p className="text-neutral-500 text-sm mt-3">
          Estimated AI review time: 45 seconds
        </p>
      </div>

    </div>
  );
}

/* Reusable Section Component */
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-10 mb-12">
      <div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-neutral-400 text-sm">{description}</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 grid grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}