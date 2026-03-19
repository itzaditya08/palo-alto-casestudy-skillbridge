import { useState } from 'react';

export default function InterviewPrep({ interviewData, onFinish, onBack }) {
    const [revealedHints, setRevealedHints] = useState({});

    if (!interviewData || !interviewData.questions) return null;

    const toggleHint = (index) => {
        setRevealedHints(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const getDifficultyStyles = (diff) => {
        const lowerDiff = diff.toLowerCase();
        if (lowerDiff === 'easy') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (lowerDiff === 'hard') return 'bg-rose-100 text-rose-800 border-rose-200';
        return 'bg-amber-100 text-amber-800 border-amber-200';
    };

    return (
        <div className="space-y-6 animate-fade-in-up w-full max-w-4xl mx-auto">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800 text-sm font-bold mb-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back to Roadmap
            </button>

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-slate-100 pb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Readiness Check</h2>
                        <p className="text-slate-600 mt-2 text-lg font-medium">Practice these 5 technical questions aloud.</p>
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border shadow-sm flex items-center gap-2 ${interviewData.is_fallback ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-100'}`}>
                        {!interviewData.is_fallback && <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1.326l.086.043a6 6 0 013.588 3.588l.043.086V10a1 1 0 11-2 0v-.684l-.043-.086a4 4 0 00-2.392-2.392L10 6.84V10a1 1 0 11-2 0V6.84l-.043-.043a4 4 0 00-2.392 2.392l-.043.086V10a1 1 0 11-2 0V8.983l.043-.086a6 6 0 013.588-3.588l.086-.043V3a1 1 0 011-1z"></path></svg>}
                        {interviewData.is_fallback ? 'Standard Bank' : 'AI Generated'}
                    </span>
                </div>

                <div className="space-y-6">
                    {interviewData.questions.map((q, index) => (
                        <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4 gap-4">
                                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-100 px-3 py-1 rounded-lg">
                                    {q.topic}
                                </span>
                                <span className={`text-xs font-bold px-3 py-1 rounded-lg border shadow-sm ${getDifficultyStyles(q.difficulty)}`}>
                                    {q.difficulty}
                                </span>
                            </div>
                            
                            <p className="text-slate-800 font-bold text-lg mb-6 leading-relaxed">{q.question}</p>
                            
                            <div className="border-t border-slate-200 pt-4">
                                <button 
                                    onClick={() => toggleHint(index)}
                                    className="text-slate-500 hover:text-indigo-600 text-sm font-bold flex items-center gap-1.5 transition-colors"
                                >
                                    <svg className={`w-4 h-4 transition-transform ${revealedHints[index] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    {revealedHints[index] ? 'Hide Answer' : 'Reveal Answer'}
                                </button>
                                
                                {revealedHints[index] && (
                                    <div className="mt-4 p-5 bg-white border border-indigo-100 rounded-xl text-sm font-medium text-slate-700 shadow-inner flex gap-3 animate-fade-in-up">
                                        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <p className="whitespace-pre-wrap leading-relaxed">{q.answer}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 flex flex-col items-center border-t border-slate-100">
                    <p className="text-slate-500 text-sm font-bold mb-5 uppercase tracking-widest">You have completed the Skill-Bridge journey</p>
                    <button 
                        onClick={onFinish}
                        className="bg-indigo-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        Finish & Return Home
                    </button>
                </div>
            </div>
        </div>
    );
}