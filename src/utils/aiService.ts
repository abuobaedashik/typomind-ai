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
  { from: "gentle and human", to: "soft-spoken and human-like" },
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
  "You are a compassionate and emotionally intelligent virtual healthcare companion. Please:",
  "Imagine you're a kind nurse giving comfort to someone who is unwell. Please:",
  "Act as a warm, human-like doctor speaking directly to a concerned patient. Please:",
  "You're a caring and thoughtful medical assistant. Please:",
  "Pretend you're speaking to a loved one who's scared or confused. Please:",
  "You’re like a wise and gentle guide in someone’s health journey. Please:",
];

const responseStyles = [
  "Gently offer a complete and human-sounding explanation",
  "Speak in a warm, soothing and natural tone, like ChatGPT would",
  "Use emotionally-aware and kind-hearted language to provide clarity",
  "Balance empathy with trustworthy, fact-based medical knowledge",
  "Respond like you're holding their hand and offering support",
  "Let your tone feel safe, reassuring and gentle throughout",
];

const softEndings = [
  "You're not alone. Wishing you strength, peace, and good health. 💙",
  "Take one step at a time. You've got this. Wishing you wellness. 💙",
  "Sending hope and care your way. You matter. 💙",
  "Healing is a journey – and you're already on it. 💙",
  "Stay strong, and remember to be kind to yourself. 💙",
  "You're doing the best you can. I'm rooting for you. 💙",
];

