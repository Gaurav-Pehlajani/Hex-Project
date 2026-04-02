import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Terminal, Copy as CopyIcon, Check as CheckIcon, Shield, User, LogOut, Square, Plus, ArrowDown, FileText, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import ReactMarkdown from 'react-markdown';
import { useIsMobile } from '@/hooks/use-mobile';
import { ApiError } from '@/lib/api-error-handler';

import { useAuth } from '@/hooks/use-auth';
import { AuthButton, AuthCard } from '@/components/AuthButton';
import BillingPopup from '@/components/BillingPopup';
import ThreatIntelFeed from '@/components/ThreatIntelFeed';
import TerminalWindow, { type TerminalOutput } from '@/components/TerminalWindow';
import { useToolExecution } from '@/hooks/use-tool-execution';
import TargetOverview from '@/components/TargetOverview';
import { type RawApiData } from '@/components/RawDataViewer';
import ScanHistory from '@/components/ScanHistory';
import { supabase } from '@/lib/supabase';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const SYSTEM_PROMPT = `
You are Hex AI — a professional cybersecurity intelligence assistant. You analyze real security data from Shodan and VirusTotal APIs and explain findings in plain English.

STRICT RULES - NEVER BREAK THESE:
- NEVER call any functions or tools like nmap_scan, dns_lookup, sqlmap_test, shodan_search, virustotal_lookup or ANY other function
- NEVER write function calls like tool_name(param="value") in your response
- ALWAYS look at the very end of the user's message for a section labeled [SYSTEM DATA ATTACHMENT].
- If that section contains VirusTotal, Geolocation, WHOIS, or Shodan data, you MUST analyze it.
- NEVER say "I don't have data" if there is text provided in the attachment.
- Use the exact numbers provided in the attachment for your "FINDINGS" section.
- If the attachment is missing, only then ask the user for an IP or domain.
- Always use the FULL target name exactly as provided
- When WHOIS data is provided, include domain registration details in your analysis
- When GEOLOCATION data is provided, mention the physical location in your findings
- When SHODAN data is provided, you MUST analyze the Open Ports and any Known Vulnerabilities (CVEs). Alert the user if dangerous ports are open (e.g. 22 SSH, 3389 RDP).
- Always reference the CUSTOM RISK SCORE provided and explain what it means

When real scan data is provided analyze it and respond in this exact format:

🔍 TARGET: [full target exactly as given]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 FINDINGS:
[You MUST quote the exact numbers from the real data provided - reputation score, exact malicious count, harmless votes, verdict. Do not generalize.]

🚨 CRITICAL ISSUES:
[List critical severity issues or "None found"]

⚠️ MEDIUM ISSUES:
[List medium severity issues or "None found"]

ℹ️ INFO:
[List informational findings]

🛡️ RECOMMENDATIONS:
[Specific numbered actionable steps]

📊 RISK RATING: [CRITICAL / HIGH / MEDIUM / LOW]

If no target is provided yet, ask the user to provide an IP address or domain to investigate.
`;

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

