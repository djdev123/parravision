import React, { useState, useEffect } from 'react';
import { useCivic } from '../context/CivicContext';
import { Language } from '../types';
import { MessageSquare, Heart, PlusCircle, Tag, Search, User, Calendar, Check, Send, Sparkles, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface CommPost {
  id: string;
  title: Record<Language, string>;
  category: 'event' | 'initiative' | 'alert' | 'general';
  content: Record<Language, string>;
  author: string;
  date: string;
  likes: number;
  liked: boolean;
  replies: Array<{ author: string, content: string, date: string }>;
}

const INITIAL_COMMUNITY_POSTS: CommPost[] = [
  {
    id: 'comm-1',
    title: {
      en: 'Dharug Flora Walk & Community Picnic',
      zh: '达鲁格植物认知步道与社区野餐会',
      hn: 'धारुग वनस्पति यात्रा और सामुदायिक पिकनिक'
    },
    category: 'event',
    content: {
      en: 'Join us this Saturday of May at Parramatta Park near the riverfront. We will explore native Dharug edible flora, discuss ancient environmental management techniques, and enjoy a shared picnic lunch. Everyone is welcome!',
      zh: '本周六在帕拉马塔河畔公园集合！我们将一同探索澳洲本土达鲁格可食用植物，探讨古代生态环境管理智慧，并进行轻松的社区合作野餐。期待大家的光临！',
      hn: 'इस शनिवार को पैरामाटा नदी के किनारे हमारे साथ जुड़ें। हम पारंपरिक धारुग पौधों और उनसे जुड़ी भोजन आदतों के बारे में जानेंगे और पिकनिक का आनंद लेंगे।'
    },
    author: 'Julie Rose (Dharug Educator)',
    date: '2026-05-30',
    likes: 24,
    liked: false,
    replies: [
      { author: 'Elena G.', content: 'This sounds amazing, can I bring my kids along?', date: '1 hour ago' }
    ]
  },
  {
    id: 'comm-2',
    title: {
      en: 'Volunteer Clean-up Drive: River Foreshore',
      zh: '河滨长廊志愿者环境清理活动招募',
      hn: 'स्वयंसेवक सफाई अभियान: नदी तट'
    },
    category: 'initiative',
    content: {
      en: 'Let’s keep our new Floating Wetlands pristine! Meet us behind the Wharf at 8:00 AM on Sunday. Gloves, litter claws, and light refreshments will be provided by local civic sponsors. Let’s protect our micro-bats together.',
      zh: '让新建的漂浮生态浮岛工程与河滨保持纯净！本周日上午8点在码头广场后集合。当天气候凉爽，我们提供手套、垃圾夹和免费简便茶点，助力拯救我们的河流和微型蝙蝠。',
      hn: 'आइए नए फ्लोटिंग वेटलैंड्स और नदी तट की सफाई करें! रविवार सुबह 8:00 बजे घाट के पीछे मिलें। नगर परिषद द्वारा दस्ताने और अल्पाहार की व्यवस्था की जाएगी।'
    },
    author: 'River Friends Coalition',
    date: '2026-05-29',
    likes: 18,
    liked: false,
    replies: []
  },
  {
    id: 'comm-3',
    title: {
      en: 'Late Night Acoustic Session at Eat Street',
      zh: '教堂街深夜“原声音乐角”即兴吉他弹唱',
      hn: 'ईट स्ट्रीट पर देर रात ध्वनिक संगीत सत्र'
    },
    category: 'event',
    content: {
      en: 'We are testing out the newly proposed low-decibel acoustic zones! I will be performing classical Spanish guitar near the lane-way exit after 8:30 PM this Friday. Come grab a gelato and support local live performances!',
      zh: '让我们抢先体验拟议中的常态低噪声原声音乐角吧！本周五晚上8:30后，我将在巷尾即兴弹奏西班牙古典吉他。欢迎捧场支持，享受晚风和冰淇淋！',
      hn: 'हम नव प्रस्तावित कम-डेसिबल संगीत क्षेत्र का परीक्षण कर रहे हैं! मैं इस शुक्रवार रात 8:30 बजे के बाद स्पेनिश गिटार बजाऊंगा। आकर स्थानीय कलाकारों का समर्थन करें।'
    },
    author: 'Leo Alvarez',
    date: '2026-05-28',
    likes: 31,
    liked: false,
    replies: [
      { author: 'Taste of Parra', content: 'Fantastic! We will set up extra outdoor seating nearby.', date: '1 day ago' }
    ]
  }
];

export const CommunityBlog: React.FC = () => {
  const { language } = useCivic();
  const [posts, setPosts] = useState<CommPost[]>(() => {
    try {
      const saved = localStorage.getItem('parravision_community_posts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load community posts:", e);
    }
    return INITIAL_COMMUNITY_POSTS;
  });

  const [activeCategory, setActiveCategory] = useState<'all' | 'event' | 'initiative' | 'alert' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Submit Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'event' | 'initiative' | 'alert' | 'general'>('general');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [success, setSuccess] = useState(false);

  // Sync back to local storage
  useEffect(() => {
    try {
      localStorage.setItem('parravision_community_posts', JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  const handleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            likes: p.liked ? p.likes - 1 : p.likes + 1,
            liked: !p.liked
          };
        }
        return p;
      })
    );
  };

  const handleAddReply = (id: string, authorName: string, replyText: string) => {
    if (!replyText.trim()) return;
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            replies: [...p.replies, { author: authorName || 'Neighbor', content: replyText.trim(), date: 'Just now' }]
          };
        }
        return p;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // Multilingual support: duplicate content as fallbacks
    const titleRecord: Record<Language, string> = {
      en: title.trim(),
      zh: `[民情反馈] ${title.trim()}`,
      hn: `[सामुदायिक फ़ीड] ${title.trim()}`
    };

    const contentRecord: Record<Language, string> = {
      en: content.trim(),
      zh: content.trim(),
      hn: content.trim()
    };

    const newPost: CommPost = {
      id: `comm-post-${Date.now()}`,
      title: titleRecord,
      category,
      content: contentRecord,
      author: author.trim() || 'Civic Resident',
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      liked: false,
      replies: []
    };

    setPosts(prev => [newPost, ...prev]);
    setTitle('');
    setContent('');
    setAuthor('');
    setCategory('general');
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsFormOpen(false);
    }, 2000);
  };

  // Filtered posts calculation
  const filtered = posts.filter(p => {
    const titleText = (p.title[language] || p.title['en'] || '').toLowerCase();
    const contentText = (p.content[language] || p.content['en'] || '').toLowerCase();
    const matchesSearch = titleText.includes(searchQuery.toLowerCase()) || contentText.includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="community-blog-dashboard">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 shadow-2xs">
        <div>
          <h2 className="text-sm font-sans font-extrabold text-blue-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 fill-blue-100" />
            Parramatta Citizen Community Blog
          </h2>
          <p className="text-[11px] font-sans text-blue-700/80 mt-1 max-w-md md:max-w-lg leading-relaxed">
            The civic square for real neighborhood notices, grass-root initiatives, sports meetings, and street events around Parramatta.
          </p>
        </div>
        
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="text-xs font-sans font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center shrink-0"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          Create Community Post
        </button>
      </div>

      {/* Interactive Quick-Post overlay Drawer */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in" id="community-compose-form">
          <h3 className="text-sm font-sans font-bold text-neutral-800 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-1.5">
            <PlusCircle className="w-4.5 h-4.5 text-blue-600 animate-pulse" />
            Publish to Community Blog Feed
          </h3>

          {success ? (
            <div className="bg-emerald-50 text-emerald-800 text-xs font-sans p-4 rounded-xl border border-emerald-100 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Community Post Live!</p>
                <p className="text-emerald-700 mt-0.5">Your neighbors will see this notice directly on the public community scroll.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Post Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Parramatta Park Saturday stargazing"
                    className="w-full bg-neutral-50 hover:bg-neutral-100/30 text-xs font-sans px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-neutral-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Notice Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-neutral-50 hover:bg-neutral-100/30 text-xs font-sans px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-neutral-700 cursor-pointer"
                  >
                    <option value="general">💬 General Chit-Chat</option>
                    <option value="event">📅 Local Event</option>
                    <option value="initiative">🌱 Green Initiative</option>
                    <option value="alert">⚠️ Safety Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Tell your neighbors (English/Dharug welcome!)</label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share detail, meeting links or instructions so local residents can get involved..."
                  className="w-full bg-neutral-50 hover:bg-neutral-100/30 text-xs font-sans px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-neutral-800"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Your Name / Local Group</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Block C Resident, Street Coordinator..."
                  className="w-full bg-neutral-50 hover:bg-neutral-100/30 text-xs font-sans px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-neutral-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs font-sans font-semibold px-4 py-2 hover:bg-neutral-100 text-neutral-500 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-sans font-semibold px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 shadow-xs rounded-xl transition-all cursor-pointer"
                >
                  Publish Publicly
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Advanced search/filtering interface */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-neutral-50/50 p-3 rounded-xl border border-neutral-200/50" id="search-filter-belt">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search neighborhood board by keyword..."
            className="w-full bg-white text-xs font-sans pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-800 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-1 items-center" id="filter-pill-grid">
          <Filter className="w-3.5 h-3.5 text-neutral-400 mr-1 shrink-0" />
          {(['all', 'event', 'initiative', 'alert', 'general'] as const).map(cat => {
            const labelMap: Record<string, string> = {
              all: 'All',
              event: 'Events',
              initiative: 'Initiatives',
              alert: 'Alerts',
              general: 'General'
            };
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-sans font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer capitalize ${
                  activeCategory === cat
                    ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                    : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
                }`}
              >
                {labelMap[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stream of citizen entries */}
      <div className="grid grid-cols-1 gap-4" id="community-bulletin-list">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-neutral-200 flex flex-col items-center justify-center">
            <MessageSquare className="w-8 h-8 text-neutral-300 mb-2 animate-pulse" />
            <p className="text-xs text-neutral-400 font-sans font-semibold">No community posts match your criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="text-[10px] text-blue-600 font-bold font-sans mt-1.5 underline hover:text-blue-700"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          filtered.map(post => {
            // Pick coloring depending on category
            const colorClassMap = {
              event: 'border-l-4 border-l-purple-500',
              initiative: 'border-l-4 border-l-emerald-500',
              alert: 'border-l-4 border-l-rose-500 bg-rose-50/10',
              general: 'border-l-4 border-l-neutral-400'
            };

            const tagLabelMap = {
              event: '📅 Event',
              initiative: '🌱 Green Initiative',
              alert: '⚠️ Safety Warning',
              general: '💬 General Board'
            };

            return (
              <article
                key={post.id}
                className={`bg-white rounded-2xl border border-neutral-200/80 shadow-2xs p-5 transition-all hover:border-neutral-300 ${colorClassMap[post.category]}`}
              >
                {/* Upper line */}
                <div className="flex items-center justify-between gap-2.5 mb-2.5">
                  <span className="text-[10px] font-sans font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200/50">
                    {tagLabelMap[post.category]}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                    <Calendar className="w-3.5 h-3.5 text-neutral-300" />
                    <span>{post.date}</span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-sans font-black text-neutral-800 tracking-tight leading-snug">
                  {post.title[language] || post.title['en']}
                </h3>

                <p className="text-xs text-neutral-600 font-sans mt-2.5 leading-relaxed whitespace-pre-wrap">
                  {post.content[language] || post.content['en']}
                </p>

                {/* Bottom row: author, likes, comments button */}
                <div className="mt-4 pt-3 border-t border-neutral-100/70 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-sans text-neutral-400 flex items-center gap-1 capitalize font-medium">
                    <User className="w-3 h-3 text-neutral-300" />
                    Posted by <strong className="text-neutral-600 font-semibold">{post.author}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Reaction button */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-sans font-black flex items-center gap-1 transition-all cursor-pointer ${
                        post.liked 
                          ? 'bg-rose-50 border-rose-200 text-rose-600 font-black' 
                          : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${post.liked ? 'text-rose-600 fill-rose-600' : 'text-neutral-400'}`} />
                      <span>{post.likes}</span>
                    </button>
                  </div>
                </div>

                {/* Simple comment sub-session */}
                {post.replies && post.replies.length > 0 && (
                  <div className="mt-3.5 bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-2">
                    {post.replies.map((rep, idx) => (
                      <div key={idx} className="text-[11px] font-sans text-neutral-600 leading-normal border-b last:border-0 border-neutral-200/50 pb-2 last:pb-0">
                        <span className="font-bold text-neutral-700 mr-1.5">{rep.author}:</span>
                        <span>{rep.content}</span>
                        <span className="text-[9px] font-mono text-neutral-400 ml-2">({rep.date})</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Micro input to place a reply right now */}
                <div className="mt-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const replyText = fd.get('reply') as string;
                      if (!replyText) return;
                      handleAddReply(post.id, 'Visitor', replyText);
                      e.currentTarget.reset();
                    }}
                    className="flex gap-1.5"
                  >
                    <input
                      name="reply"
                      type="text"
                      placeholder="Type a quick reply to this post..."
                      className="flex-1 bg-neutral-50 hover:bg-neutral-100/30 text-[10px] font-sans px-3 py-1.5 rounded-lg border border-neutral-200/60 focus:outline-none focus:ring-1 focus:ring-blue-400 text-neutral-800"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-[10px] font-sans font-bold flex items-center justify-center border border-neutral-200 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                </div>

              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
