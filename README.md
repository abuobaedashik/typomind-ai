# MedAssist AI - Multilingual Medical Assistant Chatbot

A sophisticated medical assistant chatbot built with React, TypeScript, and Google's Gemini AI that provides accurate health information with automatic language detection and multilingual support.

## Features

- 🤖 **AI-Powered Medical Assistant**: Uses Google Gemini API for accurate medical information
- 🌍 **Multilingual Support**: Automatic language detection and response in user's preferred language
- 💬 **Real-time Chat Interface**: Smooth, responsive chat experience with typing indicators
- 🔒 **Medical Scope Filtering**: Strictly limited to health-related queries only
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🛡️ **Safety First**: Built-in medical disclaimers and professional consultation reminders
- ⚡ **Fast Performance**: Optimized React components with TypeScript

## Tech Stack

- **Frontend**: React.js + TypeScript + Tailwind CSS
- **AI Engine**: Google Gemini API
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom medical theme

## Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for configuration

### 2. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## Supported Languages

The application automatically detects and responds in the following languages:
- English
- Bengali (বাংলা)
- Hindi (हिंदी)
- Arabic (العربية)
- Chinese (中文)
- Japanese (日本語)
- And many more through Gemini's language capabilities

## Usage Guidelines

### Medical Assistant Capabilities

The AI assistant can help with:
- ✅ Disease information and symptoms
- ✅ General treatment options
- ✅ Medication information
- ✅ Human anatomy questions
- ✅ First aid procedures
- ✅ Mental health support
- ✅ Nutrition and wellness advice
- ✅ Preventive healthcare

### Important Limitations

- ❌ Cannot provide specific medical diagnoses
- ❌ Cannot replace professional medical consultation
- ❌ Will not respond to non-medical queries
- ❌ Cannot prescribe medications or treatments

## Architecture

```
src/
├── components/
│   ├── ChatInterface.tsx    # Main chat component
│   ├── Header.tsx          # Application header
│   └── Sidebar.tsx         # Navigation and info sidebar
├── utils/
│   └── aiService.ts        # Gemini API integration
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles
```

## Security & Privacy

- All API calls are made client-side to Gemini API
- No personal health information is stored locally
- Optional chat logging can be implemented with MongoDB
- Built with privacy-first principles

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Ensure these environment variables are set in your production environment:
- `VITE_GEMINI_API_KEY`: Your Gemini API key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions regarding medical conditions.