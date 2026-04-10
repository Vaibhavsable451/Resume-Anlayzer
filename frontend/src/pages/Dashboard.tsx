import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    CheckCircle2, AlertTriangle, Lightbulb,
    ChevronRight, Copy, Download, Trophy,
    ArrowLeft, Cpu, Briefcase, GraduationCap, Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [data, setData] = useState<any>(null);
    const [showJson, setShowJson] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'interview' | 'coverletter' | 'roadmap'>('overview');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // PRIORITY 1: Check if we passed data via Navigation State (History Page)
        if (location.state?.analysis) {
            setData(location.state.analysis);
            return;
        }

        // PRIORITY 2: Check Session Storage (Fresh Scans)
        const result = sessionStorage.getItem('analysisResult');
        if (result) {
            setData(JSON.parse(result));
            return;
        }

        // FALLBACK: Back to home if nothing found
        navigate('/');
    }, [navigate, location.state]);

    if (!data) return <div className="h-screen flex items-center justify-center text-primary animate-pulse font-bold text-2xl">Loading...</div>;

    // DEFENSIVE DESTRUCTURING (Prevents crashes if data is missing parts)
    const { 
        analysis = {} as any, 
        resume = {} as any, 
        jd = {} as any, 
        coverLetter = "", 
        interviewQuestions = {} as any, 
        roadmap = {} as any 
    } = data || {};

    // SAFE RENDER HELPERS
    const safeStr = (obj: any) => {
        if (!obj) return "";
        if (typeof obj === 'string') return obj;
        if (Array.isArray(obj)) return obj.join(", ");
        if (typeof obj === 'object') return JSON.stringify(obj);
        return String(obj);
    };

    const safeList = (obj: any): any[] => {
        if (!obj) return [];
        if (Array.isArray(obj)) return obj;
        if (typeof obj === 'string') return [obj];
        return [JSON.stringify(obj)];
    };

    const safeScore = (score: any) => {
        if (score === undefined || score === null) return 0;
        if (typeof score === 'number') return score;
        const s = String(score).replace(/[^0-9]/g, '');
        return parseInt(s) || 0;
    };

    const overallScore = safeScore(analysis?.overallScore);

    const scoreData = [
        { name: 'Score', value: overallScore },
        { name: 'Gap', value: 100 - overallScore },
    ];

    const breakdownData = (analysis?.scoreBreakdown) ? Object.keys(analysis.scoreBreakdown).map(key => ({
        subject: key,
        A: analysis.scoreBreakdown[key],
        fullMark: 100,
    })) : [];

    const COLORS = ['#8b5cf6', '#1e293b'];

    return (
        <div className="space-y-12 pb-20">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-primary/5 p-8 rounded-3xl border border-primary/10">
                <div className="space-y-1">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-semibold mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Go Back</span>
                    </button>
                    <h1 className="text-4xl font-bold font-outfit">Analysis <span className="text-primary">Dashboard</span></h1>
                    <p className="text-foreground/60">Comprehensive feedback for {safeStr(resume?.candidateName)}</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-bold">
                        <Trophy className="w-4 h-4" />
                        <span>Apply Now</span>
                    </button>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/40 hover:text-foreground'}`}
                >
                    Overview
                </button>
                
                {interviewQuestions?.technicalQuestions?.length > 0 && (
                    <button 
                    onClick={() => setActiveTab('interview')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'interview' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-foreground/40 hover:text-foreground'}`}
                    >
                        <Zap className="w-4 h-4" />
                        Interview Prep
                    </button>
                )}

                {coverLetter && !coverLetter.includes("N/A") && (
                    <button 
                    onClick={() => setActiveTab('coverletter')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'coverletter' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-foreground/40 hover:text-foreground'}`}
                    >
                        Cover Letter
                    </button>
                )}

                {roadmap?.weeks?.length > 0 && (
                    <button 
                    onClick={() => setActiveTab('roadmap')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'roadmap' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-foreground/40 hover:text-foreground'}`}
                    >
                        <Trophy className="w-4 h-4" />
                        Growth Roadmap
                    </button>
                )}
            </div>

            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                  <div className="grid lg:grid-cols-3 gap-8">
                      {/* Overall Score */}
                      <div className="glass-morphism p-10 rounded-3xl flex flex-col items-center justify-center gap-6 group hover:border-primary/30 transition-colors">
                          <h3 className="text-2xl font-bold font-outfit text-center">Overall Fit Score</h3>
                          <div className="relative w-full aspect-square max-w-[240px]">
                              <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                      <Pie data={scoreData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                                          {scoreData.map((_entry, index) => (
                                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                          ))}
                                      </Pie>
                                  </PieChart>
                              </ResponsiveContainer>
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                  <span className="text-6xl font-black font-outfit text-primary group-hover:scale-110 transition-transform">{overallScore}%</span>
                                  <span className="text-sm font-bold text-foreground/40 tracking-wider uppercase">Match</span>
                              </div>
                          </div>
                          <p className="text-center text-foreground/60 text-sm italic">"{safeStr(analysis.aiExplanation).substring(0, 150)}..."</p>
                      </div>

                      {/* ATS Score Details */}
                      <div className="glass-morphism p-10 rounded-3xl space-y-8 lg:col-span-2">
                          <div className="flex items-center justify-between border-b border-white/10 pb-6">
                              <h3 className="text-2xl font-bold font-outfit flex items-center gap-3">
                                  <Cpu className="text-primary w-6 h-6" />
                                  <span>ATS Optimization</span>
                              </h3>
                              <div className="px-4 py-1.5 bg-primary/20 text-primary rounded-full font-black">
                                  SCORE: {safeStr(analysis.atsScore)}
                              </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-10">
                              <div className="h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={breakdownData}>
                                          <PolarGrid stroke="#ffffff20" />
                                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                                          <Radar name="Candidate" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                      </RadarChart>
                                  </ResponsiveContainer>
                              </div>
                              <div className="space-y-4">
                                  <h4 className="font-bold text-sm text-foreground/40 uppercase tracking-widest">Matching Strengths</h4>
                                  <div className="flex flex-wrap gap-2">
                                      {safeList(analysis.matchingStrengths).map((s: any, idx: number) => (
                                          <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-xl text-sm border border-green-500/20">
                                              <CheckCircle2 className="w-4 h-4" />
                                              <span>{safeStr(s)}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                      <div className="glass-morphism p-10 rounded-3xl space-y-6">
                          <h3 className="text-2xl font-bold font-outfit flex items-center gap-3">
                              <AlertTriangle className="text-amber-400 w-6 h-6" />
                              <span>Critical Skill Gaps</span>
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                              {safeList(analysis.missingSkills).map((skill: any, idx: number) => (
                                  <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-amber-400/30 transition-colors">
                                      <span className="font-medium text-sm">{safeStr(skill)}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="glass-morphism p-10 rounded-3xl space-y-6">
                          <h3 className="text-2xl font-bold font-outfit flex items-center gap-3">
                              <Lightbulb className="text-blue-400 w-6 h-6" />
                              <span>AI Recommendations</span>
                          </h3>
                          <div className="space-y-4">
                              {safeList(analysis.resumeImprovements).map((imp: any, i: number) => (
                                  <div key={i} className="flex gap-4">
                                      <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">{i+1}</div>
                                      <p className="text-foreground/70 text-sm leading-relaxed">{safeStr(imp)}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </motion.div>
            )}

            {activeTab === 'interview' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="glass-morphism p-10 rounded-3xl space-y-8">
                            <h3 className="text-2xl font-extrabold font-outfit text-secondary border-b border-white/10 pb-6 flex items-center gap-3">
                                <Zap className="w-6 h-6" />
                                Technical Masterclass
                            </h3>
                            <div className="space-y-8">
                                {safeList(interviewQuestions?.technicalQuestions).map((q: any, i: number) => (
                                    <div key={i} className="space-y-4 group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex gap-4">
                                                <span className="text-foreground/10 font-black text-3xl">0{i+1}</span>
                                                <p className="font-bold text-lg leading-tight group-hover:text-secondary transition-colors">{q.question}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                                q.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' : 
                                                q.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
                                            }`}>
                                                {q.difficulty}
                                            </span>
                                        </div>
                                        <div className="ml-14 p-5 bg-background border-l-4 border-secondary/20 rounded-r-2xl text-sm text-foreground/60 leading-relaxed shadow-inner">
                                            <span className="text-secondary font-black text-[10px] uppercase block mb-2 tracking-widest opacity-60">Answer Blueprint:</span>
                                            {q.answerHint}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="glass-morphism p-10 rounded-3xl space-y-8 border-amber-400/10 border">
                                <h3 className="text-2xl font-bold font-outfit text-amber-400">Coding Challenges</h3>
                                <div className="space-y-6">
                                    {safeList(interviewQuestions?.codingChallenges).map((q: any, i: number) => (
                                        <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-400/30 transition-all">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-amber-400 font-black text-xs uppercase tracking-tighter">Algorithm #{i+1}</span>
                                                <span className="text-[10px] font-mono opacity-40">{q.difficulty}</span>
                                            </div>
                                            <p className="font-bold mb-4">{q.question}</p>
                                            <p className="text-xs text-foreground/40 italic leading-relaxed">{q.answerHint}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-morphism p-10 rounded-3xl space-y-6">
                                <h3 className="text-2xl font-bold font-outfit text-blue-400">System Design & Behavior</h3>
                                <div className="space-y-4">
                                     {safeList(interviewQuestions?.behavioralQuestions).map((q: any, i: number) => (
                                        <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 font-bold italic">?</div>
                                            <p className="text-sm font-medium text-foreground/70">{q.question}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'coverletter' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative overflow-hidden group">
                    <div className="glass-morphism p-12 rounded-3xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <h3 className="text-3xl font-extrabold font-outfit">The <span className="text-indigo-400">Perfect pitch</span></h3>
                                <p className="text-foreground/40 text-sm mt-1">Generated for {safeStr(jd?.jobTitle)}</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => { navigator.clipboard.writeText(coverLetter); alert("Copied!"); }} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-indigo-400"><Copy className="w-5 h-5" /></button>
                                <button className="flex items-center gap-2 px-8 py-4 bg-indigo-500 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all outline-none">Download Letter</button>
                            </div>
                        </div>
                        <div className="bg-background/80 border border-white/10 p-12 rounded-3xl font-serif text-xl leading-loose whitespace-pre-wrap text-foreground/90 relative z-10 max-h-[600px] overflow-y-auto custom-scrollbar italic shadow-2xl">
                            {coverLetter}
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'roadmap' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12 max-w-5xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-5xl font-black font-outfit uppercase tracking-tighter">Your <span className="text-amber-400">30-Day</span> Journey</h2>
                        <p className="text-xl text-foreground/40 font-medium">{roadmap?.title || "Personalized Career Progression Plan"}</p>
                    </div>

                    <div className="relative space-y-12">
                        {/* THE TIMELINE LINE */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

                        {safeList(roadmap?.weeks).map((week: any, i: number) => (
                            <div key={i} className={`flex flex-col md:flex-row gap-10 items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className="w-full md:w-1/2 space-y-4 text-center md:text-right">
                                    <div className={`text-6xl font-black opacity-10 font-outfit ${i % 2 === 0 ? '' : 'md:text-left'}`}>WEEK 0{i+1}</div>
                                    <h4 className={`text-2xl font-bold text-amber-400 ${i % 2 === 0 ? '' : 'md:text-left'}`}>{week.focusGoal}</h4>
                                </div>
                                
                                <div className="w-12 h-12 rounded-full bg-amber-400 border-8 border-background z-10 shrink-0 shadow-lg shadow-amber-400/20" />

                                <div className="w-full md:w-1/2">
                                    <div className="glass-morphism p-8 rounded-3xl border-white/5 hover:border-amber-400/30 transition-all group">
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                {safeList(week.topicsToMaster).map((topic: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-foreground/60">{topic}</span>
                                                ))}
                                            </div>
                                            <div className="pt-4 border-t border-white/10">
                                                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3">Goal Project:</p>
                                                <p className="text-sm text-foreground/70 leading-relaxed font-medium">{safeList(week.miniProject).join(". ")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 pt-10">
                         <div className="glass-morphism p-10 rounded-3xl space-y-6">
                            <h3 className="text-2xl font-bold font-outfit text-primary flex items-center gap-3">
                                <Lightbulb className="w-6 h-6" />
                                Recommended Resources
                            </h3>
                            <div className="grid gap-3">
                                {safeList(roadmap?.recommendedResources).map((res: string, i: number) => (
                                    <div key={i} className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <p className="text-sm font-medium">{res}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-amber-400/10 border border-amber-400/20 p-10 rounded-3xl relative overflow-hidden group">
                           <Trophy className="absolute -right-10 -bottom-10 w-64 h-64 text-amber-400/5 group-hover:scale-110 transition-transform" />
                           <h3 className="text-2xl font-bold font-outfit text-amber-400 mb-4">The Final Milestone</h3>
                           <p className="text-lg font-bold leading-snug mb-6">{roadmap?.finalProjectIdea}</p>
                           <button className="px-6 py-3 bg-amber-400 text-background rounded-xl font-black text-sm hover:scale-105 transition-all">Start Journey</button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Resume Metadata Footer */}
            <div className="pt-20 border-t border-white/5 flex flex-col items-center gap-10">
                <div className="flex gap-10 opacity-30">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl font-black">{safeList(resume?.experience).length}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest">Experiences</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl font-black">{safeList(resume?.projects).length}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest">Projects</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl font-black">{safeList(resume?.education).length}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest">Education</span>
                    </div>
                </div>

                <div className="text-center group">
                    <button 
                      onClick={() => setShowJson(!showJson)}
                      className="text-[10px] font-mono text-foreground/20 hover:text-primary transition-colors tracking-[0.2em] uppercase"
                    >
                        {showJson ? "Back to Experience" : "Inspect Raw Analysis Json"}
                    </button>
                    {showJson && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-left max-w-2xl mx-auto glass-morphism p-6 rounded-2xl">
                            <pre className="text-[10px] text-foreground/40 overflow-x-auto p-4 bg-black/20 rounded-xl">{JSON.stringify(data, null, 2)}</pre>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
