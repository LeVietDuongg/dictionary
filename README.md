# Modern React Application

A beautiful, production-ready React application built with Vite, TypeScript, Tailwind CSS, and Lucide React icons.

## Features

- 🚀 Lightning-fast development with Vite
- 🌐 Modern React with hooks and functional components
- 💅 Sleek UI design with Tailwind CSS
- 📱 Fully responsive layout
- 🔒 Secure API integration
- 🖌️ Beautiful iconography with Lucide React

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git](https://github.com/LeVietDuongg/dictionary.git
   
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Environment Setup:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and replace the placeholder values with your actual API keys:
     - `VITE_OPENAI_API_KEY`: Your OpenAI API key
     - `VITE_GOOGLE_API_KEY`: Your Google API key

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

Build the application for production:
```bash
npm run build
# or
yarn build
```

Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
project/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── config/       # Application configuration
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   ├── styles/       # Global styles
│   ├── utils/        # Utility functions
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Application entry point
├── .env.example      # Example environment variables
└── README.md         # Project documentation
```

## License

MIT

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
