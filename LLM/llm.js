import dotenv from "dotenv";
dotenv.config();
import { HuggingFaceInference } from "@langchain/community/llms/hf";

export const llm = new HuggingFaceInference({
  apiKey: process.env.HUGGING_FACE_API_KEY,
  model: "mistralai/Mistral-7B-Instruct",
});