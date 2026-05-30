import React, { useState, useEffect } from 'react';
import { useCivic } from '../context/CivicContext';
import { Sparkles, Calendar, MapPin, Eye, Zap, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AISummaryAccordion: React.FC = () => {
  const { meetings, selectedMeeting, setSelectedMeeting, language, translateText } = useCivic();
  
  // Status hooks
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [hasSummary, setHasSummary] = useState(true); // default true for pre-rendered simulation, but they can regenerate
  const [activeSegment, setActiveSegment] = useState<'tldr' | 'takeaways' | 'full'>('tldr');

  const triggerMockAnalysis = (meetingId: string) => {
    setIsSummarizing(true);
    setHasSummary(false);
    
    // Simulate real-time API lag from server-side Gemini endpoints
    setTimeout(() => {
      setIsSummarizing(false);
      setHasSummary(true);
      setActiveSegment('tldr');
    }, 1200);
  };

  const handleMeetingChange = (meetingId: string) => {
    const meet = meetings.find(m => m.id === meetingId);
    if (meet) {
      setSelectedMeeting(meet);
      // Auto-trigger a brief animation to reload the AI summary for high-fidelity visual satisfaction
      triggerMockAnalysis(meetingId);
    }
  };

  if (!selectedMeeting) return null;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs flex flex-col h-full" id="ai-assistant-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600 fill-purple-100" />
          </div>
          <div>
            <h2 className="text-md font-sans font-semibold text-neutral-800 tracking-tight">
              {translateText('tldrSummary')}
            </h2>
          </div>
        </div>
        
        {/* Meeting selector dropdown */}
        <select
          value={selectedMeeting.id}
          onChange={(e) => handleMeetingChange(e.target.value)}
          className="text-[10px] font-sans font-bold bg-neutral-100/80 border border-neutral-200 text-neutral-600 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-purple-200 cursor-pointer"
        >
          {meetings.map((m) => (
            <option key={m.id} value={m.id}>
              {m.date} - Briefing Summary
            </option>
          ))}
        </select>
      </div>

      {/* Main Container Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[300px]" id="summary-assistant-grid">
        
        {/* Left Side: Traditional Meeting notes display (raw text) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-neutral-50 rounded-xl border border-neutral-200/40 p-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-neutral-400" />
                Raw Legal Records
              </span>
              <span className="text-[10px] font-sans font-semibold text-neutral-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {selectedMeeting.date}
              </span>
            </div>

            <h3 className="text-xs font-sans font-bold text-neutral-800 leading-snug mb-2.5">
              {selectedMeeting.title[language]}
            </h3>

            <div className="text-[11px] font-sans text-neutral-500 leading-relaxed max-h-[170px] overflow-y-auto pr-1 select-text scrollbar-thin">
              <p className="whitespace-pre-line">{selectedMeeting.notes[language]}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200/50 flex justify-between items-center text-[10px] font-sans text-neutral-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {selectedMeeting.locationName}
            </span>
            <button
              onClick={() => triggerMockAnalysis(selectedMeeting.id)}
              className="text-purple-600 font-bold hover:underline cursor-pointer flex items-center gap-1 leading-none uppercase text-[9px] font-mono"
            >
              <Zap className="w-3 h-3 text-purple-600 fill-purple-100" />
              Re-analyze File
            </button>
          </div>
        </div>

        {/* Right Side: Interactive AI summary block */}
        <div className="lg:col-span-7 bg-purple-50/20 rounded-xl border border-purple-100 p-4 flex flex-col justify-between relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {isSummarizing ? (
              // Simulated Loading Micro-Stage
              <motion.div
                key="summarizing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center py-10"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border border-purple-200 border-t-purple-600 animate-spin" />
                  <Sparkles className="w-6 h-6 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-purple-100" />
                </div>
                <h4 className="text-xs font-sans font-bold text-purple-800 mt-4 animate-pulse">
                  Gemini-3.5-Flash digesting public docket files...
                </h4>
                <p className="text-[10px] text-purple-400 font-mono mt-1">
                  Synthesizing structures, figures and local heat data
                </p>
              </motion.div>
            ) : (
              // Realized Summarization Layout
              <motion.div
                key="summary-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  {/* Segment controller Tabs */}
                  <div className="flex gap-2 border-b border-purple-100/50 pb-2 mb-3">
                    <button
                      onClick={() => setActiveSegment('tldr')}
                      className={`text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeSegment === 'tldr'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-purple-50/50 text-purple-600 hover:bg-purple-100/50'
                      }`}
                    >
                      TL;DR Brief
                    </button>
                    <button
                      onClick={() => setActiveSegment('takeaways')}
                      className={`text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeSegment === 'takeaways'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-purple-50/50 text-purple-600 hover:bg-purple-100/50'
                      }`}
                    >
                      Key Milestones
                    </button>
                  </div>

                  {/* Tab Display Panel Area */}
                  {activeSegment === 'tldr' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="p-3 bg-white/85 rounded-xl border border-purple-100/50 shadow-xs">
                        <p className="text-xs font-sans text-purple-900 leading-relaxed font-medium">
                          {selectedMeeting.summary[language]}
                        </p>
                      </div>
                      
                      <div className="p-2 bg-purple-100/20 border border-purple-200/30 rounded-lg text-[10px] text-purple-700 font-sans flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Interactive mock showcases how LLM APIs transform complex zoning bills into human-readable alerts.</span>
                      </div>
                    </div>
                  )}

                  {activeSegment === 'takeaways' && (
                    <div className="space-y-2 animate-fade-in" id="takeaways-tab">
                      {selectedMeeting.keyTakeaways.map((takeaway, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white/70 hover:bg-white/95 rounded-xl border border-purple-100/40 flex items-start gap-2.5 transition"
                        >
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-[11px] font-sans text-neutral-700 leading-relaxed font-semibold">
                            {takeaway[language]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gemini Model stamp logo footer */}
                <div className="mt-4 pt-3.5 border-t border-purple-200/30 flex justify-between items-center text-[9px] font-mono text-purple-500/80">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                    Synthesized via Gemini-3.5-Flash
                  </span>
                  <span className="bg-purple-100/60 px-2 py-0.5 rounded-md uppercase tracking-wider font-extrabold border border-purple-200/50">
                    Confidence AI-98%
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
};
