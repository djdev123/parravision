import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { ProposalCategory, Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowUp,
  MapPin,
  Tag,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  User,
  PlusCircle,
  Clock,
  Compass
} from 'lucide-react';

export const PitchingEngine: React.FC = () => {
  const { proposals, upvoteProposal, addProposal, selectedZone, setSelectedZone, language, translateText } = useCivic();
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProposalCategory | 'All'>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ProposalCategory>('TypeInfrastructure');
  const [newLocation, setNewLocation] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Suggested tags based on category
  const getSuggestedTags = (cat: ProposalCategory): string[] => {
    switch (cat) {
      case 'TypeInfrastructure':
        return ['Green Infra', 'Smart Urbanism', 'Pedestrian-safety'];
      case 'TypeCultural':
        return ['Local Arts', 'Heritage', 'Dharug Culture'];
      case 'TypePolicy':
        return ['Night Economy', 'Sustainability', 'Governance'];
    }
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      alert(translateText('enterTitleDesc'));
      return;
    }

    // Set up multilingual support structures (English literal, copy over to others dynamically for mock correctness)
    const titleRecord: Record<Language, string> = {
      en: newTitle,
      zh: `[翻译] ${newTitle}`,
      hn: `[अनुवादित] ${newTitle}`
    };

    const descRecord: Record<Language, string> = {
      en: newDesc,
      zh: `[译文自英文原版内容]: ${newDesc}`,
      hn: `[अंग्रेजी से अनुवादित]: ${newDesc}`
    };

    const tags = getSuggestedTags(newCategory);

    addProposal(titleRecord, descRecord, newCategory, newLocation || 'Parramatta Core', newAuthor || 'Verified Local Resident', tags);
    
    // Clear Form State & Trigger successes
    setNewTitle('');
    setNewDesc('');
    setNewLocation('');
    setNewAuthor('');
    setFormSuccess(true);
    
    setTimeout(() => {
      setFormSuccess(false);
      setIsFormOpen(false);
    }, 2000);
  };

  // Filter Logic: Search query + Category filter + Map Selected Zone coordinates coupling
  const filteredProposals = proposals.filter(p => {
    const matchesSearch = 
      p.title[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    // Map zone correlation
    const matchesZone = !selectedZone || p.locationName.toLowerCase().includes(selectedZone.toLowerCase()) || selectedZone.toLowerCase().includes(p.locationName.toLowerCase());

    return matchesSearch && matchesCategory && matchesZone;
  });

  return (
    <div className="flex flex-col gap-6" id="pitching-engine-container">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Compass className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-sans font-semibold text-neutral-800 tracking-tight">
              {translateText('expertPitches')}
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Verified proposals by regional practitioners & research collectives
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-sans font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer w-full sm:w-auto justify-center active:scale-98"
          id="toggle-submission-btn"
        >
          <PlusCircle className="w-4 h-4" />
          {translateText('submitPitch')}
        </button>
      </div>

      {/* Structured Proposal Submission Modal-Slide-Down */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-300 p-5 mt-1"
          >
            {formSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2 animate-bounce" />
                <h3 className="text-sm font-sans font-bold text-neutral-800">Proposal Broadcast Success</h3>
                <p className="text-xs text-neutral-500 font-sans mt-1">Successfully aggregated into Parramatta's public polling feed.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateProposal} className="space-y-4 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-500 font-semibold">{translateText('newPitchTitle')}</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Solar Shade Canopies along CBD lanes"
                      className="text-xs bg-white border border-neutral-200 focus:border-blue-500 focus:outline-none p-3 rounded-xl transition"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-500 font-semibold">{translateText('selectCategory')}</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ProposalCategory)}
                      className="text-xs bg-white border border-neutral-200 focus:border-blue-500 focus:outline-none p-3 rounded-xl transition"
                    >
                      <option value="TypeInfrastructure">{translateText('infrastructure')}</option>
                      <option value="TypeCultural">{translateText('cultural')}</option>
                      <option value="TypePolicy">{translateText('policy')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Author Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-500 font-semibold">{translateText('pitchAuthor')}</label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Dr. Jordan Smith (Urban Resiliency Lab)"
                      className="text-xs bg-white border border-neutral-200 focus:border-blue-500 focus:outline-none p-3 rounded-xl transition"
                    />
                  </div>

                  {/* Location Target */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-500 font-semibold">{translateText('pitchLocation')}</label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Heritage Precinct"
                      className="text-xs bg-white border border-neutral-200 focus:border-blue-500 focus:outline-none p-3 rounded-xl transition"
                    />
                  </div>
                </div>

                {/* Description Textarea */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-500 font-semibold">Pitch Solution Brief (Strict character structure)</label>
                  <textarea
                    rows={3}
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Provide detailed, metrics-backed municipal logic..."
                    className="text-xs bg-white border border-neutral-200 focus:border-blue-500 focus:outline-none p-3 rounded-xl transition resize-none"
                  />
                </div>

                {/* Footer terms with Submit button */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200/50 pt-3.5 gap-3">
                  <span className="text-[10px] text-neutral-400 font-sans flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Secure blockchain proof added to city council records
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 text-xs font-sans font-medium hover:bg-neutral-200 text-neutral-600 rounded-xl transition cursor-pointer flex-1 sm:flex-none justify-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-sans font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition cursor-pointer flex-1 sm:flex-none justify-center"
                    >
                      {translateText('pitchButton')}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Action Row */}
      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/60 flex flex-col md:flex-row gap-3 items-center">
        {/* Search Searchbar */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search proposals by designer name, keyword, or community initiative..."
            className="w-full text-xs pl-10 pr-3 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-blue-400 focus:outline-none transition font-sans"
          />
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar scroll-smooth">
          <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0 hidden sm:inline" />
          {(['All', 'TypeInfrastructure', 'TypeCultural', 'TypePolicy'] as const).map((filterOpt) => {
            const isSelected = categoryFilter === filterOpt;
            return (
              <button
                key={filterOpt}
                onClick={() => setCategoryFilter(filterOpt)}
                className={`text-[10px] font-sans font-semibold shrink-0 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800 text-white border-neutral-800'
                    : 'bg-white text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 border-neutral-200/80'
                }`}
              >
                {filterOpt === 'All'
                  ? 'All Categorized'
                  : filterOpt === 'TypeInfrastructure'
                  ? translateText('infrastructure')
                  : filterOpt === 'TypeCultural'
                  ? translateText('cultural')
                  : translateText('policy')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Active Filter Alert HUD */}
      {selectedZone && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-700 font-sans font-medium shadow-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>
            <span>
              Connected Map Filters: Showing proposals designated near <strong>"{selectedZone}"</strong>
            </span>
          </div>
          <button
            onClick={() => setSelectedZone(null)}
            className="text-[10px] font-sans font-bold hover:underline cursor-pointer"
          >
            Show All
          </button>
        </div>
      )}

      {/* Dynamic Pitches List Grid Container with motion staggered load animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="proposals-feed-list">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((prop) => {
            return (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-neutral-200/80 p-5 flex gap-4 hover:border-indigo-200 transition-all duration-200 shadow-xs relative"
                id={`proposal-card-${prop.id}`}
              >
                {/* Reddit-style Upvote counter */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => upvoteProposal(prop.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      prop.votedUp
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-500 hover:text-indigo-600'
                    }`}
                    title="Upvote solution path"
                    id={`upvote-btn-${prop.id}`}
                  >
                    <ArrowUp className={`w-4 h-4 transition-transform duration-150 ${prop.votedUp ? 'scale-110' : ''}`} />
                  </button>
                  <span className={`text-xs font-mono font-bold mt-1.5 ${prop.votedUp ? 'text-indigo-600' : 'text-neutral-500'}`}>
                    {prop.upvotes}
                  </span>
                </div>

                {/* Main Pitch Card Content Column */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {/* Header tags and Location indicators */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                      <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        prop.category === 'TypeInfrastructure'
                          ? 'text-[#047857] bg-emerald-50 border-emerald-100/60'
                          : prop.category === 'TypeCultural'
                          ? 'text-[#b45309] bg-amber-50 border-amber-100/60'
                          : 'text-purple-700 bg-purple-50 border-purple-100/60'
                      }`}>
                        {prop.category === 'TypeInfrastructure'
                          ? translateText('infrastructure')
                          : prop.category === 'TypeCultural'
                          ? translateText('cultural')
                          : translateText('policy')}
                      </span>

                      <span className="text-[9px] font-sans font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200/30 flex items-center gap-1 truncate max-w-[130px]" title={prop.locationName}>
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        {prop.locationName}
                      </span>
                    </div>

                    {/* Proposal Title */}
                    <h3 className="text-sm font-sans font-bold text-neutral-800 tracking-tight leading-snug hover:text-indigo-600 transition truncate-2-lines mb-2">
                      {prop.title[language] || prop.title['en']}
                    </h3>

                    {/* Description Paragraph */}
                    <p className="text-xs text-neutral-500 font-sans leading-relaxed truncate-3-lines mb-3">
                      {prop.description[language] || prop.description['en']}
                    </p>
                  </div>

                  {/* Pitch Author details and Footer tags block */}
                  <div className="border-t border-neutral-100 pt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="p-1 bg-neutral-100 text-neutral-500 rounded-full shrink-0">
                        <User className="w-3 h-3 text-neutral-400" />
                      </div>
                      <span className="text-[10px] font-sans text-neutral-400 truncate font-semibold" title={prop.author}>
                        {prop.author}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {prop.tags.map((tag, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-neutral-400 bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5 text-neutral-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-10 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
            <Compass className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs text-neutral-500 font-sans font-semibold">No pitches found fitting this spatial query</p>
            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">Try resetting the interactive map or broadening terms</p>
          </div>
        )}
      </div>
    </div>
  );
};
