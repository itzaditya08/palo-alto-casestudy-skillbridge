import { useState } from 'react';
import Layout from './components/Layout';
import ProfileSetup from './views/ProfileSetup';
import GapAnalysis from './views/GapAnalysis';
import Roadmap from './views/Roadmap';
import InterviewPrep from './views/InterviewPrep';

export default function App() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);

    const [userProfile, setUserProfile] = useState(null);
    const [targetJob, setTargetJob] = useState(null);
    
    const [analysisData, setAnalysisData] = useState(null);
    const [roadmapData, setRoadmapData] = useState(null);
    const [interviewData, setInterviewData] = useState(null);

    const handleStep1Complete = (profile, job, analysis) => {
        setUserProfile(profile);
        setTargetJob(job);
        setAnalysisData(analysis);
        setCurrentStep(2);
    };

    const handleStep2Complete = (roadmap) => {
        setRoadmapData(roadmap);
        setCurrentStep(3);
    };

    const handleStep3Complete = (interviewPrep) => {
        setInterviewData(interviewPrep);
        setCurrentStep(4);
    };

    const resetApp = () => {
        setUserProfile(null);
        setTargetJob(null);
        setAnalysisData(null);
        setRoadmapData(null);
        setInterviewData(null);
        setCurrentStep(1);
    };

    return (
        <Layout currentStep={currentStep} isGlobalLoading={isGlobalLoading}>
            {currentStep === 1 && (
                <ProfileSetup 
                    onNext={handleStep1Complete} 
                    setIsGlobalLoading={setIsGlobalLoading} 
                />
            )}
            {currentStep === 2 && (
                <GapAnalysis 
                    analysisData={analysisData}
                    userProfile={userProfile}
                    targetJob={targetJob}
                    onNext={handleStep2Complete} 
                    onBack={() => setCurrentStep(1)} 
                    setIsGlobalLoading={setIsGlobalLoading}
                />
            )}
            {currentStep === 3 && (
                <Roadmap 
                    roadmapData={roadmapData} 
                    userProfile={userProfile}
                    targetJob={targetJob}
                    onNext={handleStep3Complete} 
                    onBack={() => setCurrentStep(2)}
                    setIsGlobalLoading={setIsGlobalLoading} 
                />
            )}
            {currentStep === 4 && (
                <InterviewPrep 
                    interviewData={interviewData} 
                    onFinish={resetApp} 
                    onBack={() => setCurrentStep(3)} 
                />
            )}
        </Layout>
    );
}