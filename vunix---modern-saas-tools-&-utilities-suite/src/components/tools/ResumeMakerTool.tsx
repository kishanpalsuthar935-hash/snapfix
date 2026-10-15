import React, { useState } from 'react';
import { Plus, Trash2, Printer, Download, Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  bullets: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export const ResumeMakerTool: React.FC = () => {
  // Inputs load blank by default
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        role: '',
        company: '',
        duration: '',
        bullets: '',
      },
    ]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        id: Date.now().toString(),
        degree: '',
        school: '',
        year: '',
      },
    ]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
  };

  const removeEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Editor Controls */}
      <div className="lg:col-span-6 space-y-6">
        {/* Personal Details */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Personal & Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Target Role Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
            />
          </div>

          <input
            type="text"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            placeholder="LinkedIn / Portfolio URL (e.g. linkedin.com/in/maya)"
            className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
          />

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Executive Summary</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Results-driven leader with 8+ years experience scaling cross-functional teams..."
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Key Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Product Strategy, Roadmapping, SQL, A/B Testing, User Research"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
            />
          </div>
        </div>

        {/* Work Experience */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">Work Experience</span>
            <button
              onClick={addExperience}
              className="px-3 py-1 rounded-full bg-[#EDE9FE] text-[#451A03] text-xs font-semibold hover:bg-[#DDD6FE] transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
          </div>

          {experiences.map((exp, idx) => (
            <div key={exp.id} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-500">Position #{idx + 1}</span>
                <button onClick={() => removeExperience(exp.id)} className="text-neutral-400 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                  placeholder="Role Title"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs"
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Company Name"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs"
                />
              </div>
              <input
                type="text"
                value={exp.duration}
                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                placeholder="Duration (e.g. 2022 - Present)"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs"
              />
              <textarea
                rows={2}
                value={exp.bullets}
                onChange={(e) => updateExperience(exp.id, 'bullets', e.target.value)}
                placeholder="Key achievements (Enter bullet points or lines)..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs"
              />
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">Education</span>
            <button
              onClick={addEducation}
              className="px-3 py-1 rounded-full bg-[#EDE9FE] text-[#451A03] text-xs font-semibold hover:bg-[#DDD6FE] transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Degree
            </button>
          </div>

          {educations.map((edu, idx) => (
            <div key={edu.id} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 grid grid-cols-12 gap-2 items-center">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder="Degree (e.g. B.S. Computer Science)"
                className="col-span-5 px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs"
              />
              <input
                type="text"
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                placeholder="Institution"
                className="col-span-4 px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs"
              />
              <input
                type="text"
                value={edu.year}
                onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                placeholder="Year"
                className="col-span-2 px-2 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs text-center"
              />
              <button
                onClick={() => removeEducation(edu.id)}
                className="col-span-1 text-neutral-400 hover:text-red-600 flex justify-center"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Live ATS-Ready Resume Preview */}
      <div className="lg:col-span-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            A4 ATS-Optimized Sheet
          </span>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Export PDF
          </button>
        </div>

        {/* Printable Paper */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-300 shadow-md font-sans text-neutral-800 space-y-6 min-h-[640px]">
          {/* Header */}
          <div className="border-b-2 border-neutral-900 pb-4 text-center">
            <h2 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">
              {fullName || 'YOUR FULL NAME'}
            </h2>
            <p className="text-sm font-semibold text-[#451A03] mt-0.5">
              {jobTitle || 'TARGET PROFESSION / ROLE'}
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-[11px] text-neutral-500 mt-2 font-mono">
              {email && <span>{email}</span>}
              {phone && <span>• {phone}</span>}
              {location && <span>• {location}</span>}
              {portfolio && <span>• {portfolio.replace(/^https?:\/\//, '')}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                Executive Profile
              </h4>
              <p className="text-xs leading-relaxed text-neutral-700 whitespace-pre-line">
                {summary}
              </p>
            </div>
          )}

          {/* Experience */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-3">
              Professional Experience
            </h4>
            {experiences.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No roles added yet</p>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="text-xs space-y-1">
                    <div className="flex justify-between font-bold text-neutral-900">
                      <span>{exp.role || 'Job Title'} — {exp.company || 'Company'}</span>
                      <span className="text-neutral-500 font-mono text-[11px]">{exp.duration}</span>
                    </div>
                    {exp.bullets && (
                      <p className="text-neutral-600 whitespace-pre-line leading-relaxed pl-2 border-l border-neutral-300">
                        {exp.bullets}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          {educations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                Education
              </h4>
              <div className="space-y-2">
                {educations.map((edu) => (
                  <div key={edu.id} className="text-xs flex justify-between">
                    <div>
                      <span className="font-bold">{edu.degree || 'Degree'}</span>
                      {edu.school && <span className="text-neutral-600">, {edu.school}</span>}
                    </div>
                    <span className="text-neutral-500 font-mono text-[11px]">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                Core Competencies & Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.split(',').map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-800"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
