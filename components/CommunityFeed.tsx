import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, MoreHorizontal, X } from 'lucide-react';
import { INITIAL_POSTS } from '../constants';
import { Post } from '../types';

export const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Mock image upload trigger
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Create a fake local URL for preview
      const url = URL.createObjectURL(e.target.files[0]);
      setSelectedImage(url);
    }
  };

  const handlePost = () => {
    if (!newPostContent.trim() && !selectedImage) return;

    const newPost: Post = {
        id: Date.now().toString(),
        user: {
            name: 'You',
            avatar: 'https://i.pravatar.cc/150?u=you',
            role: 'Creator'
        },
        content: newPostContent,
        image: selectedImage || undefined,
        likes: 0,
        comments: 0,
        timestamp: 'Just now'
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedImage(null);
  };

  const toggleLike = (id: string) => {
    setPosts(posts.map(post => {
        if (post.id === id) {
            return {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1
            };
        }
        return post;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
            <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white tracking-tight">
                Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple">Hub</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
                Connect, share, and inspire fellow creators in the Kala Verse.
            </p>
        </div>

        {/* Create Post Widget */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 transition-all focus-within:ring-2 ring-accent-purple/20">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple p-0.5 flex-shrink-0">
                     <img src="https://i.pravatar.cc/150?u=you" alt="You" className="w-full h-full rounded-full object-cover border-2 border-white dark:border-dark-bg" />
                </div>
                <div className="flex-1 space-y-4">
                    <textarea 
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share your latest design, thoughts, or ask for feedback..." 
                        className="w-full bg-transparent border-none outline-none resize-none text-lg min-h-[80px] placeholder:text-gray-400 text-gray-800 dark:text-gray-100"
                    />
                    
                    {/* Image Preview */}
                    {selectedImage && (
                        <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100 dark:bg-black/20 group">
                            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-accent-pink transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="flex gap-2">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageSelect}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 hover:text-accent-purple hover:bg-accent-purple/10 transition-colors"
                            >
                                <ImageIcon size={20} />
                                <span className="font-medium text-sm">Add Image</span>
                            </button>
                        </div>
                        <button 
                            onClick={handlePost}
                            disabled={!newPostContent.trim() && !selectedImage}
                            className="px-8 py-2.5 bg-accent-purple text-white font-bold rounded-full hover:bg-purple-600 disabled:opacity-50 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
            {posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Header */}
                    <div className="p-5 flex justify-between items-start">
                        <div className="flex gap-4">
                             <div className="relative">
                                 <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-full object-cover" />
                                 <div className="absolute -bottom-1 -right-1 bg-accent-purple text-[10px] text-white px-1.5 py-0.5 rounded-full border border-white dark:border-dark-surface font-bold">PRO</div>
                             </div>
                             <div>
                                 <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{post.user.name}</h3>
                                 <p className="text-sm text-gray-500">{post.user.role} • {post.timestamp}</p>
                             </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-5 pb-4">
                        <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed text-[15px]">
                            {post.content}
                        </p>
                    </div>

                    {/* Image Attachment */}
                    {post.image && (
                        <div className="w-full max-h-[500px] bg-gray-100 dark:bg-black/20 overflow-hidden">
                             <img src={post.image} alt="Post attachment" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="p-4 px-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-gray-500">
                        <div className="flex gap-8">
                            <button 
                                onClick={() => toggleLike(post.id)}
                                className={`flex items-center gap-2 transition-all hover:scale-110 ${post.liked ? 'text-accent-pink' : 'hover:text-accent-pink'}`}
                            >
                                <Heart size={22} fill={post.liked ? "currentColor" : "none"} />
                                <span className="font-bold">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-accent-purple transition-all hover:scale-110">
                                <MessageCircle size={22} />
                                <span className="font-bold">{post.comments}</span>
                            </button>
                        </div>
                        <button className="hover:text-accent-blue transition-all hover:scale-110">
                            <Share2 size={22} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};