import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true
});

const AtsChecker = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await api.post('/api/analyze/resume-only', formData);
            // We use the same dashboard structure, just with no JD data
            sessionStorage.setItem('analysisResult', JSON.stringify({
                ...response.data,
                jd: { jobTitle: "General ATS Scan", company: "Industry Standard" },
                coverLetter: "N/A (ATS Scan Only)"
            }));
            navigate('/dashboard');
        } catch (error: any) {
            console.error("ATS Check failed:", error);
            const message = error.response?.data?.error || error.message || "Unknown error";
            alert(`ATS Check failed: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 text-center mb-16"
            >
                <div className="space-y-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-black uppercase tracking-widest border border-secondary/20"
                    >
                        <Zap className="w-3 h-3 fill-secondary" />
                        <span>Instant AI Tracking System</span>
                    </motion.div>
                    <h1 className="text-6xl font-black font-outfit tracking-tighter leading-none">
                        Check Your <br />
                        <span className="text-secondary italic">ATS Visibility</span>
                    </h1>
                    <p className="text-lg text-foreground/50 max-w-2xl mx-auto font-medium">
                        No job description needed. Our AI simulates a <span className="text-white">Full ATS Parse</span> to identify if your resume is readable by modern recruitment software.
                    </p>
                </div>
            </motion.div>

            <div className="glass-morphism p-1 rounded-[3rem] relative group overflow-hidden">
                {/* Glowing background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="bg-[#0c1120]/80 p-10 rounded-[2.9rem] space-y-10 relative z-10">
                    <div 
                        className={`border-2 border-dashed rounded-3xl p-16 transition-all relative overflow-hidden ${
                            file ? 'border-secondary bg-secondary/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                        }`}
                    >
                        {/* Scanning Effect Animation */}
                        {loading && (
                            <motion.div 
                                initial={{ top: -10 }}
                                animate={{ top: '100%' }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent shadow-[0_0_15px_rgba(199,89,48,0.8)] z-20 pointer-events-none"
                            />
                        )}

                        <input 
                            type="file" 
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-30"
                        />
                        <div className="flex flex-col items-center gap-8">
                            <div className={`w-24 h-24 rounded-3xl transition-all flex items-center justify-center ${file ? 'bg-secondary text-white scale-110 shadow-[0_0_30px_rgba(20,184,166,0.2)]' : 'bg-white/5 text-foreground/20 group-hover:bg-primary/20 group-hover:text-primary group-hover:rotate-12'}`}>
                                {file ? <FileText className="w-12 h-12" /> : <Upload className="w-12 h-12" />}
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter">
                                    {file ? file.name : "Drop Resume to Scan"}
                                </h3>
                                <p className="text-foreground/30 text-sm font-bold tracking-widest uppercase">
                                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • READY` : "PDF format only • Max 10MB"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="group relative w-full h-20 bg-secondary text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-secondary/20 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-4 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        {loading ? (
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                <span className="uppercase tracking-widest">Parsing Intelligence...</span>
                            </div>
                        ) : (
                            <>
                                <span className="uppercase tracking-widest">Launch Comprehensive Scan</span>
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-16 grid sm:grid-cols-3 gap-6">
                {[
                    { icon: <CheckCircle2 className="w-5 h-5 text-secondary" />, title: "PARSE ENGINE", desc: "Verifies headers & sections" },
                    { icon: <CheckCircle2 className="w-5 h-5 text-secondary" />, title: "KEYWORD DENSITY", desc: "Essential skills check" },
                    { icon: <CheckCircle2 className="w-5 h-5 text-secondary" />, title: "CV ARCHITECTURE", desc: "Layout & format audit" }
                ].map((item, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex gap-4 p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-colors"
                    >
                        <div className="mt-1">{item.icon}</div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-widest mb-1 text-foreground/80">{item.title}</h4>
                            <p className="text-[10px] text-foreground/40 font-bold uppercase">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AtsChecker;
