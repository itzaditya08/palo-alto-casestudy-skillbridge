import { useState } from 'react';
import { api } from '../api/apiClient';

export default function Roadmap({ roadmapData, userProfile, targetJob, onNext, onBack, setIsGlobalLoading }) {
    const [localError, setLocalError] = useState("");

    const handleGenerateInterview = async () => {
        setIsGlobalLoading(true);
        setLocalError("");
        try {
            const interviewData = await api.getInterviewPrep({
                user_profile: userProfile,
                role_title: targetJob.role_title,
                jd_skills: targetJob.req_tech_stack
            });
            onNext(interviewData);
        } catch(err) {
            setLocalError(err.message || "Failed to generate interview questions.");
        } finally {
            setIsGlobalLoading(false);
        }
    };

    if (!roadmapData || !roadmapData.steps) return null;

    return (
        <div className="space-y-6 animate-fade-in-up w-full max-w-4xl mx-auto">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800 text-sm font-bold mb-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back to Gap Analysis
            </button>

            {localError && <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-bold">{localError}</div>}

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 border-b border-slate-100 pb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Learning Roadmap</h2>
                        <p className="text-slate-600 mt-2 text-lg font-medium">Your customized path to master the missing skills.</p>
                    </div>
                    
                    <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border shadow-sm flex items-center gap-2 ${roadmapData.is_fallback ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-100'}`}>
                        {!roadmapData.is_fallback && <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1.326l.086.043a6 6 0 013.588 3.588l.043.086V10a1 1 0 11-2 0v-.684l-.043-.086a4 4 0 00-2.392-2.392L10 6.84V10a1 1 0 11-2 0V6.84l-.043-.043a4 4 0 00-2.392 2.392l-.043.086V10a1 1 0 11-2 0V8.983l.043-.086a6 6 0 013.588-3.588l.086-.043V3a1 1 0 011-1z"></path></svg>}
                        {roadmapData.is_fallback ? 'Standard Curriculum' : 'AI Generated'}
                    </span>
                </div>

                <div className="space-y-4 relative">
                    {/* The continuous vertical line behind numbers */}
                    <div className="absolute left-[23px] top-4 bottom-12 w-0.5 bg-slate-100 border-l-2 border-dashed border-slate-200 z-0"></div>

                    {roadmapData.steps.map((step, index) => (
                        <div key={index} className="flex gap-6 relative z-10">
                            {/* Number Bubble */}
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center font-black text-xl border-2 border-indigo-100 shadow-sm">
                                    {index + 1}
                                </div>
                            </div>
                            
                            {/* Phase Card */}
                            <div className="pb-8 w-full group">
                                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.phase}</h3>
                                    <p className="text-base text-slate-600 leading-relaxed font-medium mb-5">
                                        {step.description}
                                    </p>
                                    
                                    {step.resources && step.resources.length > 0 && (
                                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Recommended Resources</p>
                                            <ul className="space-y-3">
                                                {step.resources.map((resource, idx) => (
                                                    <li key={idx} className="flex items-start text-sm group/link">
                                                        <svg className="w-5 h-5 mr-3 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                        <a 
                                                            href={resource.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-slate-700 font-bold group-hover/link:text-indigo-600 transition-colors break-words leading-tight"
                                                        >
                                                            {resource.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-8 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={handleGenerateInterview}
                        className="bg-slate-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-300 flex items-center gap-2"
                    >
                        Proceed to Mock Interview
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}