import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  Calendar, 
  ChevronRight, 
  Trophy, 
  User, 
  Briefcase,
  Search,
  FilterX,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HistoryRecord {
  id: number;
  candidateName: string;
  jobTitle: string;
  overallScore: number;
  analysisResultJson: string;
  createdAt: string;
}

const HistoryPage = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) {
                navigate('/login');
            }
            return;
        }

        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/analyze/history', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setHistory(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, navigate]);

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this scan permanently?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/analyze/history/${id}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setHistory(prev => prev.filter(h => h.id !== id));
        } catch (err) {
            console.error("Failed to delete record:", err);
            alert("Error deleting record. Please check backend connection.");
        }
    };

    const filteredHistory = history.filter(h => {
        const name = (h.candidateName || "").toLowerCase();
        const job = (h.jobTitle || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        return name.includes(search) || job.includes(search);
    });

    const handleViewReport = (record: HistoryRecord) => {
        try {
            const data = JSON.parse(record.analysisResultJson);
            // Pass the entire report object directly
            navigate('/dashboard', { state: { analysis: data } });
        } catch (e) {
            console.error("Failed to parse historical data", e);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400 font-medium">Loading your reports...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-3">
                        <History className="text-indigo-500 w-10 h-10" />
                        Analysis History
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Permanently store and manage your career progress</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search records..." 
                        className="bg-slate-900 border border-slate-800 text-white pl-12 pr-6 py-3 rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-lg shadow-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Section */}
            {filteredHistory.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-16 text-center flex flex-col items-center">
                    <FilterX className="w-20 h-20 text-slate-700 mb-6" />
                    <h3 className="text-2xl font-bold text-white">No history found</h3>
                    <p className="text-gray-500 mt-3 max-w-sm text-lg">
                        {searchTerm ? "No records match your search." : "Your history is empty. Start by scanning a resume!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredHistory.map((record) => (
                        <div 
                            key={record.id}
                            className="group relative bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/50 hover:border-indigo-500/50 rounded-[2rem] p-8 transition-all duration-500 backdrop-blur-sm shadow-xl"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                {/* Left Side: Profile Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-500/20 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                            <Briefcase className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">
                                            {record.jobTitle || "Resume Scan"}
                                        </h3>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-6 text-base text-gray-400">
                                        <span className="flex items-center gap-2 font-medium">
                                            <User className="w-5 h-5 text-indigo-500/50" />
                                            {record.candidateName || "Candidate"}
                                        </span>
                                        <span className="flex items-center gap-2 border-l border-slate-800/50 pl-6 font-medium">
                                            <Calendar className="w-5 h-5 text-indigo-500/50" />
                                            {new Date(record.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Side: Scoring & Action */}
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50">
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Score</p>
                                            <p className="text-3xl font-black text-white">{record.overallScore}%</p>
                                        </div>
                                        <div className={`p-4 rounded-2xl ${
                                            record.overallScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                                            record.overallScore >= 60 ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-rose-500/20 text-rose-400'
                                        }`}>
                                            <Trophy className="w-8 h-8" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button 
                                            onClick={(e) => handleDelete(record.id, e)}
                                            className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all active:scale-95 group/trash shadow-lg hover:shadow-red-500/20"
                                            title="Delete Scan"
                                        >
                                            <Trash2 className="w-6 h-6 group-hover/trash:animate-pulse" />
                                        </button>

                                        <button 
                                            onClick={() => handleViewReport(record)}
                                            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
                                        >
                                            View
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
