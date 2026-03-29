import WebSocket from "ws";

async function testProxy() {
  const wsUrl = "ws://localhost:3001/api/ws";
  console.log(`Connecting to proxy at ${wsUrl}...`);

  const ws = new WebSocket(wsUrl);

  ws.on("open", () => {
    console.log("Connected to proxy.");
    console.log("Sending setup message...");
    ws.send(
      JSON.stringify({
        type: "setup",
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Puck" },
            },
          },
          systemInstruction: "You are a helpful assistant.",
        },
      }),
    );
  });

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    console.log("Received message from proxy:", message.type);
    if (message.type === "open") {
      console.log("Proxy successfully opened Gemini session.");
      process.exit(0);
    } else if (message.type === "error") {
      console.error("Proxy returned error:", message.error);
      process.exit(1);
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
    process.exit(1);
  });

  setTimeout(() => {
    console.error("Test timed out after 10 seconds.");
    process.exit(1);
  }, 10000);
}

testProxy();
