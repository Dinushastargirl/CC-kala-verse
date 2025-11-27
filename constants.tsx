
import { 
  PenTool, 
  Palette, 
  TrendingUp, 
  Video, 
  Languages, 
  Zap,
  Target, 
  Layers, 
  RefreshCcw,
  Smile,
  Layout,
  Image as ImageIcon,
  Type,
  BookOpen
} from 'lucide-react';
import { ToolDefinition, Post, Project, UserProfile } from './types';

// Using the logo provided by the user. Note: postimg direct links usually follow this pattern or similar.
// Falling back to the previous known good link structure if necessary, but attempting to use the user's ID.
export const LOGO_DESKTOP = "https://i.postimg.cc/8f5WksFT/KALAVERSE-1-removebg-preview.png"; 
export const LOGO_MOBILE = "https://i.postimg.cc/8f5WksFT/KALAVERSE-1-removebg-preview.png";

export const MOCK_USER: UserProfile = {
  name: "Alex Designer",
  email: "alex.designer@kalaverse.com",
  role: "Pro Member",
  avatar: "https://i.pravatar.cc/300?u=alex",
  bio: "Digital artist and brand strategist. Creating worlds with pixels and prompts. 🎨✨",
  location: "San Francisco, CA",
  website: "www.alexcreates.design",
  joinDate: "September 2023",
  stats: {
    projects: 142,
    followers: 8500,
    following: 340
  }
};

