export default function Layout({ children, currentStep, isGlobalLoading }) {
    return (
        <div className="min-h-screen flex flex-col relative font-sans text-slate-800">
            
            {/* GLOBAL LOADING OVERLAY */}
            {isGlobalLoading && (
                <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex flex-col items-center justify-center transition-all">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 border border-slate-100 animate-fade-in-up">
                        <div className="loader w-8 h-8 mb-4 border-t-primary border-4"></div>
                        <h3 className="text-lg font-bold text-slate-800">Analyzing Profile</h3>
                        <p className="text-slate-500 font-medium text-sm animate-pulse mt-1">Gemini AI is crunching the data...</p>
                    </div>
                </div>
            )}

            {/* STICKY FROSTED HEADER */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 transition-all">
                <div className="max-w-5xl mx-auto flex justify-between items-center py-4 px-6 md:px-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Skill<span className="text-indigo-600">Bridge</span></h1>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step</span>
                        <span className="text-sm font-bold text-indigo-600 bg-indigo-100 w-6 h-6 flex items-center justify-center rounded-full">{currentStep}</span>
                        <span className="text-xs font-bold text-slate-400">/ 4</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center py-12 px-4 md:px-8">
                <div className={`w-full max-w-4xl relative ${isGlobalLoading ? 'pointer-events-none' : ''}`}>
                    {children}
                </div>
            </main>

            <footer className="text-center py-8 text-sm font-medium text-slate-400">
                &copy; {new Date().getFullYear()} Palo Alto Networks Case Study
            </footer>
        </div>
    );
}