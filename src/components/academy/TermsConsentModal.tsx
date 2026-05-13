import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Scale, AlertTriangle, Cpu, Check, X } from 'lucide-react';

interface TermsConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const TermsConsentModal: React.FC<TermsConsentModalProps> = ({ isOpen, onAccept, onDecline }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="bg-[#0a0f1d] border border-hex-primary-fixed/30 rounded-lg w-full max-w-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-hex-primary-fixed/5 p-6 border-b border-hex-primary-fixed/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-hex-primary-fixed/10 flex items-center justify-center border border-hex-primary-fixed/20">
                  <Shield className="w-6 h-6 text-hex-primary-fixed" />
                </div>
                <div>
                  <h3 className="font-headline-lg text-xl text-white uppercase tracking-widest">Master Operational Accord</h3>
                  <p className="font-monospace-data text-[10px] text-hex-primary-fixed/60 uppercase tracking-[0.2em]">HEX_INTEL // LEGAL_FRAMEWORK_V2.5</p>
                </div>
              </div>
              <button 
                onClick={onDecline}
                className="text-hex-on-surface-variant/40 hover:text-hex-error transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legal Content */}
            <div className="p-8 overflow-y-auto custom-scrollbar-professional space-y-10 bg-black/20" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#00F5FF33 transparent'
            }}>
              <style>{`
                .custom-scrollbar-professional::-webkit-scrollbar {
                  width: 4px;
                }
                .custom-scrollbar-professional::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar-professional::-webkit-scrollbar-thumb {
                  background: rgba(0, 245, 255, 0.2);
                  border-radius: 10px;
                }
                .custom-scrollbar-professional::-webkit-scrollbar-thumb:hover {
                  background: rgba(0, 245, 255, 0.5);
                }
              `}</style>

              <div className="max-w-none font-monospace-data">
                <section className="space-y-4 mb-10">
                  <h4 className="text-hex-primary-fixed uppercase tracking-[0.3em] text-xs font-bold border-l-2 border-hex-primary-fixed/40 pl-4 py-1">01. Acceptance of Terms</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed pl-5">
                    By accessing the HEX Academy Training Core ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using the Service and must exit immediately.
                  </p>
                </section>

                <section className="space-y-4 mb-10">
                  <h4 className="text-hex-primary-fixed uppercase tracking-[0.3em] text-xs font-bold border-l-2 border-hex-primary-fixed/40 pl-4 py-1">02. Ethical Use Directive</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed pl-5">
                    The Service is provided for educational, research, and authorized defensive testing purposes only. Any attempt to utilize strategies, payloads, or methodologies learned within this platform against unauthorized systems is a violation of international law and our internal protocols.
                  </p>
                </section>

                <section className="space-y-4 mb-10">
                  <h4 className="text-hex-primary-fixed uppercase tracking-[0.3em] text-xs font-bold border-l-2 border-hex-primary-fixed/40 pl-4 py-1">03. User Responsibility & Liability</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed pl-5">
                    HEX_INTEL and its creators shall not be held liable for any damages, legal repercussions, or system failures resulting from the misuse of the tools or information provided. Users operate at their own risk and are responsible for ensuring compliance with local jurisdiction laws.
                  </p>
                </section>

                <section className="space-y-4 mb-10">
                  <h4 className="text-hex-primary-fixed uppercase tracking-[0.3em] text-xs font-bold border-l-2 border-hex-primary-fixed/40 pl-4 py-1">04. Intellectual Property</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed pl-5">
                    The training modules, simulated environments, and AI-generated recon data are the exclusive intellectual property of HEX_INTEL. Unauthorized redistribution, cloning, or commercial exploitation of these resources will result in immediate termination of clearance.
                  </p>
                </section>

                <section className="space-y-4 mb-10">
                  <h4 className="text-hex-primary-fixed uppercase tracking-[0.3em] text-xs font-bold border-l-2 border-hex-primary-fixed/40 pl-4 py-1">05. Termination of Access</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed pl-5">
                    We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                </section>

                <section className="space-y-4">
                  <h4 className="text-hex-primary-fixed uppercase tracking-[0.3em] text-xs font-bold border-l-2 border-hex-primary-fixed/40 pl-4 py-1">06. Governing Law</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed pl-5">
                    These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which HEX_INTEL operates, without regard to its conflict of law provisions.
                  </p>
                </section>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-black/40 border-t border-hex-primary-fixed/10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onDecline}
                className="flex-1 py-3 px-6 border border-hex-error/30 text-hex-error hover:bg-hex-error/10 font-monospace-data uppercase tracking-widest text-[10px] transition-all rounded flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                DECLINE_AND_EXIT
              </button>
              <button
                onClick={onAccept}
                className="flex-[2] py-3 px-6 bg-hex-primary-fixed hover:bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-300 rounded flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.3)]"
              >
                <Check className="w-4 h-4" />
                AUTHORIZE_ENGAGEMENT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
