import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, Copy, Check, Globe, Search, Download } from 'lucide-react';

interface SubdomainsViewerProps {
  subdomains: string[];
  target: string;
  onClose: () => void;
}

const SubdomainsViewer: React.FC<SubdomainsViewerProps> = ({ subdomains, target, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSubdomains = useMemo(() => {
    if (!searchTerm) return subdomains;
    const lowerSearch = searchTerm.toLowerCase();
    return subdomains.filter(sub => sub.toLowerCase().includes(lowerSearch));
  }, [subdomains, searchTerm]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(filteredSubdomains.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([filteredSubdomains.join('\n')], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${target}-subdomains.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return ReactDOM.createPortal(
    <>
      <style>{`
        .subdomains-scrollbar::-webkit-scrollbar { width: 6px; }
        .subdomains-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 3px; }
        .subdomains-scrollbar::-webkit-scrollbar-thumb { background: rgba(74, 222, 128, 0.3); border-radius: 3px; }
        .subdomains-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(74, 222, 128, 0.5); }
        
        @keyframes subSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes subBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .sub-modal { animation: subSlideIn 0.25s ease-out; }
        .sub-backdrop { animation: subBackdrop 0.2s ease-out; }
      `}</style>

      <div
        className="sub-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="sub-modal w-full max-w-2xl flex flex-col rounded-xl overflow-hidden border border-green-500/30 shadow-2xl shadow-green-900/20"
          style={{
            background: 'linear-gradient(145deg, rgba(10, 10, 10, 0.98) 0%, rgba(5, 20, 10, 0.98) 100%)',
            maxHeight: '85vh',
          }}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-green-500/20"
            style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(5,30,15,0.4) 100%)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <Globe className="h-5 w-5 text-green-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-green-300 tracking-wide">
                  Discovered Subdomains
                </h2>
                <p className="text-[10px] text-gray-500 font-mono truncate">
                  {target} • {subdomains.length} total
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border border-green-500/15 text-gray-400 hover:text-green-300 hover:bg-green-500/10"
              >
                <Download className="h-3 w-3" />
                <span className="hidden sm:inline">Export</span>
              </button>

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
                <span className="hidden sm:inline">{copied ? 'Copied All!' : 'Copy All'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 ml-1 rounded-lg border border-gray-700/50 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b border-green-500/10"
            style={{ background: 'rgba(0,0,0,0.2)' }}
          >
            <Search className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter subdomains..."
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
              <span>{filteredSubdomains.length} shown</span>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 min-h-0 overflow-y-auto subdomains-scrollbar p-0">
            {filteredSubdomains.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Globe className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No subdomains found</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-green-500/5">
                {filteredSubdomains.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-500/5 transition-colors group">
                    <div className="text-[10px] text-gray-600 font-mono w-6 text-right select-none">{idx + 1}</div>
                    <div className="text-xs text-gray-300 font-mono flex-1 truncate group-hover:text-green-300 transition-colors">
                      {sub}
                    </div>
                    <a 
                      href={`http://${sub}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] border border-green-500/20 px-2 py-0.5 rounded text-green-500/50 hover:text-green-400 hover:border-green-400/50 transition-colors hidden sm:block"
                    >
                      Visit HTTP
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  , document.body);
};

export default SubdomainsViewer;
