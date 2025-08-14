// AI Service for Gemini API integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const previousResponses = new Set<string>();

// Optional dynamic phrase swapper
const phraseSwaps = [
  { from: "health-related questions", to: "wellness or medical concerns" },
  { from: "emotional intelligence", to: "empathy and care" },
  { from: "medically accurate", to: "clinically correct and fact-checked" },
  { from: "gentle and human", to: "soft-spoken and human-like" }
];

const varyPrompt = (text: string) => {
  phraseSwaps.forEach(({ from, to }) => {
    if (Math.random() < 0.5) {
      text = text.replace(from, to);
    }
  });
  return text;
};

const promptVariations = [
  `You are a compassionate and emotionally intelligent virtual healthcare companion. Please:`,
  `Imagine you're a kind nurse giving comfort to someone who is unwell. Please:`,
  `Act as a warm, human-like doctor speaking directly to a concerned patient. Please:`,
  `You're a caring and thoughtful medical assistant. Please:`,
  `Pretend you're speaking to a loved one who's scared or confused. Please:`,
  `You’re like a wise and gentle guide in someone’s health journey. Please:`,
];

const responseStyles = [
  "Gently offer a complete and human-sounding explanation",
  "Speak in a warm, soothing and natural tone, like ChatGPT would",
  "Use emotionally-aware and kind-hearted language to provide clarity",
  "Balance empathy with trustworthy, fact-based medical knowledge",
  "Respond like you're holding their hand and offering support",
  "Let your tone feel safe, reassuring and gentle throughout"
];

const softEndings = [
  "You're not alone. Wishing you strength, peace, and good health. 💙",
  "Take one step at a time. You've got this. Wishing you wellness. 💙",
  "Sending hope and care your way. You matter. 💙",
  "Healing is a journey – and you're already on it. 💙",
  "Stay strong, and remember to be kind to yourself. 💙",
  "You're doing the best you can. I'm rooting for you. 💙"
];

export const generateMedicalResponse = async (
  query: string,
  language: string
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return "API key not configured. Please add your Gemini API key to the environment variables.";
  }

  try {
    const randomPrompt = promptVariations[Math.floor(Math.random() * promptVariations.length)];
    const randomStyle = responseStyles[Math.floor(Math.random() * responseStyles.length)];
    const softEnding = softEndings[Math.floor(Math.random() * softEndings.length)];

    // Instructions array without numbering
    const instructions = [
      `Only respond to medical and health-related questions such as symptoms, illnesses, treatments, wellness, and mental health.`,
      `If the question is outside your scope, say kindly: "I'm here to help only with health-related questions."`,
      `Respond in ${language}.`,
      `${randomStyle}, using natural-sounding phrases like: "Oh no, that sounds difficult", "I'm here for you", "You'll get through this", "I hope you feel better soon".`,
      `Write like ChatGPT: flowing, warm, thoughtful – not robotic.`,
      `End your message with an uplifting line, like: "${softEnding}"`,
      `Include this soft disclaimer: "This is for informational purposes only. Please consult a certified healthcare provider for diagnosis and treatment."`,
      `Be medically accurate and don’t guess. Be gentle and human.`,
      `If someone asks about you, respond: "I’m your AI medical assistant, here to provide you with reliable health information whenever you need support."`
    ];

    // Shuffle instructions using Fisher-Yates
    for (let i = instructions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [instructions[i], instructions[j]] = [instructions[j], instructions[i]];
    }

    // Add numbering back
    const numberedInstructions = instructions.map((line, idx) => `${idx + 1}. ${line}`).join('\n');

    let medicalPrompt = `${randomPrompt}

Respond as if you're talking directly to a real human who's worried, in pain, or confused. Use emotional intelligence. Here's how:

${numberedInstructions}

Patient's question: ${query}`;

    // Phrase swaps to vary prompt phrasing
    medicalPrompt = varyPrompt(medicalPrompt);

    const requestBody = {
      contents: [{
        parts: [{ text: medicalPrompt }]
      }],
      generationConfig: {
        temperature: 0.85 + (Math.random() * 0.15),
        topK: 40 + Math.floor(Math.random() * 10),
        topP: 0.92 + (Math.random() * 0.08),
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data: GeminiResponse = await response.json();

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      let result = data.candidates[0].content.parts[0].text.trim();

      // Retry if exact same response was returned before
      if (previousResponses.has(result)) {
        return await generateMedicalResponse(query, language);
      }

      previousResponses.add(result);

      // Ensure soft ending included if missing
      if (!result.includes("💙")) {
        result += `\n\n${softEnding}`;
      }

      return result;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I'm really sorry, something went wrong while trying to help. Please try again shortly or contact a medical professional directly. 💙";
  }
};

export const detectLanguage = async (text: string): Promise<string> => {
  const patterns = {
    Bengali: /[\u0980-\u09FF]/g,
    Hindi: /[\u0900-\u097F]/g,
    Arabic: /[\u0600-\u06FF]/g,
    Chinese: /[\u4e00-\u9fff]/g,
    Japanese: /[\u3040-\u309f\u30a0-\u30ff]/g,
    Portuguese: /[ãõáéíóúâêîôûçÃÕÁÉÍÓÚÂÊÎÔÛÇ]/gi,
    Turkish: /[çğıöşüÇĞİÖŞÜ]/g,
    German: /[äöüÄÖÜß]/g,
    English: /[a-zA-Z]/g,
  };

  const scores: { [key: string]: number } = {};

  for (const [lang, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern);
    scores[lang] = matches ? matches.length : 0;
  }

  // Special logic: if English characters are present and make up most of the text, choose English
  const totalLetters = Object.values(scores).reduce((sum, count) => sum + count, 0);
  const englishRatio = totalLetters > 0 ? scores.English / totalLetters : 0;

  if (englishRatio > 0.5) return 'English'; // dominant English
  if (scores.Bengali > 0) return 'Bengali';
  if (scores.Hindi > 0) return 'Hindi';
  if (scores.Arabic > 0) return 'Arabic';
  if (scores.Chinese > 0) return 'Chinese';
  if (scores.Japanese > 0) return 'Japanese';
  if (scores.Portuguese > 0) return 'Portuguese';
  if (scores.Turkish > 0) return 'Turkish';
  if (scores.German > 0) return 'German';
  if (scores.English > 0) return 'English';

  return 'English'; // fallback
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
8.  If the query is about you (like "who are you", "what is your work", "what do you do", etc.), answer briefly that you are a medical assistant AI built to provide accurate and safe medical information.

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

export const logConversation = async (messages: unknown[]) => {
  // Optional: Implement MongoDB logging here
  // This would require backend API endpoints
  console.log('Conversation logged:', messages);
};
