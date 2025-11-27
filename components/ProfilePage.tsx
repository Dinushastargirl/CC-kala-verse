import React, { useState } from 'react';
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Mail, 
  Edit3, 
  Grid, 
  Heart,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile, Post, Project } from '../types';
import { MOCK_USER, MOCK_PROJECTS, INITIAL_POSTS } from '../constants';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'posts'>('overview');
  const user = MOCK_USER;

  return (
    <div className="h-full bg-light-bg dark:bg-dark-bg text-slate-900 dark:text-white pb-24 overflow-y-auto">
      
      {/* Banner */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <button className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md hover:bg-black/70 transition-colors">
             Change Banner
          </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
           <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-dark-bg bg-white overflow-hidden shadow-xl">
                 <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                 <Edit3 className="text-white" />
              </div>
           </div>
           
           <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-heading font-bold">{user.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">{user.role}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto md:mx-0">{user.bio}</p>
           </div>

           <div className="flex gap-3 mb-4 md:mb-2">
              <button className="px-6 py-2.5 bg-accent-purple text-white font-bold rounded-full shadow-lg shadow-purple-500/30 hover:bg-purple-600 transition-transform hover:scale-105">
                 Follow
              </button>
              <button className="px-6 py-2.5 bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 font-bold rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                 Message
              </button>
           </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className="col-span-1 md:col-span-3 space-y-6">
               
               {/* Stats Row */}
               <div className="flex justify-center md:justify-start gap-8 py-4 border-y border-gray-200 dark:border-gray-800">
                  <div className="text-center md:text-left">
                     <span className="block text-xl font-bold text-gray-900 dark:text-white">{user.stats.projects}</span>
                     <span className="text-xs text-gray-500 uppercase tracking-wider">Projects</span>
                  </div>
                  <div className="text-center md:text-left">
                     <span className="block text-xl font-bold text-gray-900 dark:text-white">{user.stats.followers}</span>
                     <span className="text-xs text-gray-500 uppercase tracking-wider">Followers</span>
                  </div>
                  <div className="text-center md:text-left">
                     <span className="block text-xl font-bold text-gray-900 dark:text-white">{user.stats.following}</span>
                     <span className="text-xs text-gray-500 uppercase tracking-wider">Following</span>
                  </div>
               </div>

               {/* Tabs */}
               <div className="flex border-b border-gray-200 dark:border-gray-800">
                  {['overview', 'projects', 'posts'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-6 py-4 font-bold text-sm capitalize border-b-2 transition-colors ${
                        activeTab === tab 
                          ? 'border-accent-pink text-accent-pink' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
               </div>

               {/* Tab Content */}
               <div className="min-h-[300px] animate-in fade-in duration-300">
                  {activeTab === 'overview' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                           <h3 className="font-bold mb-4 flex items-center gap-2">
                              <Grid className="text-accent-pink" size={20} />
                              Recent Work
                           </h3>
                           <div className="grid grid-cols-2 gap-2">
                              {MOCK_PROJECTS.slice(0,4).map(p => (
                                 <img key={p.id} src={p.thumbnail} className="w-full aspect-square object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer" />
                              ))}
                           </div>
                        </div>
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold mb-4">About</h3>
                            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                               <p>Passionate about bridging the gap between design and strategy. I love using AI tools to accelerate my workflow and generate wild ideas.</p>
                               <p>Specialties: Branding, UX/UI, Creative Direction.</p>
                            </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'projects' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                         {MOCK_PROJECTS.map(project => (
                            <div key={project.id} className="group cursor-pointer">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="font-bold">{project.title}</p>
                                        <p className="text-xs opacity-80">{project.type}</p>
                                    </div>
                                </div>
                            </div>
                         ))}
                      </div>
                  )}

                  {activeTab === 'posts' && (
                      <div className="space-y-6">
                         {INITIAL_POSTS.map(post => (
                             <div key={post.id} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <p className="mb-4 text-gray-800 dark:text-gray-200">{post.content}</p>
                                {post.image && (
                                    <img src={post.image} className="w-full h-64 object-cover rounded-xl mb-4" />
                                )}
                                <div className="flex gap-6 text-gray-500 text-sm">
                                    <span className="flex items-center gap-1"><Heart size={16} /> {post.likes}</span>
                                    <span className="flex items-center gap-1"><ImageIcon size={16} /> {post.comments}</span>
                                </div>
                             </div>
                         ))}
                      </div>
                  )}
               </div>

           </div>

           {/* Sidebar Info */}
           <div className="col-span-1 space-y-6">
               <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Details</h3>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                     <MapPin size={18} className="text-accent-purple" />
                     {user.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                     <LinkIcon size={18} className="text-accent-purple" />
                     <a href={`https://${user.website}`} target="_blank" className="hover:text-accent-pink hover:underline transition-colors">{user.website}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                     <Mail size={18} className="text-accent-purple" />
                     {user.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                     <Calendar size={18} className="text-accent-purple" />
                     Joined {user.joinDate}
                  </div>
               </div>

               <div className="bg-gradient-to-br from-accent-purple to-accent-blue p-6 rounded-2xl text-white shadow-lg">
                  <h3 className="font-bold mb-2">Upgrade to Pro</h3>
                  <p className="text-sm opacity-90 mb-4">Unlock premium AI models and unlimited storage.</p>
                  <button className="w-full py-2 bg-white text-accent-purple font-bold rounded-lg text-sm hover:bg-gray-100 transition-colors">
                     View Plans
                  </button>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};