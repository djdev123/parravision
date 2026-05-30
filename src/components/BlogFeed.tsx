import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { BlogPost, Language } from '../types';
import { Calendar, User, Tag, PlusCircle, Check, Image as ImageIcon, Send } from 'lucide-react';
import { motion } from 'motion/react';

export const BlogFeed: React.FC = () => {
  const { blogs, addBlogPost, language, translateText } = useCivic();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [success, setSuccess] = useState(false);

  // Extract all unique tags
  const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags)));

  // Filtered blogs
  const filteredBlogs = selectedTag 
    ? blogs.filter(blog => blog.tags.includes(selectedTag)) 
    : blogs;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // Build multilingual record duplicating content for fallback
    const titleRecord: Record<Language, string> = {
      en: title.trim(),
      zh: `[译自英文] ${title.trim()}`,
      hn: `[अंग्रेजी अनुवाद] ${title.trim()}`
    };

    const contentRecord: Record<Language, string> = {
      en: content.trim(),
      zh: `[翻译内容] ${content.trim()}`,
      hn: `[अनुवादित सामग्री] ${content.trim()}`
    };

    addBlogPost(
      titleRecord,
      contentRecord,
      author.trim() || 'Civic Neighbor',
      parsedTags.length > 0 ? parsedTags : ['Public Notice'],
      imgUrl.trim() || undefined
    );

    // Reset Form
    setTitle('');
    setContent('');
    setAuthor('');
    setTagsInput('');
    setImgUrl('');
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsSubmitOpen(false);
    }, 2500);
  };

  return (
    <div className="space-y-6" id="blog-feed-container">
      {/* Feed Filters & Compose Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="filters-header">
        <div className="flex flex-wrap items-center gap-1.5" id="blog-tags-filter">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs font-sans font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedTag === null
                ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
            }`}
          >
            All Updates
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`text-xs font-sans font-medium px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                tag === selectedTag
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </button>
          ))}
        </div>

        {/* Post announcement toggle trigger button */}
        <button
          onClick={() => setIsSubmitOpen(!isSubmitOpen)}
          className="text-xs font-sans font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-3.5 py-1.5 rounded-xl hover:bg-blue-100 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          Publish Update
        </button>
      </div>

      {/* Expandable announcement writer sheet */}
      {isSubmitOpen && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 animate-fade-in" id="blog-compose-sheet">
          <h3 className="text-sm font-sans font-bold text-neutral-800 mb-3.5 flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <PlusCircle className="w-4.5 h-4.5 text-blue-600" />
            Publish a Public Notice / Blog Post
          </h3>
          {success ? (
            <div className="bg-emerald-50 text-emerald-800 text-xs font-sans p-4 rounded-xl border border-emerald-100 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Broadcast Successful!</p>
                <p className="text-emerald-600/90 mt-0.5">Your civic bulletin has been safely posted to ParraVision\'s live news feed.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Riverwalk Path Closure or Shop opening"
                    className="w-full bg-neutral-50 hover:bg-neutral-100/30 text-xs font-sans px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Your Name / Office</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Parramatta Resident Alliance"
                    className="w-full bg-neutral-50 hover:bg-neutral-100/30 text-xs font-sans px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Content Body</label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide news details that will help your neighbours understand this update..."
                  className="w-full bg-neutral-50 hover:bg-neutral-100/30 text-xs font-sans px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Tags (separated by comma)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Community, Transit, Parks"
                    className="w-full bg-neutral-50 hover:bg-neutral-100/30 text-xs font-sans px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Unsplash / Image URL (optional)</label>
                  <input
                    type="url"
                    value={imgUrl}
                    onChange={(e) => setImgUrl(e.target.value)}
                    placeholder="Paste standard web image url"
                    className="w-full bg-neutral-50 hover:bg-neutral-100/30 text-xs font-sans px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1 border-t border-neutral-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="text-xs font-sans font-semibold px-4 py-2 hover:bg-neutral-100 text-neutral-500 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-sans font-semibold px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 shadow-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Broadcast Notice
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Blogs list items display */}
      <div className="grid grid-cols-1 gap-6" id="blogs-grid-list">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-10 bg-white border border-dashed rounded-2xl">
            <p className="text-neutral-400 text-xs font-sans font-medium">No bulletins published under this category filter.</p>
          </div>
        ) : (
          filteredBlogs.map(blog => (
            <article
              key={blog.id}
              className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden flex flex-col sm:flex-row group hover:border-neutral-300 transition-all"
              id={`blog-card-${blog.id}`}
            >
              {blog.imageUrl && (
                <div className="w-full sm:w-44 h-40 sm:h-auto overflow-hidden shrink-0 relative bg-neutral-100">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title[language]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Meta tag line details */}
                  <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono text-neutral-400 mb-2">
                    <span className="flex items-center gap-1 text-neutral-500">
                      <User className="w-3 h-3 text-neutral-400" />
                      {blog.author}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      {blog.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-sans font-bold text-neutral-800 group-hover:text-blue-600 transition-colors leading-snug">
                    {blog.title[language] || blog.title['en']}
                  </h3>

                  <p className="text-xs text-neutral-500 font-sans mt-2.5 leading-relaxed">
                    {blog.content[language] || blog.content['en']}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t border-neutral-50">
                  {blog.tags.map(tag => (
                    <span
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="text-[9px] font-bold font-sans text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200/50 hover:bg-neutral-200/50 hover:text-neutral-700 transition-all cursor-pointer flex items-center gap-0.5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
