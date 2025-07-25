// AI Service for Gemini API integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const detectLanguage = async (text: string): Promise<string> => {
  // Simple language detection based on character patterns
  const bengaliPattern = /[\u0980-\u09FF]/;
  const hindiPattern = /[\u0900-\u097F]/;
  const arabicPattern = /[\u0600-\u06FF]/;
  const chinesePattern = /[\u4e00-\u9fff]/;
  const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/;
  // German letters: a-z, A-Z plus umlauts and ß
  const germanPattern = /[a-zA-ZäöüÄÖÜß]/;

  if (bengaliPattern.test(text)) return 'Bengali';
  if (hindiPattern.test(text)) return 'Hindi';
  if (arabicPattern.test(text)) return 'Arabic';
  if (chinesePattern.test(text)) return 'Chinese';
  if (japanesePattern.test(text)) return 'Japanese';
  if (germanPattern.test(text)) return 'German';
  
  return 'English';
};


export const generateMedicalResponse = async (
  query: string,
  language: string
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return "API key not configured. Please add your Gemini API key to the environment variables.";
  }

  try {
    // Add variety to prompts to generate different response styles
    const promptVariations = [
      `You are a compassionate and knowledgeable medical assistant. Please:`,
      `As an experienced healthcare advisor, you should:`,
      `You are a professional medical consultant. Your task is to:`,
      `Acting as a trusted health information specialist, please:`,
      `You are a medical expert providing guidance. You must:`
    ];
    
    const responseStyles = [
      "Provide a comprehensive yet easy-to-understand explanation",
      "Give a detailed but accessible response",
      "Offer a thorough explanation with practical insights",
      "Present information in a clear and informative manner",
      "Deliver a well-structured and informative answer"
    ];
    
    const randomPrompt = promptVariations[Math.floor(Math.random() * promptVariations.length)];
    const randomStyle = responseStyles[Math.floor(Math.random() * responseStyles.length)];
    
    const medicalPrompt = `${randomPrompt}

1. ONLY respond to medical and health-related queries (diseases, symptoms, diagnostics, treatments, medications, anatomy, first aid, mental health, nutrition, wellness)
2. If the query is NOT medical/health-related, respond: "I am restricted to answering health-related questions only."
3. Respond in ${language} language
4. ${randomStyle} with accurate and professional medical information
5. Always include a disclaimer that this is for informational purposes and to consult healthcare professionals
6. Never generate assumed information beyond verified medical knowledge
7. Vary your response structure and approach while maintaining medical accuracy

User query: ${query}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: medicalPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.8 + (Math.random() * 0.2), // Random between 0.8-1.0 for more variety
        topK: 35 + Math.floor(Math.random() * 15), // Random between 35-50
        topP: 0.9 + (Math.random() * 0.1), // Random between 0.9-1.0
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I apologize, but I'm currently unable to process your request. Please try again later or consult with a healthcare professional directly.";
  }
};

export const logConversation = async (messages: any[]) => {
  // Optional: Implement MongoDB logging here
  // This would require backend API endpoints
  console.log('Conversation logged:', messages);
};