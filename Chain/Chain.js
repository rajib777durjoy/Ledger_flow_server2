import { RunnableSequence } from "@langchain/core/runnables";
import { prompt } from "../Prompt/prompt.js";
import { llm } from "../LLM/llm.js";

export const chain = RunnableSequence.from([
  prompt,
  llm,
]);