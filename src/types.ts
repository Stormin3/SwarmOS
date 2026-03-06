export type VoiceName = "Puck" | "Charon" | "Kore" | "Fenrir" | "Zephyr";

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  voice: VoiceName;
  status: "active" | "idle" | "offline";
  skills: string[];
  parameters: {
    temperature: number;
    topP: number;
    topK: number;
  };
  expectations: string[];
  restrictions: string[];
  systemPrompt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAudio?: boolean;
}
