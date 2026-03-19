import { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import { z } from 'zod';

const profileSchema = z.object({
    full_name: z.string()
        .trim()
        .min(1, "Full Name is required.")
        .regex(/^[a-zA-Z\s\-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes."),
    education_level: z.string(),
    cgpa: z.number({ invalid_type_error: "Please enter a valid number for CGPA." })
           .min(0.0, "CGPA cannot be less than 0.0.")
           .max(4.0, "CGPA cannot exceed 4.0."),
    tech_stack: z.array(z.string()).min(1, "Please add at least one skill to your tech stack.")
});

export default function ProfileSetup({ onNext, setIsGlobalLoading }) {
    const [localStep, setLocalStep] = useState(1); 
    const [isLoading, setIsLoading] = useState(false); 
    const [localError, setLocalError] = useState("");
    
    const [availableJobs, setAvailableJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState("");
    
    const [formData, setFormData] = useState({
        full_name: "",
        education_level: "B.S. Computer Science",
        cgpa: "",
        tech_stack: []
    });
    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobs = await api.getJobs();
                setAvailableJobs(jobs);
                if (jobs.length > 0) setSelectedJobId(jobs[0].id);
            } catch (err) {
                setLocalError("Failed to load job descriptions from server.");
            }
        };
        fetchJobs();
    }, []);

    const handleSimulateUpload = async () => {
        setIsLoading(true);
        setLocalError("");
        try {
            const resumes = await api.getResumes();
            if (resumes && resumes.length > 0) {
                setFormData({
                    full_name: resumes[0].full_name,
                    education_level: resumes[0].education_level,
                    cgpa: resumes[0].cgpa,
                    tech_stack: resumes[0].tech_stack
                });
            }
        } catch (err) {
            setLocalError("Failed to upload resume.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !formData.tech_stack.includes(newSkill.trim())) {
            setFormData({ ...formData, tech_stack: [...formData.tech_stack, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({ ...formData, tech_stack: formData.tech_stack.filter(s => s !== skillToRemove) });
    };

    const handleNextToJobs = () => {
        setLocalError("");
        const validationResult = profileSchema.safeParse(formData);

        if (!validationResult.success) {
            const firstErrorMessage = validationResult.error.issues[0].message;
            setLocalError(firstErrorMessage);
            return;
        }
        setLocalStep(2); 
    };

    const handleRunGapAnalysis = async () => {
        setIsGlobalLoading(true); 
        setLocalError("");
        try {
            const selectedJob = availableJobs.find(j => j.id === selectedJobId);
            const analysisData = await api.getGapAnalysis({
                user_profile: formData,
                role_title: selectedJob.role_title,
                jd_skills: selectedJob.req_tech_stack
            });
            onNext(formData, selectedJob, analysisData);
        } catch (err) {
            setLocalError(err.message || "Gap Analysis failed.");
        } finally {
            setIsGlobalLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up w-full max-w-2xl mx-auto">
            
            {localError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-semibold shadow-sm flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {localError}
                </div>
            )}

            {/* SECTION 1: RESUME */}
            <div className={`bg-white p-8 rounded-2xl shadow-xl border border-slate-100 transition-all duration-300 ${localStep === 2 ? 'opacity-40 pointer-events-none scale-[0.98]' : ''}`}>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Profile</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Upload your JSON resume to auto-fill or enter manually.</p>
                </div>

                <div className="mb-8">
                    <button 
                        onClick={handleSimulateUpload}
                        disabled={isLoading}
                        className="w-full border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 font-semibold py-6 rounded-xl transition-colors flex flex-col items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <div className="loader h-6 w-6 border-2 border-t-indigo-600"></div>
                        ) : (
                            <>
                                <svg className="w-8 h-8 text-indigo-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                <span>Click to Upload Resume (.json)</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                            value={formData.full_name}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            placeholder="e.g. Alex Thompson"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Education Level</label>
                        <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                            value={formData.education_level}
                            onChange={(e) => setFormData({...formData, education_level: e.target.value})}
                        >
                            <option>B.S. Computer Science</option>
                            <option>B.Tech Information Technology</option>
                            <option>Master's Degree</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Current CGPA (0.0 - 4.0)</label>
                        <input 
                            type="number" step="0.1" max="4.0" min="0.0"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                            value={formData.cgpa === "" ? "" : formData.cgpa}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFormData({...formData, cgpa: val === "" ? "" : parseFloat(val)});
                            }}
                            placeholder="3.8"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tech Stack</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 min-h-[52px] flex flex-wrap gap-2 items-center focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-sm">
                            {formData.tech_stack.map(skill => (
                                <span key={skill} className="bg-white border border-slate-200 text-slate-700 shadow-sm text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                                    {skill}
                                    <button onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-red-500 transition-colors">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </span>
                            ))}
                            <form onSubmit={handleAddSkill} className="inline-flex flex-grow ml-2">
                                <input 
                                    type="text" 
                                    placeholder="Type a skill and press Enter..." 
                                    className="outline-none text-sm font-medium w-full bg-transparent placeholder-slate-400"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>
                </div>

                {localStep === 1 && (
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button 
                            onClick={handleNextToJobs}
                            className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                        >
                            Next Step
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                )}
            </div>

            {/* SECTION 2: JOB SELECTION */}
            {localStep === 2 && (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 animate-fade-in-up">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Target Role</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Select the position you're aiming for to start the gap analysis.</p>
                    </div>

                    <div className="w-full">
                        <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 text-base font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none mb-6 shadow-sm appearance-none cursor-pointer"
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                        >
                            {availableJobs.map(job => (
                                <option key={job.id} value={job.id}>{job.role_title}</option>
                            ))}
                        </select>

                        {availableJobs.find(j => j.id === selectedJobId) && (
                            <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                                <div className="grid grid-cols-2 gap-4 border-b border-indigo-100 pb-4 mb-4">
                                    <div>
                                        <p className="text-xs text-indigo-400 uppercase font-extrabold tracking-wider">Min Education</p>
                                        <p className="text-sm font-bold text-indigo-900 mt-1">{availableJobs.find(j => j.id === selectedJobId).min_education}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-400 uppercase font-extrabold tracking-wider">Min CGPA</p>
                                        <p className="text-sm font-bold text-indigo-900 mt-1">{availableJobs.find(j => j.id === selectedJobId).min_cgpa}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-400 uppercase font-extrabold tracking-wider mb-3">Required Stack</p>
                                    <div className="flex flex-wrap gap-2">
                                        {availableJobs.find(j => j.id === selectedJobId).req_tech_stack.map(skill => (
                                            <span key={skill} className="bg-white border border-indigo-100 text-indigo-700 shadow-sm text-xs font-bold px-3 py-1 rounded-lg">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <button 
                                onClick={() => setLocalStep(1)}
                                className="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                Edit Profile
                            </button>
                            <button 
                                onClick={handleRunGapAnalysis}
                                className="w-full sm:w-auto bg-slate-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-300 flex items-center justify-center gap-2"
                            >
                                Run AI Analysis
                                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}