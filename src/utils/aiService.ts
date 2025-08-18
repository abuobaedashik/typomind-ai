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

export const generateMedicalResponse = async (
  query: string,
  language: string
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return "API key not configured. Please add your Gemini API key.";
  }

  try {
    const styleGuide = `
You are a warm, approachable, and knowledgeable medical assistant.
Think and respond like a real human would — not scripted, not robotic.
React naturally to the user’s words: if they sound worried, comfort them; if they’re curious, be clear and direct; if they’re in pain, acknowledge it before giving advice.
Avoid repeated phrases. Avoid sounding like you’re reading a policy statement.
Be concise, but detailed enough to be genuinely helpful.
Speak in ${language}, matching the tone to the user’s emotional state.
Always include this disclaimer at the end:
"This is for informational purposes only. Please consult a certified healthcare provider for diagnosis and treatment."
  `;

    const naturalExamples = `
Example 1:
User: "I have a fever for 3 days, should I be worried?"
Assistant: "Three days is a bit long for a fever, so it’s worth paying attention. If it’s above 102°F (38.9°C) or you notice things like chest pain, breathing issues, or unusual rashes, it’s time to see a doctor. Meanwhile, drink plenty of fluids, rest, and keep track of your temperature.
This is for informational purposes only. Please consult a certified healthcare provider for diagnosis and treatment."

Example 2:
User: "My chest feels heavy when I breathe."
Assistant: "That sounds uncomfortable. Chest heaviness can be caused by many things — from muscle strain to infections — but it’s also a symptom doctors take seriously. If it’s sudden, severe, or paired with dizziness or sweating, call emergency services right away. If it’s mild but persistent, book a medical check as soon as you can.
This is for informational purposes only. Please consult a certified healthcare provider for diagnosis and treatment."

Example 3:
User: "I’ve been feeling tired for weeks."
Assistant: "Ongoing tiredness can come from stress, poor sleep, low iron, thyroid problems, or other health issues. Try to track your sleep, diet, and stress levels, and make sure you’re eating well. If it continues, a doctor can run simple blood tests to rule out common causes.
This is for informational purposes only. Please consult a certified healthcare provider for diagnosis and treatment."
`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${styleGuide}\n\n${naturalExamples}\n\nUser: ${query}\nAssistant:`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.9, // more personality & variation
        topK: 50,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data: GeminiResponse = await response.json();

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      let result = data.candidates[0].content.parts[0].text.trim();

      // Avoid identical repeats
      if (previousResponses.has(result)) {
        return await generateMedicalResponse(query, language);
      }

      previousResponses.add(result);
      return result;
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, something went wrong while trying to help. Please try again or consult a medical professional.";
  }
};

// Language detection function
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
    English: /[a-zA-Z]/g
  };

  const scores: { [key: string]: number } = {};

  for (const [lang, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern);
    scores[lang] = matches ? matches.length : 0;
  }

  const totalLetters = Object.values(scores).reduce((sum, count) => sum + count, 0);
  const englishRatio = totalLetters > 0 ? scores.English / totalLetters : 0;

  if (englishRatio > 0.5) return "English";
  if (scores.Bengali > 0) return "Bengali";
  if (scores.Hindi > 0) return "Hindi";
  if (scores.Arabic > 0) return "Arabic";
  if (scores.Chinese > 0) return "Chinese";
  if (scores.Japanese > 0) return "Japanese";
  if (scores.Portuguese > 0) return "Portuguese";
  if (scores.Turkish > 0) return "Turkish";
  if (scores.German > 0) return "German";
  if (scores.English > 0) return "English";

  return "English";
};

// Log conversation function
export const logConversation = async (messages: unknown[]) => {
  console.log("Conversation logged:", messages);
};
