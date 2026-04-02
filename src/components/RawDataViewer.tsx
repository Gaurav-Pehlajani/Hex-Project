import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, Copy, Check, Database, ChevronDown, Search } from 'lucide-react';

export interface RawApiData {
  virustotal?: any;
  shodan?: any;
  whois?: any;
  geolocation?: any;
}

interface RawDataViewerProps {
  isOpen: boolean;
  onClose: () => void;
  data: RawApiData;
  target: string;
}

// Syntax-highlighted JSON renderer
const JsonSyntax = ({ json, searchTerm }: { json: string; searchTerm: string }) => {
  const highlighted = useMemo(() => {
    // Colorize JSON tokens
    let result = json
      // Keys
      .replace(/"([^"]+)"(?=\s*:)/g, '<span class="json-key">"$1"</span>')
      // String values (after colon)
      .replace(/:\s*"([^"]*?)"/g, ': <span class="json-string">"$1"</span>')
      // Numbers
      .replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
      // Booleans
      .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>')
      // Null
      .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>');

    // Highlight search matches
    if (searchTerm) {
      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(
        new RegExp(`(${escaped})`, 'gi'),
        '<mark class="json-highlight">$1</mark>'
      );
    }

    return result;
  }, [json, searchTerm]);

  return (
    <pre
      className="text-xs sm:text-sm leading-relaxed font-mono whitespace-pre-wrap break-all"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
};

export default function RawDataViewer({ isOpen, onClose, data, target }: RawDataViewerProps) {
  // Build tabs dynamically based on what data was actually fetched
  const tabs = useMemo(() => {
    const t: { id: string; label: string; icon: string; data: any }[] = [];
    if (data.virustotal) t.push({ id: 'virustotal', label: 'VirusTotal', icon: '🛡️', data: data.virustotal });
    if (data.shodan) t.push({ id: 'shodan', label: 'Shodan', icon: '🔍', data: data.shodan });
    if (data.whois) t.push({ id: 'whois', label: 'WHOIS', icon: '📋', data: data.whois });
    if (data.geolocation) t.push({ id: 'geolocation', label: 'Geolocation', icon: '🌍', data: data.geolocation });
    return t;
  }, [data]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Reset active tab when tabs change
  React.useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  if (!isOpen) return null;

  const activeData = tabs.find(t => t.id === activeTab)?.data;
  const jsonString = activeData ? JSON.stringify(activeData, null, 2) : '{}';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lineCount = jsonString.split('\n').length;
  const sizeKB = (new Blob([jsonString]).size / 1024).toFixed(1);

  return ReactDOM.createPortal(
    <>
      {/* JSON syntax highlighting styles */}
      <style>{`
        .json-key { color: #67e8f9; }
        .json-string { color: #86efac; }
        .json-number { color: #fdba74; }
        .json-boolean { color: #c4b5fd; }
        .json-null { color: #f87171; font-style: italic; }
        .json-highlight { background: #facc15; color: #000; padding: 0 2px; border-radius: 2px; }
        
        .raw-data-scrollbar::-webkit-scrollbar { width: 6px; }
        .raw-data-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 3px; }
        .raw-data-scrollbar::-webkit-scrollbar-thumb { background: rgba(74, 222, 128, 0.3); border-radius: 3px; }
        .raw-data-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(74, 222, 128, 0.5); }
        
        @keyframes rawDataSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rawDataBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .raw-data-modal { animation: rawDataSlideIn 0.25s ease-out; }
        .raw-data-backdrop { animation: rawDataBackdrop 0.2s ease-out; }
      `}</style>

      {/* Backdrop */}
      <div
        className="raw-data-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Modal — fixed height container with flex column layout */}
        <div className="raw-data-modal w-full max-w-4xl flex flex-col rounded-xl overflow-hidden border border-green-500/30 shadow-2xl shadow-green-900/20"
          style={{
            background: 'linear-gradient(145deg, rgba(10, 10, 10, 0.98) 0%, rgba(5, 20, 10, 0.98) 100%)',
            maxHeight: '85vh',
          }}
        >
          {/* Header — always visible, never shrinks */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-green-500/20"
            style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(5,30,15,0.4) 100%)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <Database className="h-5 w-5 text-green-400" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-green-300 tracking-wide">
                  Raw API Data
                </h2>
                <p className="text-[10px] text-gray-500 font-mono truncate">
                  {target} • {tabs.length} source{tabs.length !== 1 ? 's' : ''} • {sizeKB} KB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border"
                style={{
                  background: copied ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.03)',
                  borderColor: copied ? 'rgba(34, 197, 94, 0.4)' : 'rgba(74, 222, 128, 0.15)',
                  color: copied ? '#86efac' : '#9ca3af',
                }}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-gray-700/50 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs — always visible, never shrinks */}
          <div className="flex-shrink-0 flex items-center gap-1 px-4 py-2 border-b border-green-500/10 overflow-x-auto"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                  activeTab === tab.id
                    ? 'bg-green-500/15 border-green-500/40 text-green-300 shadow-sm shadow-green-900/30'
                    : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search Bar — always visible, never shrinks */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b border-green-500/10"
            style={{ background: 'rgba(0,0,0,0.2)' }}
          >
            <Search className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in JSON..."
              className="flex-1 bg-transparent text-xs text-gray-300 placeholder-gray-600 outline-none font-mono"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
              <span>{lineCount} lines</span>
            </div>
          </div>

          {/* JSON Content — scrollable area that takes remaining space */}
          <div className="flex-1 min-h-0 overflow-y-auto raw-data-scrollbar p-4">
            {tabs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Database className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No raw data available</p>
                <p className="text-xs mt-1">Scan a target to see API responses</p>
              </div>
            ) : (
              <div className="relative">
                {/* Line numbers gutter */}
                <div className="flex">
                  <div className="flex-shrink-0 pr-3 mr-3 border-r border-green-500/10 select-none text-right" style={{ minWidth: '36px' }}>
                    {jsonString.split('\n').map((_, i) => (
                      <div key={i} className="text-[10px] text-gray-700 leading-relaxed font-mono">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <JsonSyntax json={jsonString} searchTerm={searchTerm} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer — always visible, never shrinks */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-t border-green-500/10 text-[10px] text-gray-600 font-mono"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <span>
              {activeTab && tabs.find(t => t.id === activeTab)?.icon}{' '}
              {activeTab?.toUpperCase() || 'N/A'} response
            </span>
            <span className="flex items-center gap-3">
              <span>{sizeKB} KB</span>
              <span>•</span>
              <span>{lineCount} lines</span>
              <span>•</span>
              <span>JSON</span>
            </span>
          </div>
        </div>
      </div>
    </>
  , document.body);
}