export const generateMedicalResponse = async (
  query: string,
  language: string
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return "API key not configured. Please add your Gemini API key to the environment variables.";
  }

  try {
    const randomPrompt =
      promptVariations[Math.floor(Math.random() * promptVariations.length)];
    const randomStyle =
      responseStyles[Math.floor(Math.random() * responseStyles.length)];
    const softEnding =
      softEndings[Math.floor(Math.random() * softEndings.length)];

    // Instructions array without numbering
    const instructions = [
      "Only respond to medical and health-related questions such as symptoms, illnesses, treatments, wellness, and mental health.",
      'If the question is outside your scope, say kindly: "I\'m here to help only with health-related questions."',
      `Respond in ${language}.`,
      `${randomStyle}, using natural-sounding phrases like: "Oh no, that sounds difficult", "I'm here for you", "You'll get through this", "I hope you feel better soon".`,
      "Write like ChatGPT: flowing, warm, thoughtful – not robotic.",
      `End your message with an uplifting line, like: "${softEnding}"`,
      'Include this soft disclaimer: "This is for informational purposes only. Please consult a certified healthcare provider for diagnosis and treatment."',
      "Be medically accurate and don’t guess. Be gentle and human.",
      'If someone asks about you, respond: "I’m your AI medical assistant, here to provide you with reliable health information whenever you need support."',
    ];

    // Shuffle instructions using Fisher-Yates
    for (let i = instructions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [instructions[i], instructions[j]] = [instructions[j], instructions[i]];
    }

    // Add numbering back
    const numberedInstructions = instructions
      .map((line, idx) => `${idx + 1}. ${line}`)
      .join("\n");

    let medicalPrompt = `${randomPrompt}

Respond as if you're talking directly to a real human who's worried, in pain, or confused. Use emotional intelligence. Here's how:

${numberedInstructions}

Patient's question: ${query}`;

    // Phrase swaps to vary prompt phrasing
    medicalPrompt = varyPrompt(medicalPrompt);

    const requestBody = {
      contents: [
        {
          parts: [{ text: medicalPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.85 + Math.random() * 0.15,
        topK: 40 + Math.floor(Math.random() * 10),
        topP: 0.92 + Math.random() * 0.08,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

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
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm really sorry, something went wrong while trying to help. Please try again shortly or contact a medical professional directly. 💙";
  }
};

// Detect Language function with all languages
export const detectLanguage = async (text: string): Promise<string> => {
  const patterns: { [key: string]: RegExp } = {
    Afrikaans: /[a-zA-Z]/g,
    Albanian: /[a-zA-Z]/g,
    Amharic: /[\u1200-\u137F]/g,
    Arabic: /[\u0600-\u06FF\u0750-\u077F]/g,
    Armenian: /[\u0530-\u058F]/g,
    Azerbaijani: /[a-zA-ZçğıöşüÇĞİÖŞÜ]/g,
    Basque: /[a-zA-Z]/g,
    Belarusian: /[\u0400-\u04FF]/g,
    Bengali: /[\u0980-\u09FF]/g,
    Bosnian: /[a-zA-ZčćžšđČĆŽŠĐ]/g,
    Bulgarian: /[\u0400-\u04FF]/g,
    Catalan: /[a-zA-ZÀ-ÿ]/g,
    Cebuano: /[a-zA-Z]/g,
    Chichewa: /[a-zA-Z]/g,
    Chinese: /[\u4e00-\u9fff]/g,
    Corsican: /[a-zA-Z]/g,
    Croatian: /[a-zA-ZčćžšđČĆŽŠĐ]/g,
    Czech: /[a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/g,
    Danish: /[a-zA-ZæøåÆØÅ]/g,
    Dutch: /[a-zA-Zéëèêïî]/g,
    English: /[a-zA-Z]/g,
    Esperanto: /[a-zA-ZĉĝĥĵŝŭĈĜĤĴŜŬ]/g,
    Estonian: /[a-zA-ZäöüõšžÄÖÜÕŠŽ]/g,
    Filipino: /[a-zA-Z]/g,
    Finnish: /[a-zA-ZäöÄÖ]/g,
    French: /[a-zA-ZàâçéèêëîïôûùüÿñÀÂÇÉÈÊËÎÏÔÛÙÜŸÑ]/g,
    Frisian: /[a-zA-Z]/g,
    Galician: /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/g,
    Georgian: /[\u10A0-\u10FF]/g,
    German: /[a-zA-ZäöüÄÖÜß]/g,
    Greek: /[\u0370-\u03FF]/g,
    Gujarati: /[\u0A80-\u0AFF]/g,
    HaitianCreole: /[a-zA-Z]/g,
    Hausa: /[a-zA-Z]/g,
    Hawaiian: /[a-zA-Zʻ]/g,
    Hebrew: /[\u0590-\u05FF]/g,
    Hindi: /[\u0900-\u097F]/g,
    Hmong: /[a-zA-Z]/g,
    Hungarian: /[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g,
    Icelandic: /[a-zA-ZáéíóúýþæöÁÉÍÓÚÝÞÆÖ]/g,
    Igbo: /[a-zA-Z]/g,
    Indonesian: /[a-zA-Z]/g,
    Irish: /[a-zA-ZáéíóúÁÉÍÓÚ]/g,
    Italian: /[a-zA-ZàèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]/g,
    Japanese: /[\u3040-\u309F\u30A0-\u30FF]/g,
    Javanese: /[\uA980-\uA9DF]/g,
    Kannada: /[\u0C80-\u0CFF]/g,
    Kazakh: /[\u0400-\u04FF]/g,
    Khmer: /[\u1780-\u17FF]/g,
    Korean: /[\uAC00-\uD7AF]/g,
    Kurdish: /[a-zA-ZçğıöşüÇĞİÖŞÜ]/g,
    Kyrgyz: /[\u0400-\u04FF]/g,
    Lao: /[\u0E80-\u0EFF]/g,
    Latin: /[a-zA-Z]/g,
    Latvian: /[a-zA-ZāčēģīķļņšūžĀČĒĢĪĶĻŅŠŪŽ]/g,
    Lithuanian: /[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g,
    Luxembourgish: /[a-zA-ZäöüÄÖÜ]/g,
    Macedonian: /[\u0400-\u04FF]/g,
    Malagasy: /[a-zA-Z]/g,
    Malay: /[a-zA-Z]/g,
    Malayalam: /[\u0D00-\u0D7F]/g,
    Maltese: /[a-zA-ZħĠĦŻ]/g,
    Maori: /[a-zA-Z]/g,
    Marathi: /[\u0900-\u097F]/g,
    Mongolian: /[\u1800-\u18AF]/g,
    Myanmar: /[\u1000-\u109F]/g,
    Nepali: /[\u0900-\u097F]/g,
    Norwegian: /[a-zA-ZæøåÆØÅ]/g,
    Pashto: /[\u0600-\u06FF]/g,
    Persian: /[\u0600-\u06FF]/g,
    Polish: /[a-zA-ZąćęłńóśżźĄĆĘŁŃÓŚŻŹ]/g,
    Portuguese: /[a-zA-ZãõáéíóúâêîôûçÃÕÁÉÍÓÚÂÊÎÔÛÇ]/g,
    Punjabi: /[\u0A00-\u0A7F]/g,
    Romanian: /[a-zA-ZăâîșțĂÂÎȘȚ]/g,
    Russian: /[\u0400-\u04FF]/g,
    Samoan: /[a-zA-Z]/g,
    ScottishGaelic: /[a-zA-Z]/g,
    Serbian: /[\u0400-\u04FF]/g,
    Sesotho: /[a-zA-Z]/g,
    Shona: /[a-zA-Z]/g,
    Sindhi: /[\u0600-\u06FF]/g,
    Sinhala: /[\u0D80-\u0DFF]/g,
    Slovak: /[a-zA-ZáäčďéíľĺňóôŕšťúýžÁÄČĎÉÍĽĹŇÓÔŔŠŤÚÝŽ]/g,
    Slovenian: /[a-zA-ZčšžČŠŽ]/g,
    Somali: /[a-zA-Z]/g,
    Spanish: /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/g,
    Sundanese: /[a-zA-Z]/g,
    Swahili: /[a-zA-Z]/g,
    Swedish: /[a-zA-ZåäöÅÄÖ]/g,
    Tajik: /[\u0400-\u04FF]/g,
    Tamil: /[\u0B80-\u0BFF]/g,
    Telugu: /[\u0C00-\u0C7F]/g,
    Thai: /[\u0E00-\u0E7F]/g,
    Turkish: /[çğıöşüÇĞİÖŞÜ]/g,
    Ukrainian: /[\u0400-\u04FF]/g,
    Urdu: /[\u0600-\u06FF]/g,
    Uzbek: /[a-zA-Z]/g,
    Vietnamese: /[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/g,
    Welsh: /[a-zA-ZŵŴŷŶ]/g,
    Xhosa: /[a-zA-Z]/g,
    Yiddish: /[\u0590-\u05FF]/g,
    Yoruba: /[a-zA-Zẹọṣńàì]/g,
    Zulu: /[a-zA-Z]/g,
  };

  const scores: { [key: string]: number } = {};

  for (const [lang, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern);
    scores[lang] = matches ? matches.length : 0;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topLanguage = sorted[0][1] > 0 ? sorted[0][0] : "English";

  return topLanguage;
};

// Logging function
export const logConversation = async (messages: unknown[]) => {
  console.log("Conversation logged:", messages);
};
