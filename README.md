# StudySync

StudySync is an AI-powered study assistant that helps students interact with their study materials intelligently. Upload your documents and let StudySync help you understand, analyze, and learn from them effectively.

## Features

- **Secure Authentication**: Sign up and sign in with email/password
- **Document Management**: Upload and organize your study materials
- **Document Preview**: View your documents directly in the browser
- **AI Chat**: Interact with your documents using natural language (Coming Soon)
- **Smart Study Tools**: Generate study guides and quizzes (Coming Soon)

## Tech Stack

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Storage, Database)
- **AI**: OpenAI GPT-3.5 (Coming Soon)
- **Styling**: shadcn/ui components

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/studysync.git
cd studysync
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
├── components/            
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form-related components
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
├── lib/                   # Utility functions and shared logic
├── services/              # External service integrations
└── styles/                # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
