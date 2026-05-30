import React, { useState } from 'react';
import { CivicProvider } from './context/CivicContext';
import { PwaShell } from './components/PwaShell';
import { ParramattaMap } from './components/ParramattaMap';
import { PulsePolls } from './components/PulsePolls';
import { PitchingEngine } from './components/PitchingEngine';
import { AISummaryAccordion } from './components/AISummaryAccordion';
import { BlogFeed } from './components/BlogFeed';
import { Chatbot } from './components/Chatbot';
import { CommunityBlog } from './components/CommunityBlog';
import { Vote, FileText, MessageSquareShare, Users } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'voting' | 'blog' | 'chatbot' | 'community'>('voting');

  return (
    <CivicProvider>
      <PwaShell>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in" id="pwa-master-grid">
          
          {/* Left Column: Spatial GIS Map & Council Briefing Summary Core */}
          <div className="lg:col-span-5 space-y-6 flex flex-col h-full" id="left-layout-column">
            <ParramattaMap />
            <AISummaryAccordion />
          </div>

          {/* Right Column: Interactive Tabded Social Feed core */}
          <div className="lg:col-span-7 space-y-6" id="right-layout-column">
            
            {/* Visual Navigation Tabs */}
            <div className="flex border-b border-neutral-200/60 pb-px gap-1 overflow-x-auto" id="feed-horizontal-tabs">
              <button
                onClick={() => setActiveTab('voting')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-sans font-extrabold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'voting'
                    ? 'border-blue-600 text-blue-600 font-black'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <Vote className="w-4 h-4 shrink-0" />
                Pulse Voting & Ideas
              </button>

              <button
                onClick={() => setActiveTab('blog')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-sans font-extrabold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'blog'
                    ? 'border-blue-600 text-blue-600 font-black'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                Public Newsroom
              </button>

              <button
                onClick={() => setActiveTab('chatbot')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-sans font-extrabold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'chatbot'
                    ? 'border-indigo-600 text-indigo-600 font-black'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <MessageSquareShare className="w-4 h-4 shrink-0 animate-pulse text-indigo-500" />
                AI Planning Chat
              </button>

              <button
                onClick={() => setActiveTab('community')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-sans font-extrabold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'community'
                    ? 'border-blue-600 text-blue-600 font-black'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <Users className="w-4 h-4 shrink-0 text-emerald-500" />
                Public Community Blog
              </button>
            </div>

            {/* Dynamic Panel Content */}
            <div className="pt-2" id="tab-content-panel">
              {activeTab === 'voting' && (
                <div className="space-y-8 animate-fade-in">
                  <PulsePolls />
                  <div className="border-t border-neutral-200/50 pt-8">
                    <PitchingEngine />
                  </div>
                </div>
              )}

              {activeTab === 'blog' && (
                <div className="animate-fade-in">
                  <BlogFeed />
                </div>
              )}

              {activeTab === 'chatbot' && (
                <div className="animate-fade-in">
                  <Chatbot />
                </div>
              )}

              {activeTab === 'community' && (
                <div className="animate-fade-in">
                  <CommunityBlog />
                </div>
              )}
            </div>

          </div>

        </div>
      </PwaShell>
    </CivicProvider>
  );
}
