import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, ChevronRight, Zap, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true
});

const FullAnalyzer = () => {
    const [file, setFile] = useState<File | null>(null);
    const [jd, setJd] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!file || !jd) {
            alert("Please provide both a resume and a job description.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jd', jd);

        try {
            const response = await api.post('/api/analyze/full', formData);
            sessionStorage.setItem('analysisResult', JSON.stringify(response.data));
            navigate('/dashboard');
        } catch (error: any) {
            console.error("Analysis failed:", error);
            const message = error.response?.data?.error || error.message || "Unknown error";
            alert(`Analysis failed: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {/* Resume Upload Box */}
                <div className="glass-morphism p-8 rounded-[2.5rem] space-y-6 relative group overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="font-black font-outfit uppercase tracking-widest text-sm">Upload Resume</h3>
                    </div>

                    <div className={`relative border-2 border-dashed rounded-3xl p-10 h-64 flex flex-col items-center justify-center gap-4 transition-all ${
                        file ? 'border-secondary bg-secondary/5' : 'border-white/5 hover:border-white/10'
                    }`}>
                        <input 
                            type="file" 
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className={`p-5 rounded-2xl ${file ? 'bg-secondary text-white' : 'bg-white/5 text-foreground/20'}`}>
                            <Upload className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm tracking-tight">{file ? file.name : "Drag your resume here"}</p>
                            {!file && <p className="text-[10px] text-foreground/30 font-bold uppercase mt-1">PDF Mode only</p>}
                        </div>
                    </div>
                </div>

                {/* JD Input Box */}
                <div className="glass-morphism p-8 rounded-[2.5rem] space-y-6 relative group overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            <Target className="w-5 h-5" />
                        </div>
                        <h3 className="font-black font-outfit uppercase tracking-widest text-sm">Job Description</h3>
                    </div>

                    <div className="relative h-64">
                        <textarea 
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                            placeholder="Paste the full job listing here... (The more detail, the better the AI match)"
                            className="w-full h-full bg-white/[0.02] border-2 border-white/5 focus:border-orange-400/30 rounded-3xl p-6 text-sm outline-none transition-all resize-none placeholder:text-foreground/20 font-medium leading-relaxed"
                        />
                        <div className="absolute right-4 bottom-4 px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black italic opacity-20 pointer-events-none">
                            {jd.length} CHARS
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-4 text-foreground/30">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-slate-800 flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-secondary" />
                            </div>
                        ))}
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Join <span className="text-white">Professional</span> AI Matcher</p>
                </div>

                <button 
                    onClick={handleAnalyze}
                    disabled={!file || !jd || loading}
                    className="w-full sm:w-auto px-12 py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-4 group"
                >
                    {loading ? (
                        <div className="flex items-center gap-4">
                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            <span className="uppercase tracking-widest">Running Match Engine</span>
                        </div>
                    ) : (
                        <>
                            <span className="uppercase tracking-widest">Start Full Analysis</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FullAnalyzer;
