import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);
const BASE_API_URL = process.env.BASE_API_URL || "http://localhost:3000";
const TTS_BASE_URL = process.env.TTS_BASE_URL || "http://localhost:5002";

const app = express();

app.use(express.json());

interface VoiceRequest {
  text: string;
}

app.post(
  "/api/voice",
  async (req: express.Request<{}, {}, VoiceRequest>, res: express.Response) => {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    try {
      const ttsResponse = await axios.get(
        `${TTS_BASE_URL}/api/tts?text=${text}&speaker_id=p351&style_wav=&language_id=`,
        { responseType: "arraybuffer" }
      );

      res.setHeader("Content-Type", "audio/wav");
      res.send(ttsResponse.data);
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error");
      res.status(500).json({ error: "TTS generation failed" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Node API server running at ${BASE_API_URL}`);
});
