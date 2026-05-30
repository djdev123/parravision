import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { motion, AnimatePresence } from 'motion/react';
import { Vote, CheckCircle2, Award, Users, RefreshCw } from 'lucide-react';

export const PulsePolls: React.FC = () => {
  const { polls, votePoll, language, translateText } = useCivic();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleVote = (pollId: string, optionId: string) => {
    votePoll(pollId, optionId);
    
    // Show instant micro-acknowledgment toast
    setSuccessToast(pollId);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-6" id="pulse-polls-list">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-50 text-blue-600 rounded-lg">
            <Vote className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-sans font-semibold text-neutral-800 tracking-tight">
            {translateText('pulsePolling')}
          </h2>
        </div>
        <span className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-neutral-400" />
          Realtime Tally Active
        </span>
      </div>

      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-sans font-medium flex items-center gap-2 shadow-xs"
            id="vote-success-banner"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>{translateText('successMessage')} Your voice shapes Parramatta's budget priorities.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="polls-grid-layout">
        {polls.map((poll) => {
          const hasVoted = !!poll.votedOptionId;

          return (
            <div
              key={poll.id}
              className={`bg-white rounded-2xl border ${
                hasVoted ? 'border-blue-100 bg-linear-to-b from-white to-blue-50/5' : 'border-neutral-200/80 shadow-xs'
              } p-5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
              id={`poll-card-${poll.id}`}
            >
              {/* Category Indicator Accent */}
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  poll.category === 'TypePolicy' 
                    ? 'text-purple-600 bg-purple-50 border border-purple-100' 
                    : 'text-amber-600 bg-amber-50 border border-amber-100'
                }`}>
                  {poll.category === 'TypePolicy' ? translateText('policy') : translateText('cultural')}
                </span>
                
                <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                  <RefreshCw className="w-2.5 h-2.5" />
                  {poll.date}
                </span>
              </div>

              {/* Poll Question */}
              <h3 className="text-sm font-sans font-medium text-neutral-800 leading-relaxed mb-4 flex-1">
                {poll.question[language] || poll.question['en']}
              </h3>

              {/* Options Section */}
              <div className="space-y-2.5 mt-auto">
                {poll.options.map((option) => {
                  const isThisVoted = poll.votedOptionId === option.id;
                  const ratio = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                  const displayPercentage = Math.round(ratio);

                  return (
                    <div key={option.id} className="relative odd-sibling" id={`poll-opt-${option.id}`}>
                      {hasVoted ? (
                        // Results view state with custom styled motion bars
                        <div
                          className={`w-full overflow-hidden rounded-xl border p-3 flex justify-between items-center relative transition-all duration-300 ${
                            isThisVoted ? 'bg-blue-100/30 border-blue-200' : 'bg-neutral-50 border-neutral-100'
                          }`}
                        >
                          {/* Animated background bar fill using standard css & motion properties for safety */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${displayPercentage}%` }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className={`absolute top-0 bottom-0 left-0 ${
                              isThisVoted ? 'bg-blue-500/10' : 'bg-neutral-200/25'
                            } z-0`}
                          />

                          <div className="flex items-center gap-2.5 z-10 truncate pr-4">
                            {isThisVoted ? (
                              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-neutral-300 shrink-0 bg-transparent" />
                            )}
                            <span className={`text-xs font-sans truncate ${isThisVoted ? 'text-blue-800 font-semibold' : 'text-neutral-500'}`}>
                              {option.text[language]}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 z-10 shrink-0">
                            <span className="text-[10px] font-mono text-neutral-400">
                              ({option.votes.toLocaleString()})
                            </span>
                            <span className={`text-xs font-mono font-bold ${isThisVoted ? 'text-blue-700' : 'text-neutral-600'}`}>
                              {displayPercentage}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        // Live voting clickable button states
                        <button
                          onClick={() => handleVote(poll.id, option.id)}
                          className="w-full text-left font-sans text-xs font-medium text-neutral-700 p-3 bg-neutral-50 border border-neutral-200 rounded-xl hover:bg-neutral-100/70 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-150 flex items-center justify-between cursor-pointer active:scale-98"
                        >
                          <span>{option.text[language]}</span>
                          <span className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center text-transparent hover:border-blue-500 hover:text-blue-500 transition-all">
                            ✓
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Poll Summary Footer */}
              <div className="mt-4 border-t border-neutral-100 pt-3 flex items-center justify-between text-[10px] font-sans text-neutral-400">
                <span className="flex items-center gap-1">
                  <Vote className="w-3.5 h-3.5 text-neutral-400" />
                  {poll.totalVotes.toLocaleString()} {translateText('totalVotes')}
                </span>
                {hasVoted && (
                  <span className="text-blue-600 font-bold flex items-center gap-0.5">
                    <Award className="w-3.5 h-3.5 text-blue-500" />
                    {translateText('voted')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
