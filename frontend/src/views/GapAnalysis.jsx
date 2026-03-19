import { useState } from 'react';
import { api } from '../api/apiClient';

export default function GapAnalysis({ analysisData, userProfile, targetJob, onNext, onBack, setIsGlobalLoading }) {
    const [localError, setLocalError] = useState("");

    const handleGenerateRoadmap = async () => {
        setIsGlobalLoading(true);
        setLocalError("");
        try {
            const roadmapData = await api.getRoadmap({
                user_profile: userProfile,
                role_title: targetJob.role_title,
                jd_skills: targetJob.req_tech_stack
            });
            onNext(roadmapData);
        } catch(err) {
            setLocalError(err.message || "Failed to generate roadmap.");
        } finally {
            setIsGlobalLoading(false);
        }
    };

    const hasCgpaGap = userProfile.cgpa < targetJob.min_cgpa;

    if (!analysisData) return null;

    return (
        <div className="space-y-6 animate-fade-in-up w-full max-w-4xl mx-auto">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800 text-sm font-bold mb-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back to Profile
            </button>

            {localError && <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-bold">{localError}</div>}

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-slate-100 pb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Skill Gap Analysis</h2>
                        <p className="text-slate-600 mt-2 text-lg leading-relaxed font-medium">{analysisData.summary}</p>
                    </div>
                    {analysisData.is_fallback && (
                        <span className="bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full border border-amber-200 shadow-sm flex-shrink-0">
                            Offline Mode
                        </span>
                    )}
                </div>

                {/* CGPA Audit Card */}
                <div className={`p-6 rounded-2xl mb-10 border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 ${hasCgpaGap ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'}`}>
                    <div>
                        <h3 className={`text-xs font-black uppercase tracking-widest mb-1 ${hasCgpaGap ? 'text-orange-800' : 'text-emerald-800'}`}>Academic Audit</h3>
                        <p className={`text-sm font-bold ${hasCgpaGap ? 'text-orange-900' : 'text-emerald-900'}`}>
                            Your CGPA: <span className="font-black text-lg ml-1">{userProfile.cgpa}</span> 
                            <span className="mx-2 opacity-50">|</span> 
                            Required: <span className="font-black">{targetJob.min_cgpa}</span>
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-black text-sm shadow-sm ${hasCgpaGap ? 'bg-white text-orange-600' : 'bg-white text-emerald-600'}`}>
                        {hasCgpaGap ? '⚠️ Minor Gap Detected' : '✨ Requirement Met'}
                    </div>
                </div>

                {/* Skills Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matched Skills */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Matched Skills</h3>
                        </div>
                        
                        {analysisData.matched_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {analysisData.matched_skills.map(skill => (
                                    <span key={skill} className="bg-white border border-slate-200 text-slate-700 font-bold text-sm px-4 py-2 rounded-xl shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm font-bold text-slate-400 italic">No exact matches found.</p>
                        )}
                    </div>

                    {/* Missing Skills */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Target Skills</h3>
                        </div>

                        {analysisData.missing_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {analysisData.missing_skills.map(skill => (
                                    <span key={skill} className="bg-indigo-600 text-white shadow-md shadow-indigo-200 font-bold text-sm px-4 py-2 rounded-xl">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">✨ You meet all technical requirements!</p>
                        )}
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={handleGenerateRoadmap}
                        className="bg-slate-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-300 flex items-center gap-2"
                    >
                        Generate Learning Roadmap
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}