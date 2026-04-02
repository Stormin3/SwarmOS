import { Agent } from "../types";

export const getMockChatResponse = (
  agent: Agent | undefined,
  input: string,
  delayMs: number = 1000
): Promise<{ role: "user" | "agent"; text: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        role: "agent",
        text: `I am ${agent?.name}. I received your message: "${input}"`,
      });
    }, delayMs);
  });
};
