import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const groq = new ChatGroq({
 apiKey: process.env.GROQ_API_KEY,// Default value.
  model: "llama-3.3-70b-versatile",
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  temperature: 0,
  maxRetries: 2,
  // other params...
});

export const getModel = async (agent) => {
  switch (agent) {
    case "chat":
      return groq;
    case "search":
      return groq;
    case "coding":
      return gemini;
    case "ppt":
      return groq;
    case "pdf":
      return groq;
    case "vision":
      return gemini;

    default:
      return groq;
  }
};




const envPath = fileURLToPath(new URL("../.env", import.meta.url));

const result = dotenv.config({ path: envPath });

if (result.error) {
  throw new Error(`Unable to load environment file: ${envPath}`, {
    cause: result.error,
  });
}

const apiKey = process.env.GROQ_API_KEY?.trim();

if (!apiKey) {
  throw new Error(`GROQ_API_KEY is missing or empty in ${envPath}`);
}

// Keep your existing model name and other options.
const llm = new ChatGroq({
  apiKey,
  model: process.env.GROQ_MODEL,
});

export default llm;
