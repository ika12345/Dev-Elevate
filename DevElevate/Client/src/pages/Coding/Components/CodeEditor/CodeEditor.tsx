import React, { useState, useCallback } from 'react';
import { Play, Save, Lightbulb, Zap, Settings } from 'lucide-react';
import { languages } from '../../Data/languages';
import type { Language } from '../../Types';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeEditorProps {
  initialCode?: string;
  language: string;
  onLanguageChange: (language: string) => void;
  onCodeChange: (code: string) => void;
  onRun: (code: string, language: string) => void;
  onSubmit: (code: string, language: string) => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language,
  onLanguageChange,
  onCodeChange,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false
}) => {
  const [code, setCode] = useState(initialCode);
  const [theme, setTheme] = useState<'vs-dark' | 'monokai'>('vs-dark');
  const [showSettings, setShowSettings] = useState(false);

  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange(newCode);
  }, [onCodeChange]);

  const currentLanguage = languages.find(lang => lang.id === language);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 1.5,
    fontFamily: 'JetBrains Mono, Monaco, Cascadia Code, Roboto Mono, monospace',
    scrollBeyondLastLine: false,
    renderLineHighlight: 'line' as const,
    selectOnLineNumbers: true,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on' as const,
    bracketPairColorization: { enabled: true }
  };

  return (
    <div className="flex overflow-hidden flex-col h-full bg-gray-800 rounded-lg border border-gray-700">
      {/* Editor Header */}
      <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-3 py-2 text-white bg-gray-800 rounded-lg border border-gray-600 transition-colors focus:border-electric-400 focus:outline-none"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name} ({lang.version})
              </option>
            ))}
          </select>
          
          <div className="text-sm text-gray-400">
            {currentLanguage?.name} • {code.split('\n').length} lines
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center px-3 py-2 space-x-1 text-gray-300 bg-gray-800 rounded-lg transition-colors hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-2 space-x-1 text-white bg-yellow-600 rounded-lg transition-colors hover:bg-yellow-700"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Hint</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRun(code, language)}
            disabled={isRunning}
            className="flex items-center px-3 py-2 space-x-1 text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSubmit(code, language)}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 space-x-1 text-white bg-gradient-to-r rounded-lg transition-all duration-200 from-electric-400 to-neon-500 hover:from-electric-500 hover:to-neon-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </motion.button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 bg-gray-900 border-b border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-300">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'vs-dark' | 'monokai')}
                className="px-3 py-1 text-white bg-gray-800 rounded border border-gray-600 focus:border-electric-400 focus:outline-none"
              >
                <option value="vs-dark">Dark</option>
                <option value="monokai">Monokai</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="p-4 w-full h-full font-mono text-sm text-white bg-gray-800 border-none outline-none resize-none"
          placeholder="// Start coding here..."
          style={{ 
            fontFamily: 'JetBrains Mono, Monaco, Cascadia Code, Roboto Mono, monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            tabSize: 2
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;