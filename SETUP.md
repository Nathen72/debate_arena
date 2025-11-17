# Setup Instructions

## Quick Start

1. **Install Tailwind CSS**
   ```bash
   bun add -d tailwindcss@3.4.15
   ```

2. **Install dependencies** (if not already done)
   ```bash
   bun install
   ```

3. **Set up your API key**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your API key:
   ```env
   VITE_OPENAI_API_KEY=sk-your-key-here
   # or
   VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

4. **Start the development server**
   ```bash
   bun dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000`

## Troubleshooting

If you encounter build errors:

1. Make sure Tailwind CSS v3 is installed:
   ```bash
   bun pm ls tailwindcss
   ```

2. If not, install it:
   ```bash
   bun add -d tailwindcss@3.4.15
   ```

3. Clear node_modules and reinstall if needed:
   ```bash
   rm -rf node_modules bun.lockb
   bun install
   bun add -d tailwindcss@3.4.15
   ```

## Building for Production

```bash
bun run build
```

The output will be in the `dist/` directory.
