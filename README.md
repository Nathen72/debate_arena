# 🎭 Debate Arena

**Where ideas collide and perspectives emerge**

A beautifully designed debate platform powered by AI, where users can explore different perspectives on any topic through structured debates between AI-generated expert personas.

![Vintage Aesthetic](https://img.shields.io/badge/style-vintage-orange?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge)
![Built with React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)

## ✨ Features

### 🤖 AI-Powered Debates
- Generate 3-5 unique expert personas for any debate topic
- Each expert has distinct personality, background, and position
- Powered by OpenAI GPT-4 or Anthropic Claude via Vercel AI SDK

### 🎨 Beautiful Design
- Vintage/whimsical aesthetic inspired by [Tavus](https://tavus.io) and [PostHog](https://posthog.com)
- Smooth animations with Framer Motion
- Responsive design with Tailwind CSS
- Custom color palette with paper texture effects

### 📊 Structured Debate Format
1. **Opening Statements** - Experts introduce their positions
2. **Main Arguments** - Core reasoning and evidence
3. **Rebuttals** - Addressing opposing viewpoints
4. **Closing Statements** - Final thoughts and conclusions

### 🗳️ Interactive Voting
- Vote for the most convincing expert
- See real-time voting results
- Save debates to local history

### 🎯 Preset & Custom Topics
- 8+ curated debate topics across various categories
- Create your own custom debate topics
- Searchable topic library

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- An API key from either:
  - [OpenAI](https://platform.openai.com/api-keys) (recommended)
  - [Anthropic](https://console.anthropic.com/settings/keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nathen72/debate_arena.git
   cd debate_arena
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or: npm install
   ```

3. **Configure API keys**

   Copy the example environment file and add your API key:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add at least one API key:
   ```env
   # Choose one or both:
   VITE_OPENAI_API_KEY=sk-...your-key-here
   VITE_ANTHROPIC_API_KEY=sk-ant-...your-key-here

   # Optional: Set default provider (openai or anthropic)
   VITE_DEFAULT_AI_PROVIDER=openai
   ```

4. **Start development server**
   ```bash
   bun dev
   # or: npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000`

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Lucide React** - Icons

### AI & Backend
- **Vercel AI SDK** - Unified AI interface
- **OpenAI GPT-4** - Text generation
- **Anthropic Claude** - Alternative AI provider

### Storage
- **LocalStorage** - Debate history persistence
- **Zustand Persist** - State persistence

## 📖 Usage

### Starting a Debate

1. **Choose a topic** from the preset library or create your own
2. **Wait for experts** to be generated (3-5 AI personas with unique perspectives)
3. **Watch the debate** unfold through structured rounds
4. **Vote** for the most convincing expert
5. **Review results** and see how others voted

### Debate Flow

The debate progresses through four rounds, with each expert speaking in turn:

```
Opening Statements → Main Arguments → Rebuttals → Closing Statements → Voting
```

Click "Continue" to advance through each expert's response.

## 🎨 Design Philosophy

Debate Arena features a **vintage/whimsical aesthetic** with:

- **Color Palette**: Warm creams, tans, and browns with vibrant accent colors
- **Typography**: Fraunces for display, Inter for body text
- **Animations**: Subtle floats, smooth transitions, and playful interactions
- **Texture**: Paper-like background with subtle grain effect
- **Cards**: Rounded corners with soft shadows and border effects

## 🏗️ Project Structure

```
debate_arena/
├── src/
│   ├── components/         # React components
│   │   ├── TopicSelection.tsx
│   │   ├── ExpertGeneration.tsx
│   │   ├── ExpertCard.tsx
│   │   ├── DebateView.tsx
│   │   ├── DebateMessage.tsx
│   │   └── VotingPanel.tsx
│   ├── lib/               # Utilities & services
│   │   ├── ai-service.ts  # AI SDK integration
│   │   ├── preset-topics.ts
│   │   └── utils.ts
│   ├── stores/            # Zustand stores
│   │   └── debateStore.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── styles/            # Global styles
│   │   └── index.css
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## 🔧 Configuration

### AI Provider Selection

The app automatically uses the first available API key. To explicitly set a provider:

```env
VITE_DEFAULT_AI_PROVIDER=openai  # or: anthropic
```

### Customizing Topics

Edit `src/lib/preset-topics.ts` to add or modify preset debate topics:

```typescript
{
  id: 'my-topic',
  title: 'Your Debate Title',
  description: 'A brief description of the debate',
  category: 'Your Category',
}
```

### Styling

The design system is configured in `tailwind.config.js`. Customize:
- Colors in `theme.extend.colors`
- Fonts in `theme.extend.fontFamily`
- Animations in `theme.extend.animation`

## 📦 Building for Production

```bash
bun run build
# or: npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
bun run preview
# or: npm run preview
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Build the project: `bun run build`
2. Deploy the `dist/` directory to Netlify
3. Add environment variables in Netlify dashboard

### Other Platforms

Deploy the `dist/` folder to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- etc.

## 🤝 Contributing

Contributions are welcome! Please follow the guidelines in [CLAUDE.md](./CLAUDE.md).

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Follow conventional commits: `feat: add new feature`
4. Push and create a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from [Tavus](https://tavus.io) and [PostHog](https://posthog.com)
- Powered by [Vercel AI SDK](https://sdk.vercel.ai)
- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/Nathen72/debate_arena/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Nathen72/debate_arena/discussions)

---

**Built with ❤️ and AI**
