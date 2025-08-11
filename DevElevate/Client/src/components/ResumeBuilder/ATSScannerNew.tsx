import React, { useState, useRef, useEffect } from 'react';
import { 
  ScanLine, CheckCircle2, AlertCircle, Loader2, Download, FileText, 
  TrendingUp, BarChart, Target, BadgeCheck, ArrowUpRight, Lightbulb, 
  CheckCircle, XCircle, Key, Gauge, ChevronDown, Zap, Award, Share2,
  Clock, History, Save, RefreshCw, ArrowRight, PenLine, BarChart3 
} from 'lucide-react';
import axios from '../../api/axiosinstance';
import resumeTemplates from '../../utils/resumeTemplates';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ATS scan result type
interface ATSResult {
  score: number;
  totalKeywords: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  passedSections: string[];
  suggestions: string[];
  jobTitle?: string;
  sections?: string[];
}

const ATSScanner: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [scanResult, setScanResult] = useState<ATSResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [historyScans, setHistoryScans] = useState<{text: string, result: ATSResult}[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleScan = async () => {
    if (!resumeText.trim()) {
      setError('Please enter or paste your resume text');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // If job title is provided, include it in the request
      const payload = { 
        resumeText,
        ...(jobTitle ? { targetJobTitle: jobTitle } : {})
      };
      
      const response = await axios.post('/api/v1/ats/scan', payload);
      const result = response.data as ATSResult;
      
      setScanResult(result);
      
      // Add to history
      setHistoryScans(prev => {
        const newHistory = [...prev, { text: resumeText, result }];
        // Keep only last 5 scans
        if (newHistory.length > 5) {
          return newHistory.slice(newHistory.length - 5);
        }
        return newHistory;
      });
      
    } catch (err) {
      console.error('Error scanning resume:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectTemplate = (templateKey: string) => {
    const template = resumeTemplates[templateKey as keyof typeof resumeTemplates];
    setResumeText(template.content);
  };
  
  const handleExportPDF = async () => {
    if (!resultRef.current || !scanResult) return;
    
    try {
      const canvas = await html2canvas(resultRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ATS_Scan_Result_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Failed to export as PDF:', err);
      setError('Failed to export results as PDF.');
    }
  };
  
  const compareWithHistory = () => {
    if (historyScans.length < 2) {
      return null;
    }
    
    const current = historyScans[historyScans.length - 1].result;
    const previous = historyScans[historyScans.length - 2].result;
    
    const scoreDifference = current.score - previous.score;
    const newKeywords = current.matchedKeywords.filter(
      kw => !previous.matchedKeywords.includes(kw)
    );
    
    return {
      scoreDifference,
      newKeywords,
      isImproved: scoreDifference > 0
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getSummaryBasedOnScore = (score: number) => {
    if (score >= 70) {
      return 'Excellent! Your resume is well-optimized for ATS systems and has a high chance of passing automated screenings.';
    } else if (score >= 50) {
      return 'Your resume needs some improvements to better appeal to ATS systems and increase your chances of getting interviews.';
    } else {
      return 'Your resume needs significant optimization to effectively pass through ATS systems.';
    }
  };

  // New animations for score visualization
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Animate the score when results are available
  useEffect(() => {
    if (scanResult) {
      let start = 0;
      const end = scanResult.score;
      const duration = 1500; // Animation duration in ms
      const startTime = Date.now();
      
      const animateScore = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          // Easing function for smooth animation
          const easedProgress = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          
          setAnimatedScore(Math.round(easedProgress * end));
          requestAnimationFrame(animateScore);
        } else {
          setAnimatedScore(end);
        }
      };
      
      requestAnimationFrame(animateScore);
    }
  }, [scanResult]);
  
  return (
    <div className="relative p-8 rounded-2xl border border-gray-800 bg-gradient-to-b from-slate-900 via-gray-900 to-black shadow-2xl overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[10%] w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-[40%] w-48 h-48 bg-cyan-600/10 rounded-full filter blur-3xl animate-pulse-slow" style={{animationDelay: '0.7s'}}></div>
        
        {/* Animated lines for futuristic feel */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          <div className="absolute top-[60%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgNjAiIHN0cm9rZT0iIzJhMzQ0MSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNIDYwIDAgTCAwIDAiIHN0cm9rZT0iIzJhMzQ0MSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNIDYwIDYwIEwgNjAgMCIgc3Ryb2tlPSIjMmEzNDQxIiBzdHJva2Utd2lkdGg9IjAuNSIvPjxwYXRoIGQ9Ik0gMCAwIEwgMCA2MCIgc3Ryb2tlPSIjMmEzNDQxIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-10"></div>
      </div>
      
      <div className="relative z-10">
        {/* Enhanced header with cleaner layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1.5 rounded-lg shadow-lg">
                <ScanLine className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                AI-Powered Resume Analysis
              </div>
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
              ATS Resume Scanner
            </h2>
            
            <p className="mt-2 text-gray-300 max-w-2xl leading-relaxed">
              Optimize your resume to pass Applicant Tracking Systems and increase your chances of landing interviews.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {scanResult && (
              <Button 
                onClick={handleExportPDF}
                variant="gradient"
                size="sm"
                className="flex items-center gap-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="glowing"
                  size="sm"
                  className="flex items-center gap-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <FileText className="w-4 h-4" />
                  ATS Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="border border-gray-800 bg-gradient-to-b from-gray-900 to-black shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                    ATS-Optimized Resume Templates
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Select a template to start with a pre-formatted ATS-friendly resume
                  </DialogDescription>
                </DialogHeader>
                <div className="grid max-h-[60vh] overflow-y-auto py-4">
                  <Tabs defaultValue="softwareEngineer">
                    <TabsList className="w-full mb-4 bg-gray-900/70 p-1 gap-1">
                      <TabsTrigger value="softwareEngineer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-blue-600/80">
                        Software Engineer
                      </TabsTrigger>
                      <TabsTrigger value="dataScientist" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-blue-600/80">
                        Data Scientist
                      </TabsTrigger>
                      <TabsTrigger value="productManager" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-blue-600/80">
                        Product Manager
                      </TabsTrigger>
                    </TabsList>
                    {Object.entries(resumeTemplates).map(([key, template]) => (
                      <TabsContent key={key} value={key} className="space-y-4">
                        <div className="rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm p-5 hover:border-gray-700 transition-all hover:shadow-md">
                          <h4 className="font-medium text-white mb-2">{template.title}</h4>
                          <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                            {template.content.substring(0, 150)}...
                          </p>
                          <Button 
                            variant="gradient" 
                            size="sm" 
                            onClick={() => handleSelectTemplate(key)}
                            className="w-full sm:w-auto"
                          >
                            Use this template
                          </Button>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>
        </div>
      </div>
      
      {/* Enhanced input section with cards */}
      <div className="relative z-10 grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-b from-gray-900/70 to-gray-900/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-blue-800/50 transition-all hover:shadow-lg group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-900/30 p-2 rounded-lg group-hover:bg-blue-900/50 transition-colors">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <label className="font-medium text-white">Target Job Title</label>
          </div>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Frontend Developer, Data Scientist..."
            className="w-full p-4 border border-gray-800 rounded-lg bg-black/40 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />
          <div className="mt-4 text-sm text-blue-300/80 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4" />
            <span>Adding a specific job title increases accuracy by 30%</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-b from-gray-900/70 to-gray-900/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-cyan-800/50 transition-all hover:shadow-lg group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-900/30 p-2 rounded-lg group-hover:bg-cyan-900/50 transition-colors">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <label className="font-medium text-white">Resume Content</label>
            </div>
            {historyScans.length > 0 && (
              <div className="flex items-center gap-1.5 bg-blue-900/30 px-2.5 py-1.5 rounded-lg text-blue-300">
                <History className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  {historyScans.length} {historyScans.length === 1 ? 'scan' : 'scans'} history
                </span>
              </div>
            )}
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your full resume content here..."
            className="w-full p-4 border border-gray-800 rounded-lg bg-black/40 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none font-mono text-sm"
            rows={10}
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>

      {/* Improved alerts and notifications */}
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-900/10 border-l-4 border-red-600 text-red-300 rounded-lg flex items-center gap-2.5 animate-fade-in">
          <div className="bg-red-900/30 p-1.5 rounded-full">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <span>{error}</span>
        </div>
      )}

      {historyScans.length > 1 && compareWithHistory()?.scoreDifference && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-blue-900/10 border-l-4 border-blue-600 text-blue-300 rounded-lg flex items-center gap-2.5 animate-fade-in">
          <div className="bg-blue-900/30 p-1.5 rounded-full">
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <span className="font-medium">Score improved by {compareWithHistory()?.scoreDifference.toFixed(1)}%</span>
            <p className="text-sm text-blue-300/70 mt-1">
              {compareWithHistory()?.newKeywords.length 
                ? `Added ${compareWithHistory()?.newKeywords.length} new keywords` 
                : 'Better formatting and structure detected'}
            </p>
          </div>
        </div>
      )}

      {/* Improved scan button */}
      <div className="text-center my-8 relative">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent -translate-y-1/2"></div>
        <Button 
          onClick={handleScan} 
          variant="gradient"
          size="lg"
          className="font-semibold px-8 py-6 rounded-xl relative"
          disabled={isLoading || !resumeText.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
              <span className="text-base">Analyzing Resume...</span>
            </>
          ) : (
            <>
              <ScanLine className="w-5 h-5 mr-2" /> 
              <span className="text-base">Scan Resume for ATS</span>
            </>
          )}
        </Button>
      </div>      {scanResult && (
        <div className="mt-10" id="scan-results" ref={resultRef}>
          {/* Enhanced results header with animation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1.5 bg-gradient-to-b from-blue-400 via-purple-400 to-cyan-400 rounded-full"></div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent drop-shadow">
                ATS Scan Results
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportPDF}
                className="border-blue-700 hover:bg-blue-900/30 text-blue-400 flex items-center gap-1.5 rounded-lg"
              >
                <Share2 className="w-4 h-4" /> 
                Share
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportPDF}
                className="border-blue-700 hover:bg-blue-900/30 text-blue-400 flex items-center gap-1.5 rounded-lg"
              >
                <Download className="w-4 h-4" /> 
                Export PDF
              </Button>
            </div>
          </div>
          
          {/* Enhanced score summary with animated gauge */}
          <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black border border-gray-800 p-8 rounded-xl mb-10 backdrop-blur-sm overflow-hidden shadow-lg">
            {/* Enhanced decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              {/* Score gauge and metrics in a more attractive layout */}
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Left column: Score gauge */}
                <div className="flex flex-col items-center justify-center md:col-span-1 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="relative w-48 h-48">
                    {/* Circular background */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#1e293b" 
                        strokeWidth="10" 
                      />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke={
                          scanResult.score >= 70 ? '#22c55e' :
                          scanResult.score >= 50 ? '#f59e0b' : '#ef4444'
                        }
                        strokeWidth="10" 
                        strokeLinecap="round"
                        strokeDasharray={`${scanResult.score * 2.83} 283`}
                        strokeDashoffset="70.75"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    
                    {/* Center score display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold ${getScoreColor(scanResult.score)}`}>
                        {animatedScore}%
                      </span>
                      <span className="text-gray-400 text-sm mt-1">ATS Score</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      scanResult.score >= 70 ? 'bg-green-400' : 
                      scanResult.score >= 50 ? 'bg-amber-400' : 'bg-red-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      scanResult.score >= 70 ? 'text-green-400' : 
                      scanResult.score >= 50 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {scanResult.score >= 70 
                        ? 'High Compatibility' 
                        : scanResult.score >= 50 
                        ? 'Medium Compatibility' 
                        : 'Low Compatibility'
                      }
                    </span>
                  </div>
                </div>

                {/* Right column: Summary and details */}
                <div className="md:col-span-2">
                  {/* Summary box */}
                  <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-6 mb-6">
                    <h4 className="font-medium text-blue-300 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Summary
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {getSummaryBasedOnScore(scanResult.score)}
                    </p>
                  </div>
                  
                  {/* Key metrics grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                      <h4 className="font-semibold mb-4 text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        Resume Sections
                      </h4>
                      <div className="space-y-2.5">
                        {scanResult.passedSections.map((section, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-800/50 hover:bg-gray-800/80 transition-colors">
                            <span className="text-gray-300">{section}</span>
                            <Badge variant="success" className="text-xs font-medium">Found</Badge>
                          </div>
                        ))}
                        
                        {/* Show missing important sections */}
                        {['Experience', 'Education', 'Skills'].filter(
                          section => !scanResult.passedSections.includes(section)
                        ).map((section, index) => (
                          <div key={`missing-${index}`} className="flex items-center justify-between p-2 rounded-md bg-gray-800/50 hover:bg-gray-800/80 transition-colors">
                            <span className="text-gray-300">{section}</span>
                            <Badge variant="destructive" className="text-xs font-medium">Missing</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                      <h4 className="font-semibold mb-4 text-white flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-cyan-400" />
                        Key Metrics
                      </h4>
                      <div className="space-y-2.5">
                        <div className="flex flex-col rounded-md bg-gray-800/50 hover:bg-gray-800/80 transition-colors p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Keyword Match</span>
                            <span className="font-medium text-blue-400">
                              {Math.round((scanResult.matchedKeywords.length / scanResult.totalKeywords) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.round((scanResult.matchedKeywords.length / scanResult.totalKeywords) * 100)}
                            className="h-1.5"
                            indicatorClassName="bg-blue-500"
                          />
                        </div>
                        
                        <div className="flex flex-col rounded-md bg-gray-800/50 hover:bg-gray-800/80 transition-colors p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Format Score</span>
                            <span className={
                              scanResult.score < 60 
                                ? 'font-medium text-red-400' 
                                : scanResult.score < 80 
                                ? 'font-medium text-amber-400' 
                                : 'font-medium text-green-400'
                            }>
                              {(scanResult.score * 0.9).toFixed(0)}%
                            </span>
                          </div>
                          <Progress 
                            value={parseFloat((scanResult.score * 0.9).toFixed(0))}
                            className="h-1.5"
                            indicatorClassName={
                              scanResult.score < 60 
                                ? 'bg-red-500' 
                                : scanResult.score < 80 
                                ? 'bg-amber-500' 
                                : 'bg-green-500'
                            }
                          />
                        </div>
                        
                        <div className="flex flex-col rounded-md bg-gray-800/50 hover:bg-gray-800/80 transition-colors p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Content Clarity</span>
                            <span className={
                              scanResult.score < 60 
                                ? 'font-medium text-red-400' 
                                : scanResult.score < 80 
                                ? 'font-medium text-amber-400' 
                                : 'font-medium text-green-400'
                            }>
                              {(scanResult.score * 0.8).toFixed(0)}%
                            </span>
                          </div>
                          <Progress 
                            value={parseFloat((scanResult.score * 0.8).toFixed(0))}
                            className="h-1.5"
                            indicatorClassName={
                              scanResult.score < 60 
                                ? 'bg-red-500' 
                                : scanResult.score < 80 
                                ? 'bg-amber-500' 
                                : 'bg-green-500'
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced tabs for detailed results */}
          <div className="relative">
            <Tabs defaultValue="keywords" className="w-full">
              <TabsList className="w-full justify-start bg-gray-900/70 border border-gray-800 mb-6 p-1 gap-1 rounded-lg">
                <TabsTrigger 
                  value="keywords" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700/60 data-[state=active]:to-blue-500/60 data-[state=active]:text-white rounded-md"
                >
                  <Key className="w-4 h-4 mr-2" /> Keywords
                </TabsTrigger>
                <TabsTrigger 
                  value="format" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700/60 data-[state=active]:to-blue-500/60 data-[state=active]:text-white rounded-md"
                >
                  <FileText className="w-4 h-4 mr-2" /> Format Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="tips" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700/60 data-[state=active]:to-blue-500/60 data-[state=active]:text-white rounded-md"
                >
                  <Lightbulb className="w-4 h-4 mr-2" /> Improvement Tips
                </TabsTrigger>
              </TabsList>

              {/* Enhanced Keywords Tab */}
              <TabsContent value="keywords">
                <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-800 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800">
                      <h4 className="font-semibold mb-4 text-white flex items-center gap-2.5">
                        <div className="bg-green-900/30 p-1.5 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        Keywords Found ({scanResult.matchedKeywords.length})
                      </h4>
                      {scanResult.matchedKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {scanResult.matchedKeywords.map((keyword, i) => (
                            <span key={i} className="px-3 py-1.5 bg-green-900/30 border border-green-800/50 text-green-300 rounded-full text-sm font-medium hover:bg-green-900/40 transition-colors cursor-default">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                          <p className="text-red-300">
                            No relevant keywords found in your resume!
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800">
                      <h4 className="font-semibold mb-4 text-white flex items-center gap-2.5">
                        <div className="bg-red-900/30 p-1.5 rounded-full">
                          <XCircle className="w-4 h-4 text-red-400" />
                        </div>
                        Missing Keywords ({scanResult.missingKeywords.length})
                      </h4>
                      {scanResult.missingKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {scanResult.missingKeywords.map((keyword, i) => (
                            <span key={i} className="px-3 py-1.5 bg-red-900/30 border border-red-800/50 text-red-300 rounded-full text-sm font-medium hover:bg-red-900/40 transition-colors cursor-default">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <p className="text-green-300">
                            Great job! No missing keywords detected.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/40 rounded-lg">
                    <h5 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-300" />
                      Keyword Optimization Tip
                    </h5>
                    <p className="text-gray-300 text-sm">
                      Including relevant keywords in your resume increases ATS match by up to 60%. Focus on incorporating 
                      missing keywords naturally in your experience descriptions and skills sections.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Enhanced Format Analysis Tab */}
              <TabsContent value="format">
                <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-800 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h4 className="font-semibold text-white flex items-center gap-2.5">
                      <div className="bg-blue-900/30 p-1.5 rounded-full">
                        <Gauge className="w-4 h-4 text-blue-400" />
                      </div>
                      Format Analysis
                    </h4>
                    <span className={`
                      text-lg font-bold px-3 py-1 rounded-full 
                      ${scanResult.score < 60 
                          ? 'text-red-300 bg-red-900/20 border border-red-800/40' 
                          : scanResult.score < 80 
                          ? 'text-amber-300 bg-amber-900/20 border border-amber-800/40' 
                          : 'text-green-300 bg-green-900/20 border border-green-800/40'
                      }
                    `}>
                      {(scanResult.score * 0.9).toFixed(1)}% Format Score
                    </span>
                  </div>
                  
                  <div className="grid gap-3">
                    {/* Format analysis cards with improved styling */}
                    <div className={`flex items-start p-4 rounded-lg ${
                      scanResult.passedSections.includes('Contact Information')
                        ? 'bg-green-900/10 border border-green-800/30'
                        : 'bg-amber-900/10 border border-amber-800/30'
                    }`}>
                      <div className={`p-2 rounded-full mr-4 flex-shrink-0 ${
                        scanResult.passedSections.includes('Contact Information')
                          ? 'bg-green-900/30'
                          : 'bg-amber-900/30'
                      }`}>
                        {scanResult.passedSections.includes('Contact Information') ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h5 className={`font-medium mb-1 ${
                          scanResult.passedSections.includes('Contact Information')
                            ? 'text-green-300'
                            : 'text-amber-300'
                        }`}>Contact Information</h5>
                        <span className="text-gray-300">
                          {scanResult.passedSections.includes('Contact Information')
                            ? 'Contact information is clearly provided and properly formatted'
                            : 'Contact information may be missing or not clearly formatted'
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className={`flex items-start p-4 rounded-lg ${
                      scanResult.passedSections.includes('Experience')
                        ? 'bg-green-900/10 border border-green-800/30'
                        : 'bg-amber-900/10 border border-amber-800/30'
                    }`}>
                      <div className={`p-2 rounded-full mr-4 flex-shrink-0 ${
                        scanResult.passedSections.includes('Experience')
                          ? 'bg-green-900/30'
                          : 'bg-amber-900/30'
                      }`}>
                        {scanResult.passedSections.includes('Experience') ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h5 className={`font-medium mb-1 ${
                          scanResult.passedSections.includes('Experience')
                            ? 'text-green-300'
                            : 'text-amber-300'
                        }`}>Work Experience</h5>
                        <span className="text-gray-300">
                          {scanResult.passedSections.includes('Experience')
                            ? 'Work experience section is well-structured with clear role descriptions'
                            : 'Work experience section may be missing or poorly structured'
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className={`flex items-start p-4 rounded-lg ${
                      scanResult.score > 60
                        ? 'bg-green-900/10 border border-green-800/30'
                        : 'bg-amber-900/10 border border-amber-800/30'
                    }`}>
                      <div className={`p-2 rounded-full mr-4 flex-shrink-0 ${
                        scanResult.score > 60
                          ? 'bg-green-900/30'
                          : 'bg-amber-900/30'
                      }`}>
                        {scanResult.score > 60 ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h5 className={`font-medium mb-1 ${
                          scanResult.score > 60
                            ? 'text-green-300'
                            : 'text-amber-300'
                        }`}>Resume Format</h5>
                        <span className="text-gray-300">
                          {scanResult.score > 60
                            ? 'Resume uses a clean, ATS-friendly format without complex tables or graphics'
                            : 'Resume may contain elements that are difficult for ATS systems to parse'
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className={`flex items-start p-4 rounded-lg ${
                      scanResult.matchedKeywords.length > scanResult.totalKeywords * 0.6
                        ? 'bg-green-900/10 border border-green-800/30'
                        : 'bg-amber-900/10 border border-amber-800/30'
                    }`}>
                      <div className={`p-2 rounded-full mr-4 flex-shrink-0 ${
                        scanResult.matchedKeywords.length > scanResult.totalKeywords * 0.6
                          ? 'bg-green-900/30'
                          : 'bg-amber-900/30'
                      }`}>
                        {scanResult.matchedKeywords.length > scanResult.totalKeywords * 0.6 ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h5 className={`font-medium mb-1 ${
                          scanResult.matchedKeywords.length > scanResult.totalKeywords * 0.6
                            ? 'text-green-300'
                            : 'text-amber-300'
                        }`}>Keyword Optimization</h5>
                        <span className="text-gray-300">
                          {scanResult.matchedKeywords.length > scanResult.totalKeywords * 0.6
                            ? 'Good keyword optimization for the target role'
                            : 'Resume could use more relevant keywords for the target role'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Enhanced Improvement Tips Tab */}
              <TabsContent value="tips">
                <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-800 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                  <h4 className="font-semibold mb-5 text-white flex items-center gap-2.5">
                    <div className="bg-yellow-900/30 p-1.5 rounded-full">
                      <Zap className="w-4 h-4 text-yellow-400" />
                    </div>
                    Recommendations to Improve Your Resume
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {scanResult.suggestions.map((tip, i) => (
                      <div key={i} className="flex items-start p-4 bg-blue-900/20 border border-blue-800/40 rounded-lg hover:bg-blue-900/30 transition-colors">
                        <div className="bg-blue-900/40 p-1.5 rounded-full mr-3 flex-shrink-0">
                          <Lightbulb className="w-4 h-4 text-blue-300" />
                        </div>
                        <span className="text-gray-300">
                          {tip}
                        </span>
                      </div>
                    ))}
                    
                    {/* Add default suggestions if none provided */}
                    {scanResult.suggestions.length === 0 && (
                      <>
                        <div className="flex items-start p-4 bg-blue-900/20 border border-blue-800/40 rounded-lg hover:bg-blue-900/30 transition-colors">
                          <div className="bg-blue-900/40 p-1.5 rounded-full mr-3 flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-blue-300" />
                          </div>
                          <span className="text-gray-300">
                            Include more industry-specific keywords that match the job description
                          </span>
                        </div>
                        <div className="flex items-start p-4 bg-blue-900/20 border border-blue-800/40 rounded-lg hover:bg-blue-900/30 transition-colors">
                          <div className="bg-blue-900/40 p-1.5 rounded-full mr-3 flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-blue-300" />
                          </div>
                          <span className="text-gray-300">
                            Use standard section headings that ATS systems can easily recognize
                          </span>
                        </div>
                        <div className="flex items-start p-4 bg-blue-900/20 border border-blue-800/40 rounded-lg hover:bg-blue-900/30 transition-colors">
                          <div className="bg-blue-900/40 p-1.5 rounded-full mr-3 flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-blue-300" />
                          </div>
                          <span className="text-gray-300">
                            Quantify your achievements with specific metrics and results
                          </span>
                        </div>
                        <div className="flex items-start p-4 bg-blue-900/20 border border-blue-800/40 rounded-lg hover:bg-blue-900/30 transition-colors">
                          <div className="bg-blue-900/40 p-1.5 rounded-full mr-3 flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-blue-300" />
                          </div>
                          <span className="text-gray-300">
                            Use a clean, simple format that avoids complex tables, graphics, or unusual fonts
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Enhanced Action section */}
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-800/40 rounded-xl backdrop-blur-sm shadow-lg">
            <h4 className="font-semibold mb-5 text-blue-300 flex items-center gap-2.5">
              <div className="bg-blue-900/40 p-1.5 rounded-full">
                <BadgeCheck className="w-5 h-5 text-blue-300" />
              </div>
              Next Steps to Improve Your ATS Score
            </h4>
            
            <ul className="space-y-4">
              {scanResult.score < 70 && (
                <>
                  <li className="flex items-start gap-3 group">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md group-hover:from-blue-500 group-hover:to-purple-500 transition-all">1</div>
                    <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/30 flex-grow group-hover:bg-blue-900/30 transition-all">
                      <span className="text-gray-300">
                        Include more of the missing keywords in your resume, especially those relevant to your experience
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md group-hover:from-blue-500 group-hover:to-purple-500 transition-all">2</div>
                    <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/30 flex-grow group-hover:bg-blue-900/30 transition-all">
                      <span className="text-gray-300">
                        Add quantifiable achievements with metrics (e.g., "Improved performance by 30%")
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md group-hover:from-blue-500 group-hover:to-purple-500 transition-all">3</div>
                    <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/30 flex-grow group-hover:bg-blue-900/30 transition-all">
                      <span className="text-gray-300">
                        Use standard section headings: "Experience," "Education," "Skills," etc.
                      </span>
                    </div>
                  </li>
                </>
              )}
              <li className="flex items-start gap-3 group">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md group-hover:from-blue-500 group-hover:to-purple-500 transition-all">{scanResult.score < 70 ? '4' : '1'}</div>
                <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/30 flex-grow group-hover:bg-blue-900/30 transition-all">
                  <span className="text-gray-300">
                    Export this report to PDF using the button above to save your analysis
                  </span>
                </div>
              </li>
            </ul>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleExportPDF}
                variant="gradient"
                className="flex items-center gap-2"
              >
                <PenLine className="w-4 h-4" />
                Edit Resume with Suggestions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScanner;
