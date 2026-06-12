import { PromptTemplate } from "@langchain/core/prompts";

export const prompt = PromptTemplate.fromTemplate(`
You are a polite business assistant.

Customer Name: {name}
Due Amount: {due}

Write a short WhatsApp payment reminder message.
`);