const CopyablePreBlock = (props: React.HTMLAttributes<HTMLPreElement>) => {
  const isMobile = useIsMobile();
  const codeElement = React.Children.toArray(props.children)[0];
  const codeString = codeElement && typeof codeElement === 'object' && 'props' in codeElement ? String(codeElement.props.children).replace(/\n$/, '') : '';
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      setCopied(false);
    }
  };
  if (isMobile) {
    return (
      <div className="relative mb-2 sm:mb-3">
        <button
          onClick={handleCopy}
          className="z-10 text-green-300 p-1.5 rounded opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700/50 border border-gray-600/50 shadow-sm absolute top-1 right-1 w-7 h-7 flex items-center justify-center"
          title={copied ? 'Copied!' : 'Copy'}
          aria-label="Copy code block"
          tabIndex={0}
          type="button"
        >
          {copied ? <CheckIcon className="w-3.5 h-3.5 flex-shrink-0" /> : <CopyIcon className="w-3.5 h-3.5 flex-shrink-0" />}
        </button>
        <pre className="bg-gray-800 p-2 pr-10 rounded-lg overflow-x-auto text-xs relative">
          {props.children}
        </pre>
      </div>
    );
  }
  return (
    <pre className="bg-gray-800 p-2 sm:p-3 md:p-4 rounded-lg overflow-x-auto mb-2 sm:mb-3 text-xs sm:text-sm relative" {...props}>
      <button
        onClick={handleCopy}
        className="z-10 text-green-300 p-1 rounded opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-green-400 sm:absolute sm:top-2 sm:right-2 bg-transparent border-none shadow-none w-6 h-6 flex items-center justify-center"
        title={copied ? 'Copied!' : 'Copy'}
        aria-label="Copy code block"
        tabIndex={0}
        type="button"
      >
        {copied ? <CheckIcon className="w-4 h-4 flex-shrink-0" /> : <CopyIcon className="w-4 h-4 flex-shrink-0" />}
      </button>
      {props.children}
    </pre>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, canSendMessage, incrementUsage, isPremium, dailyUsage, refreshUsage, signOut } = useAuth();
  const isMobile = useIsMobile();

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTarget, setCurrentTarget] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [geoData, setGeoData] = useState<string | null>(null);
  const [shodanData, setShodanData] = useState<string | null>(null);
  const [subdomains, setSubdomains] = useState<string[]>([]);
  const [rawApiData, setRawApiData] = useState<RawApiData>({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const userScrolledRef = useRef(false);
  const lastScrollHeightRef = useRef(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentAbortController, setCurrentAbortController] = useState<AbortController | null>(null);
  const [showBillingPopup, setShowBillingPopup] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const [terminalOutputs, setTerminalOutputs] = useState<TerminalOutput[]>([]);

  // Local Storage Helpers
  const saveMessagesToStorage = useCallback((msgs: Message[]) => {
    try { localStorage.setItem('hex_messages', JSON.stringify(msgs)); } catch (e) {}
  }, []);

  const loadMessagesFromStorage = useCallback((): Message[] => {
    try {
      const saved = localStorage.getItem('hex_messages');
      if (saved) {
        return JSON.parse(saved).map((msg: any) => {
          const timestamp = new Date(msg.timestamp);
          return { 
            ...msg, 
            timestamp: !isNaN(timestamp.getTime()) ? timestamp : new Date() 
          };
        });
      }
    } catch (e) {
      console.error("Storage Decode Error:", e);
    }
    return [];
  }, []);

  const saveStateToStorage = useCallback((state: any) => {
    if (!state || !state.target) return;
    try { localStorage.setItem('hex_active_investigation', JSON.stringify(state)); } catch (e) {}
  }, []);

  const loadStateFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem('hex_active_investigation');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  }, []);

  // Sync Logic
  useEffect(() => {
    const msgs = loadMessagesFromStorage();
    if (msgs.length > 0) setMessages(msgs);

    const state = loadStateFromStorage();
    if (state && state.target) {
      setCurrentTarget(state.target);
      setRiskScore(state.riskScore || 0);
      setGeoData(state.geoData || null);
      setShodanData(state.shodanData || null);
      setSubdomains(state.subdomains || []);
      setRawApiData(state.rawApiData || {});
    }
  }, [loadMessagesFromStorage, loadStateFromStorage]);

  // Smart Scroll Sentinel - keeps focus during history transitions
  useEffect(() => {
    if (isHistoryLoading) {
      // Stage 1: Instant Snap to Bottom
      scrollToBottom(false);
      
      const timer = setTimeout(() => {
        // Stage 2: Smooth Adjustment after layout stabilizes
        scrollToBottom(true);
        setIsHistoryLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isHistoryLoading, messages, currentTarget]);

  useEffect(() => {
    if (messages.length > 0) saveMessagesToStorage(messages);
    if (currentTarget) {
      saveStateToStorage({ target: currentTarget, riskScore, geoData, shodanData, subdomains, rawApiData });
    }
  }, [messages, currentTarget, riskScore, geoData, shodanData, subdomains, rawApiData, saveStateToStorage, saveMessagesToStorage]);

  // Actions
  const startNewChat = () => {
    if (currentAbortController) currentAbortController.abort();
    // Atomic clear of all investigative state
    setCurrentTarget(null);
    setGeoData(null);
    setShodanData(null);
    setRiskScore(0);
    setSubdomains([]);
    setRawApiData({});
    setMessages([]);
    localStorage.removeItem('hex_active_investigation');
    localStorage.removeItem('hex_messages');
    
    setTimeout(() => {
      const notification: Message = {
        id: `msg_${Date.now()}`,
        type: 'assistant',
        content: `🆕 **New investigation started**\n\nHow can I help you clear the next target?`,
        timestamp: new Date()
      };
      setMessages([notification]);
    }, 10);
  };

  const loadSavedScan = (scan: any) => {
    if (!scan.full_data) {
      startNewChat();
      setCurrentTarget(scan.target);
      setTimeout(() => sendMessage(false, false, `analyze ${scan.target}`), 500);
      return;
    }
    const data = scan.full_data;
    const restoredMessages = (data.messages || []).map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp)
    }));
    
    // Clear old state first to prevent "Bleed"
    setCurrentTarget(null);
    setGeoData(null);
    setShodanData(null);
    setRiskScore(0);

    // Apply new investigation state
    setMessages(restoredMessages);
    setCurrentTarget(data.target || scan.target);
    setRiskScore(data.riskScore || data.risk_score || scan.risk_score || 0);
    setGeoData(data.geoData || null);
    setShodanData(data.shodanData || null);
    setSubdomains(data.subdomains || []);
    setRawApiData(data.rawApiData || {});
    
    // Ghost Scan Guard: Hard block any auto-triggering scans
    setIsScanning(false);
    setIsHistoryLoading(true);
  };

  const generatePDFReport = async () => {
    if (!currentTarget) return;
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(52, 211, 153);
      doc.text('HEX AI', 15, 16);
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('SECURITY INTELLIGENCE ADVISORY', 15, 21);
      doc.setFontSize(8);
      doc.text(`REPORT ID: ${Math.random().toString(36).substring(7).toUpperCase()}`, pageWidth - 60, 12);
      doc.text(`DATE: ${new Date().toLocaleString()}`, pageWidth - 60, 17);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text(`Investigation Target: ${currentTarget.toUpperCase()}`, 15, 45);
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 48, pageWidth - 15, 48);

      // Section: Assessment
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text('THREAT ASSESSMENT METRIC', 15, 58);

      // Risk Assessment Infographic
      const riskColor = riskScore >= 70 ? [239, 68, 68] : riskScore >= 40 ? [249, 115, 22] : riskScore >= 20 ? [234, 179, 8] : [52, 211, 153];
      doc.setFillColor(31, 41, 55);
      doc.rect(15, 62, pageWidth - 30, 8, 'F');
      doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
      doc.rect(15, 62, (pageWidth - 30) * (Math.max(riskScore, 5) / 100), 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(`Risk Metric: ${riskScore}%`, pageWidth / 2, 67.5, { align: 'center' });

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.text('TACTICAL INFRASTRUCTURE DATA', 15, 80);
      doc.setDrawColor(229, 231, 235);
      doc.line(15, 82, pageWidth - 15, 82);
      
      doc.setTextColor(0, 0, 0);
      doc.text(`> TARGET: ${currentTarget.toUpperCase()}`, 15, 90);
      doc.text(`> NODE INFRA: ${shodanData?.split('\n')[0] || 'N/A'}`, 15, 96);
      doc.text(`> GEOLOCATION: ${geoData?.split('\n')[0] || 'N/A'}`, 15, 102);
      doc.text(`> SUBDOMAINS: ${subdomains.length} confirmed nodes`, 15, 108);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text('Strategic Intelligence Summary', 15, 125);
      doc.line(15, 128, pageWidth - 15, 128);
      
      const assistantMessage = [...messages].reverse().find(m => m.type === 'assistant')?.content || 'No summary available.';
      
      const sanitizedLines = assistantMessage
        .replace(/[^\x00-\x7F]/g, "")
        .replace(/[*#]/g, "")
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      let currentY = 138;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      sanitizedLines.forEach(line => {
        if (line.match(/^[A-Z\s]+:/)) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(16, 185, 129); // Emerald
          doc.text(`>> ${line}`, 15, currentY);
          currentY += 6;
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
        } else {
          const lines = doc.splitTextToSize(line, pageWidth - 35);
          doc.text(lines, 20, currentY);
          currentY += (lines.length * 5) + 2;
        }
        
        if (currentY > 270) {
          doc.addPage();
          currentY = 25;
        }
      });

      // Page Footers
      const pageCount = doc.internal.pages.length - 1;
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(52, 211, 153);
        doc.setLineWidth(0.5);
        doc.rect(5, 5, pageWidth - 10, doc.internal.pageSize.getHeight() - 10);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`CONFIDENTIAL SECURITY ADVISORY - HEX AI - Page ${i} of ${pageCount}`, pageWidth / 2, 287, { align: 'center' });
      }
      doc.save(`HEX-Report-${currentTarget.toUpperCase()}.pdf`);
    } catch (err) { console.error(err); } finally { setIsGeneratingPDF(false); }
  };

  const estimateTokens = (text: string) => Math.max(Math.ceil(text.length / 4), 10);

  const sendMessage = async (isRetry = false, autoTrigger = false, directMessage?: string) => {
    const msg = directMessage || input.trim();
    if (!msg && !autoTrigger) return;
    if (!isAuthenticated) return addMessage('assistant', 'Please sign in first.', true);

    if (!isRetry && !autoTrigger && !isPremium && !canSendMessage) return setShowBillingPopup(true);
    if (!isRetry && !autoTrigger && !isPremium) await incrementUsage();

    const { extractTarget, queryVirusTotal, queryGeolocation, queryWhois, queryShodan, querySubdomains, calculateRiskScore, getRiskLabel } = await import('@/lib/deepseek-client');
    const target = extractTarget(msg);
    let realData = '';
    
    // Scoped variables for the scan
    let scanResults: any = { target: null, score: 0, geo: null, shodan: null, subs: [], raw: {} };

    if (target) {
      setCurrentTarget(target);
      setIsScanning(true);
      const isIP = /^\d+\.\d+\.\d+\.\d+$/.test(target);
      
      // Phase 1: Primary Intel & Resolution
      const [vt, geo, whois, subs] = await Promise.all([
        queryVirusTotal(target),
        queryGeolocation(target),
        !isIP ? queryWhois(target) : Promise.resolve({ formatted: 'N/A', raw: null }),
        !isIP ? querySubdomains(target) : Promise.resolve({ formatted: 'N/A', raw: [] })
      ]);

      // Phase 2: Unmasking Attack Surface (Resolve Domain to IP for Shodan)
      const resolvedIP = isIP ? target : (geo.raw?.query || null);
      const shodan = (resolvedIP && resolvedIP !== 'localhost') 
        ? await queryShodan(resolvedIP) 
        : { formatted: 'N/A', raw: null };

      const raw: RawApiData = { virustotal: vt.raw, shodan: shodan.raw, whois: whois.raw, geolocation: geo.raw };
      setRawApiData(raw);
      setSubdomains(subs.raw || []);
      
      const infrastructureData = !isIP ? (whois.formatted + "\n" + shodan.formatted) : shodan.formatted;
      const score = calculateRiskScore(vt.formatted, geo.formatted, infrastructureData);
      setRiskScore(score);
      setGeoData(geo.formatted);
      setShodanData(infrastructureData);
      setIsScanning(false);
      
      // Cache results for history archival
      scanResults = { target, score, geo: geo.formatted, shodan: infrastructureData, subs: subs.raw, raw };
      realData = `\n\n[SYSTEM DATA ATTACHMENT]:\nCUSTOM RISK SCORE: ${score}%\n${vt.formatted}\n${geo.formatted}\n${whois.formatted}\n${shodan.formatted}\n${subs.formatted}`;
    }

    if (!isRetry && !autoTrigger) {
      addMessage('user', msg);
      setInput('');
      setTimeout(() => scrollToBottom(true), 100);
    }

    const abort = new AbortController();
    setCurrentAbortController(abort);
    setIsStreaming(true);

    try {
      const initial = addMessage('assistant', '', false);
      const { sendToDeepSeek } = await import('@/lib/deepseek-client');
      let full = '';
      
      const chatHistory = messages.slice(-10).map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
        content: m.content
      }));
      
      const convo = [...chatHistory, { role: 'user' as const, content: `${msg}${realData ? `\n\n[SYSTEM DATA ATTACHMENT]:\n${realData}` : ''}` }];

      await sendToDeepSeek(convo, SYSTEM_PROMPT, (text) => {
        full += text;
        setMessages(prev => prev.map(m => m.id === initial.id ? { ...m, content: full } : m));
        scrollToBottom(true);
      }, () => {
        setIsStreaming(false);
        // Strategic Archive: Save complete investigation to history
        if (user?.id && scanResults.target) {
          setMessages(prev => {
            const bundle = { 
              messages: prev, 
              target: scanResults.target, 
              riskScore: scanResults.score, 
              geoData: scanResults.geo, 
              shodanData: scanResults.shodan, 
              subdomains: scanResults.subs, 
              rawApiData: scanResults.raw 
            };
            
            supabase.from('scan_history')
              .insert({ 
                user_id: user.id, 
                target: scanResults.target, 
                risk_score: scanResults.score, 
                verdict: getRiskLabel(scanResults.score), 
                full_data: bundle 
              }).then(() => console.log("📊 Intelligence archived for", scanResults.target));
            return prev;
          });
        }
      }, (err) => {
        setIsStreaming(false);
        addMessage('assistant', err.message, true);
      }, abort.signal);
    } catch (error: any) {
      console.error('Scan Execution Error:', error);
      setIsStreaming(false);
      addMessage('assistant', `⚠️ **AI Intelligence Failure**: ${error.message || 'Error communicating with Hex Core.'}`, true);
    } finally {
      setIsStreaming(false);
      setCurrentAbortController(null);
    }
  };

  const addMessage = (type: 'user' | 'assistant', content: string, isError = false) => {
    const newMessage: Message = { id: `msg_${Date.now()}_${Math.random()}`, type, content, timestamp: new Date(), isError };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(() => scrollToBottom(), 50);
    return newMessage;
  };

  const scrollToBottom = useCallback((force = false) => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    const isNear = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (force || isNear || !userScrolledRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const isAtBottom = messagesContainerRef.current.scrollHeight - messagesContainerRef.current.scrollTop - messagesContainerRef.current.clientHeight < 50;
    setShowScrollButton(!isAtBottom);
    if (!isAtBottom && messagesContainerRef.current.scrollTop < lastScrollHeightRef.current) userScrolledRef.current = true;
    else if (isAtBottom) userScrolledRef.current = false;
    lastScrollHeightRef.current = messagesContainerRef.current.scrollTop;
  }, []);

  const handleInputFocus = () => { if (isMobile) setTimeout(() => textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300); };
  const [input, setInput] = useState('');

  const { isConnected: isToolConnected, isExecuting: isToolExecuting, executeTool } = useToolExecution({
    onOutput: (o) => setTerminalOutputs(prev => [...prev, o]),
    onComplete: (code, outs) => {
      const outText = outs.map(o => o.content).join('\n');
      if (outText) setTimeout(() => sendMessage(false, true, `Result: ${outText}`), 500);
    }
  });

  if (!isAuthenticated) return <AuthCard />;

  return (
    <div className="flex h-screen bg-[#020617] text-green-500 font-mono overflow-hidden relative">
      {/* Premium Background Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-emerald-500/5 blur-[140px] rounded-full" />
        <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-emerald-500/15 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-indigo-500/10 blur-[140px] rounded-full" />
      </div>

      {/* Main Grid Layout */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Restored Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-xl font-black tracking-tighter text-white uppercase italic">Hex</span>
              </div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold ml-1">AI Penetration Testing</span>
            </div>
            
            <div className="hidden lg:flex items-center px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                v2.0 <span className="text-green-500/50">•</span> Ethical
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={startNewChat} className="bg-white/5 hover:bg-white/10 text-white text-[10px] h-8 px-4 border border-white/10 rounded-full font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
              <Plus className="h-3 w-3" /> New Chat
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setShowHistory(true)} className="bg-white/5 hover:bg-white/10 text-white text-[10px] h-8 px-4 border border-white/10 rounded-full font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
              <Clock className="h-3 w-3" /> History
            </Button>

            {currentTarget && (
              <Button variant="ghost" size="sm" onClick={generatePDFReport} disabled={isGeneratingPDF} className="bg-green-600/10 hover:bg-green-600/20 text-green-400 text-[10px] h-8 px-4 border border-green-500/20 rounded-full font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                <FileText className="h-3 w-3" /> {isGeneratingPDF ? 'Working...' : 'Report'}
              </Button>
            )}

            <Button variant="ghost" size="sm" className="bg-white/5 px-2 h-8 rounded-full border border-white/10 text-white hover:bg-white/10">
              <User className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Online</span>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Operations Sidebar */}
          <aside className="w-80 border-r border-white/5 p-4 flex flex-col gap-4 bg-black/20 backdrop-blur-sm hidden lg:flex">
            <AuthCard />
            <div className="flex-1 overflow-hidden flex flex-col gap-2 rounded-xl border border-white/5 bg-black/40 shadow-inner">
               <ThreatIntelFeed />
            </div>
          </aside>

          {/* Main Intelligence Hub */}
          <main className="flex-1 flex flex-col relative overflow-hidden bg-black/20">
            {/* Scrollable Container for Intelligence + Chat */}
            <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scrollbar-none pb-32">
               <div className="max-w-5xl mx-auto p-4 space-y-6">
                  {/* Hero Intelligence Dashboard */}
                  {currentTarget && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <TargetOverview 
                         target={currentTarget} 
                         geoData={geoData} 
                         shodanData={shodanData} 
                         riskScore={riskScore} 
                         isLoading={isScanning} 
                         rawApiData={rawApiData} 
                         subdomains={subdomains} 
                         isPremium={isPremium} 
                      />
                    </div>
                  )}

                  {/* Chat Section */}
                  <div className="space-y-6 pt-4">
                    {messages.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center opacity-10 border-2 border-dashed border-green-500/20 rounded-3xl mx-12">
                         <Shield className="h-16 w-16 mb-4" />
                         <span className="text-xl font-black uppercase tracking-[0.3em]">Ready for Analysis</span>
                      </div>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id} className={`flex flex-col ${m.type === 'user' ? 'items-end' : 'items-start'} gap-2 group animate-in fade-in duration-300`}>
                          <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest opacity-30 px-2 group-hover:opacity-60 transition-opacity">
                            {m.type === 'assistant' && <div className="w-4 h-0.5 bg-green-500/50" />}
                            <span>{m.type === 'user' ? 'Operator' : 'HEX Terminal'}</span>
                            <span>•</span>
                            <span className="font-mono">
                              {m.timestamp instanceof Date && !isNaN(m.timestamp.getTime()) 
                                ? m.timestamp.toLocaleTimeString().split(' ')[0] 
                                : new Date().toLocaleTimeString().split(' ')[0]}
                            </span>
                            {m.type === 'user' && <div className="w-4 h-0.5 bg-green-500/50" />}
                          </div>
                          
                          <div className={`max-w-[85%] rounded-2xl p-4 shadow-xl border ${
                            m.type === 'user' 
                              ? 'bg-green-500/5 border-green-500/20 text-green-50 border-r-4 border-r-green-500/40 translate-x-1' 
                              : 'bg-gray-900/80 border-white/5 text-gray-200 shadow-black/40 backdrop-blur-sm'
                          }`}>
                            <div className="prose prose-invert prose-emerald max-w-none text-sm leading-relaxed overflow-hidden">
                              <ReactMarkdown components={{ pre: CopyablePreBlock }}>{m.content}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
               </div>
            </div>

            {/* Input Controller */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-40">
              <div className="max-w-4xl mx-auto relative group">
                <div className="absolute inset-x-0 bottom-full mb-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] uppercase font-bold tracking-widest text-green-400">
                     Shift + Enter for new line
                   </div>
                </div>
                
                <Textarea 
                  ref={textareaRef} 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onFocus={handleInputFocus} 
                  onKeyDown={(e) => {if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}}} 
                  placeholder="Ask about penetration testing, request payloads, or security analysis..." 
                  className="bg-gray-900/60 border-green-500/30 text-green-400 text-sm py-4 pl-6 pr-16 min-h-[64px] rounded-2xl focus:border-green-500/60 focus:ring-0 shadow-[0_0_15px_rgba(34,197,94,0.05)] transition-all scrollbar-none placeholder:text-gray-600" 
                />
                
                <Button 
                  onClick={() => sendMessage()} 
                  disabled={isStreaming || !input.trim()} 
                  className="absolute right-3 bottom-2.5 h-10 w-10 rounded-xl bg-green-600 text-black hover:bg-green-400 disabled:opacity-20 transition-all flex items-center justify-center p-0"
                >
                  {isStreaming ? <Square className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <ScanHistory open={showHistory} onOpenChange={setShowHistory} userId={user?.id} onSelectScan={loadSavedScan} />
      <BillingPopup isOpen={showBillingPopup} onClose={() => setShowBillingPopup(false)} dailyUsage={dailyUsage || { messageCount: 0, canSendMessage: true }} />
    </div>
  );
};

export default Index;