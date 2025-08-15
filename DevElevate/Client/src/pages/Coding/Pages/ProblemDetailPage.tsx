import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import CodeEditor from '../Components/CodeEditor/CodeEditor';
import ProblemDescription from '../Components/ProblemDetail/ProblemDescription';
import { problems } from '../data/problems';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Play, Zap, CheckCircle, XCircle, Clock } from 'lucide-react';

const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const problem = problems.find(p => p.id === id);

  useEffect(() => {
    if (problem && problem.starterCode[selectedLanguage]) {
      setCode(problem.starterCode[selectedLanguage]);
    }
  }, [problem, selectedLanguage]);

  if (!problem) {
    return <Navigate to="/coding/problems" replace />;
  }

  const handleRun = async (code: string, language: string) => {
    setIsRunning(true);
    toast.loading('Running code...', { id: 'run-code' });
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test results
      const mockResults = problem.testCases.filter(tc => !tc.hidden).map(tc => ({
        ...tc,
        passed: Math.random() > 0.3,
        runtime: Math.floor(Math.random() * 100) + 50,
        memory: Math.floor(Math.random() * 20) + 10
      }));
      
      setTestResults(mockResults);
      setShowResults(true);
      
      const passedCount = mockResults.filter(r => r.passed).length;
      if (passedCount === mockResults.length) {
        toast.success(`All ${passedCount} test cases passed!`, { id: 'run-code' });
      } else {
        toast.error(`${passedCount}/${mockResults.length} test cases passed`, { id: 'run-code' });
      }
    } catch (error) {
      toast.error('Execution failed', { id: 'run-code' });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async (code: string, language: string) => {
    setIsSubmitting(true);
    toast.loading('Submitting solution...', { id: 'submit-code' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock submission result
      const isAccepted = Math.random() > 0.4;
      
      if (isAccepted) {
        toast.success('Accepted! Solution submitted successfully.', { id: 'submit-code' });
      } else {
        toast.error('Wrong Answer. Please try again.', { id: 'submit-code' });
      }
    } catch (error) {
      toast.error('Submission failed', { id: 'submit-code' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 min-h-0">
        <div className="flex h-full">
          {/* Problem Description Panel */}
          <div className="overflow-y-auto p-4 w-1/2">
            <ProblemDescription problem={problem} />
          </div>
          
          {/* Code Editor Panel */}
          <div className="flex flex-col p-4 w-1/2">
            <div className="flex-1 mb-4">
              <CodeEditor
                initialCode={problem.starterCode[selectedLanguage] || ''}
                language={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                onCodeChange={setCode}
                onRun={handleRun}
                onSubmit={handleSubmit}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
              />
            </div>
            
            {/* Test Results */}
            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-y-auto p-4 max-h-64 bg-gray-800 rounded-lg border border-gray-700"
              >
                <h3 className="mb-3 text-lg font-semibold text-white">Test Results</h3>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'bg-green-900/20 border-green-700'
                          : 'bg-red-900/20 border-red-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                            Test Case {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{result.runtime}ms</span>
                          </div>
                          <span>{result.memory}MB</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-400">Input: </span>
                          <span className="font-mono text-yellow-400">{result.input}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Expected: </span>
                          <span className="font-mono text-blue-400">{result.expectedOutput}</span>
                        </div>
                        {!result.passed && (
                          <div>
                            <span className="text-gray-400">Output: </span>
                            <span className="font-mono text-red-400">Wrong Answer</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;