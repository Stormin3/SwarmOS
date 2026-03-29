import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MOCK_AGENTS } from "../data/mockAgents";
import { Agent } from "../types";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Send,
  User,
  MessageSquare,
} from "lucide-react";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

export function Chat() {
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get("agent") || MOCK_AGENTS[0].id;
  const [activeAgent, setActiveAgent] = useState<Agent | undefined>(
    MOCK_AGENTS.find((a) => a.id === agentId),
  );
  const [messages, setMessages] = useState<
    { role: "user" | "agent"; text: string }[]
  >([]);
  const [input, setInput] = useState("");

  // Live API State
  const [isCalling, setIsCalling] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Audio playback queue
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    setActiveAgent(MOCK_AGENTS.find((a) => a.id === agentId) || MOCK_AGENTS[0]);
    setMessages([]); // Reset messages when switching agents
  }, [agentId]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");

    // Mock response for text chat
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: `I am ${activeAgent?.name}. I received your message: "${input}"`,
        },
      ]);
    }, 1000);
  };

  const startCall = async () => {
    if (!activeAgent) return;
    try {
      setIsCalling(true);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: activeAgent.voice },
            },
          },
          systemInstruction: activeAgent.systemPrompt,
        },
        callbacks: {
          onopen: async () => {

            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
              });
              mediaStreamRef.current = stream;
              const source =
                audioContextRef.current!.createMediaStreamSource(stream);
              sourceRef.current = source;

              const processor = audioContextRef.current!.createScriptProcessor(
                4096,
                1,
                1,
              );
              processorRef.current = processor;

              processor.onaudioprocess = (e) => {
                if (isMicMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  pcmData[i] = Math.max(
                    -32768,
                    Math.min(32767, inputData[i] * 32768),
                  );
                }

                const base64Data = btoa(
                  String.fromCharCode(...new Uint8Array(pcmData.buffer)),
                );

                sessionPromise.then((session) => {
                  session.sendRealtimeInput({
                    media: {
                      data: base64Data,
                      mimeType: "audio/pcm;rate=16000",
                    },
                  });
                });
              };

              source.connect(processor);
              processor.connect(audioContextRef.current!.destination);
            } catch (err) {
              console.error("Error accessing microphone:", err);
              endCall();
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio =
              message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const pcmData = new Int16Array(bytes.buffer);
              const floatData = new Float32Array(pcmData.length);
              for (let i = 0; i < pcmData.length; i++) {
                floatData[i] = pcmData[i] / 32768.0;
              }
              audioQueueRef.current.push(floatData);
              playNextAudio();
            }

            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              isPlayingRef.current = false;
            }
          },
          onclose: () => {

            endCall();
          },
          onerror: (err) => {
            console.error("Live API error:", err);
            endCall();
          },
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsCalling(false);
    }
  };

  const playNextAudio = () => {
    if (
      isPlayingRef.current ||
      audioQueueRef.current.length === 0 ||
      !audioContextRef.current
    )
      return;

    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift()!;
    const audioBuffer = audioContextRef.current.createBuffer(
      1,
      audioData.length,
      24000,
    ); // Output is 24kHz
    audioBuffer.getChannelData(0).set(audioData);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      isPlayingRef.current = false;
      playNextAudio();
    };
    source.start();
  };

  const endCall = () => {
    setIsCalling(false);
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
  };

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-neutral-200/50 flex flex-col bg-white/50">
        <div className="p-4 border-b border-neutral-200/50 font-semibold text-neutral-800">
          Direct Messages
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MOCK_AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent)}
              className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                activeAgent?.id === agent.id
                  ? "bg-white/80 shadow-sm border border-neutral-200/50"
                  : "hover:bg-white/50 border border-transparent"
              }`}
            >
              <div className="relative">
                <img
                  src={agent.avatarUrl}
                  alt={agent.name}
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    agent.status === "active"
                      ? "bg-emerald-500"
                      : agent.status === "idle"
                        ? "bg-amber-500"
                        : "bg-neutral-300"
                  }`}
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{agent.name}</p>
                <p className="text-xs text-neutral-500 truncate">
                  {agent.role}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {activeAgent && (
          <div className="h-16 border-b border-neutral-200/50 flex items-center justify-between px-6 bg-white/50">
            <div className="flex items-center gap-3">
              <img
                src={activeAgent.avatarUrl}
                alt={activeAgent.name}
                className="w-10 h-10 rounded-full"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="font-semibold">{activeAgent.name}</h2>
                <p className="text-xs text-neutral-500">
                  {activeAgent.department} • Voice: {activeAgent.voice}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isCalling ? (
                <>
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-2 rounded-full ${isMicMuted ? "bg-rose-100 text-rose-600" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
                  >
                    {isMicMuted ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={endCall}
                    className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-600 transition-colors animate-pulse"
                  >
                    <PhoneOff className="w-4 h-4" /> End Call
                  </button>
                </>
              ) : (
                <button
                  onClick={startCall}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call Agent
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/50 border border-neutral-200/50 flex items-center justify-center shadow-sm">
                <MessageSquare className="w-8 h-8 text-neutral-400" />
              </div>
              <p>Start a conversation with {activeAgent?.name}</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-neutral-500" />
                  ) : (
                    <img
                      src={activeAgent?.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div
                  className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-neutral-100 text-neutral-900 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-200/50 bg-white/50">
          <div className="flex items-center gap-2 bg-white border border-neutral-200/50 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={`Message ${activeAgent?.name}...`}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm py-1"
              disabled={isCalling}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isCalling}
              className="p-1.5 bg-indigo-600 text-white rounded-full disabled:opacity-50 hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