export const TOOLS: ToolDefinition[] = [
  // Creator Tools
  {
    id: 'trend-scanner',
    name: 'Trend Scanner',
    category: 'Creator',
    description: 'Discover trending keywords and engagement scores.',
    icon: TrendingUp,
    toolType: 'ai-gen',
    model: 'gemini-2.5-flash',
    inputs: [
      { name: 'topic', label: 'Topic or Category', type: 'text', placeholder: 'e.g. Sustainable Fashion' }
    ],
    systemPrompt: "You are a trend analysis expert. Analyze the given topic and provide a list of currently trending keywords, potential engagement scores (1-100), and brief reasoning for why they are trending. Output as a structured list."
  },
  {
    id: 'brand-voice',
    name: 'Brand Voice Transformer',
    category: 'Creator',
    description: 'Rewrite content to match a specific brand persona.',
    icon: PenTool,
    toolType: 'ai-gen',
    inputs: [
      { name: 'content', label: 'Original Content', type: 'textarea', placeholder: 'Paste your text here...' },
      { name: 'persona', label: 'Brand Persona', type: 'text', placeholder: 'e.g. Witty, Professional, Gen-Z' }
    ],
    systemPrompt: "Rewrite the provided content to strictly match the described brand persona. Maintain the core message but completely shift the tone, vocabulary, and style."
  },
  {
    id: 'script-gen',
    name: 'Script Generator',
    category: 'Creator',
    description: 'Create scene-by-scene video scripts.',
    icon: Video,
    toolType: 'ai-gen',
    model: 'gemini-3-pro-preview',
    inputs: [
      { name: 'type', label: 'Video Type', type: 'select', options: ['Instagram Reel', 'YouTube Long-form', 'TikTok', 'Commercial'] },
      { name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. New Coffee Blend Launch' },
      { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 30 seconds' }
    ],
    systemPrompt: "Generate a detailed video script. Include Scene Number, Visual Description, Audio/Dialogue, and estimated duration for each scene. Format clearly."
  },
  {
    id: 'lang-gen',
    name: 'Sinhala & Tamil Content',
    category: 'Creator',
    description: 'Localized content generator.',
    icon: Languages,
    toolType: 'ai-gen',
    inputs: [
      { name: 'idea', label: 'Content Idea (English)', type: 'textarea' },
      { name: 'language', label: 'Target Language', type: 'select', options: ['Sinhala', 'Tamil'] }
    ],
    systemPrompt: "Translate and culturally adapt the content idea into the target language. Ensure grammar, idioms, and cultural nuances are respected. Provide the output in the script or post format."
  },

  // Designer Tools
  {
    id: 'rgb-selector',
    name: 'RGB Color Selector',
    category: 'Designer',
    description: 'Get color codes and complementary suggestions.',
    icon: Palette,
    toolType: 'utility-color', // Special UI handler
    inputs: []
  },
  {
    id: 'magic-redesign',
    name: 'Magic Re-Designer',
    category: 'Designer',
    description: 'Get layout and hierarchy improvements.',
    icon: Zap,
    toolType: 'ai-gen',
    model: 'gemini-3-pro-preview',
    inputs: [
      { name: 'description', label: 'Describe current layout/design', type: 'textarea', placeholder: 'Header is top left, big hero image...' },
      { name: 'goal', label: 'Design Goal', type: 'text', placeholder: 'More modern, better conversion' }
    ],
    systemPrompt: "Act as a senior UI/UX Designer. Analyze the described layout and suggest specific improvements for hierarchy, typography, spacing, and visual flow to achieve the goal."
  },

  // Strategist Tools
  {
    id: 'swot-gen',
    name: 'SWOT Analysis',
    category: 'Strategist',
    description: 'Detailed Strengths, Weaknesses, Opportunities, Threats.',
    icon: Target,
    toolType: 'ai-gen',
    model: 'gemini-3-pro-preview',
    inputs: [
      { name: 'brand', label: 'Brand/Project Name', type: 'text' },
      { name: 'details', label: 'Key Details', type: 'textarea', placeholder: 'e.g. Small organic bakery in NYC...' }
    ],
    systemPrompt: "Conduct a comprehensive SWOT analysis for the brand based on the details provided. Be strategic and critical."
  },
  {
    id: 'campaign-blueprint',
    name: 'Campaign Blueprint',
    category: 'Strategist',
    description: 'Full campaign strategy from theme to deliverables.',
    icon: Layers,
    toolType: 'ai-gen',
    model: 'gemini-3-pro-preview',
    inputs: [
      { name: 'objective', label: 'Objective', type: 'text' },
      { name: 'audience', label: 'Target Audience', type: 'text' },
      { name: 'platforms', label: 'Platforms', type: 'text' }
    ],
    systemPrompt: "Create a Campaign Blueprint. Include: 1. Core Theme/Concept, 2. Storyline, 3. Key Deliverables, 4. Timeline Phases, 5. Call to Actions."
  },

  // Utility
  {
    id: 'winner-wheel',
    name: 'Winner Wheel',
    category: 'Utility',
    description: 'Spin the wheel to pick a winner.',
    icon: RefreshCcw,
    toolType: 'utility-wheel',
    inputs: [
        { name: 'names', label: 'Names (comma separated)', type: 'textarea' }
    ]
  },
  {
    id: 'flipbook-creator',
    name: 'Flipbook Creator',
    category: 'Utility',
    description: 'Create and share interactive photo flipbooks.',
    icon: BookOpen,
    toolType: 'utility-flipbook',
    inputs: []
  },
  {
    id: 'fake-comment',
    name: 'Fake Comment Gen',
    category: 'Utility',
    description: 'Generate realistic placeholder comments.',
    icon: Smile,
    toolType: 'ai-gen',
    inputs: [
      { name: 'topic', label: 'Post Topic', type: 'text' },
      { name: 'vibe', label: 'Vibe', type: 'select', options: ['Positive', 'Troll', 'Questioning', 'Mixed'] }
    ],
    systemPrompt: "Generate 5-10 realistic social media comments about the topic with the specified vibe. Include usernames and varied sentence structures."
  }
];

export const MOCK_PROJECTS: Project[] = [
    {
        id: 'p1',
        title: 'Summer Campaign 2024',
        thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
        lastEdited: '2 hours ago',
        type: 'Campaign'
    },
    {
        id: 'p2',
        title: 'Coffee Brand Identity',
        thumbnail: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop',
        lastEdited: '1 day ago',
        type: 'Branding'
    },
    {
        id: 'p3',
        title: 'Tech Talk Presentation',
        thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
        lastEdited: '3 days ago',
        type: 'Presentation'
    },
    {
        id: 'p4',
        title: 'Social Media Kit',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
        lastEdited: '1 week ago',
        type: 'Social'
    }
];

export const INITIAL_POSTS: Post[] = [
    {
        id: 'post1',
        user: {
            name: 'Sarah Jenks',
            avatar: 'https://i.pravatar.cc/150?u=sarah',
            role: 'Creative Director'
        },
        content: 'Just finished the new moodboard for the eco-friendly packaging project. The color palette from Kala Verse\'s RGB tool was a lifesaver! 🌿🎨',
        image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop',
        likes: 124,
        comments: 18,
        timestamp: '2h ago'
    },
    {
        id: 'post2',
        user: {
            name: 'David Chen',
            avatar: 'https://i.pravatar.cc/150?u=david',
            role: 'Strategist'
        },
        content: 'Anyone else experimenting with the new Gemini 3 Pro model for campaign blueprints? The depth of the SWOT analysis is mind-blowing. #AIStrategy #Marketing',
        likes: 89,
        comments: 42,
        timestamp: '5h ago'
    },
    {
        id: 'post3',
        user: {
            name: 'Priya Patel',
            avatar: 'https://i.pravatar.cc/150?u=priya',
            role: 'Content Creator'
        },
        content: 'Sharing a quick tip: Use the Brand Voice Transformer to repurpose your LinkedIn articles for Twitter/X. It keeps the core value but nails the snappy tone!',
        likes: 256,
        comments: 12,
        timestamp: '1d ago'
    }
];
