import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIMessage = async (title, collection, recipientName) => {
  
  if (!API_KEY) {
    console.error("❌ MISSING API KEY: Make sure VITE_GEMINI_API_KEY is in your .env file");
    toast.error("Gemini API Key is missing. Please check your setup.");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a short, nostalgic message for a time capsule. Title: ${title}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("❌ AI ERROR:", error);
    
   
    toast.error("The Gemini API keys are not working.");
    return null;
  }
};