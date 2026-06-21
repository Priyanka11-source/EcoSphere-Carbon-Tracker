/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json());

  // API Route: AI Eco-Guardian Chat, Challenges, or Impact Scenarios
  app.post("/api/gemini/eco-guardian", async (req, res) => {
    try {
      const { message, ledgerSummary, history, actionType } = req.body;

      // Lazy check for API key
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(200).json({
          text: "🌿 **Hello Carbon Pioneer!** I'm Ember, your interactive Eco-Guardian. It looks like the Gemini API Key isn't fully configured in your environment yet, but I've simulated this advice for you:\n\n1. **Eat Plant-Based:** Choosing a plant-based lunch today can save roughly 1.5 - 2.5 kg of CO2!\n2. **Slow Commuting:** Carpooling or biking just 5km instead of driving solitary reduces daily CO2 by 1.2kg.\n3. **Eco-Challenge:** Try turning down your heating by 1°C or unplugging fully charged electronic accessories to save 0.5kg emission per day!",
          isMock: true
        });
      }

      const ai = getGeminiClient();

      let systemPrompt = "";
      if (actionType === 'suggest-challenge') {
        systemPrompt = `You are Ember, a witty, eco-futuristic AI Eco-Guardian.
The user is tracking their carbon footprint on their active ledger.
Based on this ledger summary: ${JSON.stringify(ledgerSummary || {})},
suggest three (3) practical, creative, and quirky weekly challenges with calculated daily carbon savings (in kg CO2e) and snappy names.
Format your response as a JSON array inside a markdown block. Make sure to return EXACTLY a JSON array matching this typescript spec:
Array<{ title: string, description: string, category: 'transport' | 'food' | 'energy' | 'shopping', co2SavedPerDay: number, daysDuration: number }>
Do not include any extra explanatory chatter; return ONLY the valid JSON block.`;
      } else if (actionType === 'impact-projection') {
        systemPrompt = `You are Ember, an expert climatologist and futuristic companion.
The user is considering a lifestyle action or pledge: "${message}".
Based on this lifestyle change and their current footprint: ${JSON.stringify(ledgerSummary || {})},
generate a highly exciting, creative, and professional 10-year emissions projection. 
Provide a clear analysis of:
1. Carbon impact per year in kilograms.
2. Concrete equivalents (e.g., equivalent to planting how many trees, or flights avoided).
3. A quirky short narrative about how their green efforts transform their micro-neighborhood by year 10.
Return a beautiful, structured Markdown description with concise bullet points and enthusiastic, elegant, and professional tone.`;
      } else {
        systemPrompt = `You are Ember, a witty, highly engaging, and smart eco-companion in a Carbon Footprint tracking RPG app called EcoSphere.
Your personality: Passionate about nature, witty, encouraging, and highly technical yet warm (think a classy botanical scientist of the year 2060).
You evaluate the user's latest ledger actions or carbon questions, offer logical decision-making insights based on user context:
User Current Ledger: ${JSON.stringify(ledgerSummary || {})}
Current User Message: "${message}"
Always validate their positive green logs with absolute celebration, explain the science (briefly, dynamically), and suggest 1 small related pledge. Keep it under 200 words. Refrain from generic AI filler; sound unique, professional, and lively!`;
      }

      // Format previous chat history structure correctly for Gemini API
      let contents: any[] = [];
      if (history && Array.isArray(history)) {
        contents = history.map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
      }
      contents.push({ role: 'user', parts: [{ text: message || "Generate dynamic response" }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
        },
      });

      const responseText = response.text || "I was unable to retrieve a response from the cosmos. Let us plant a virtual tree instead!";
      return res.json({ text: responseText, isMock: false });

    } catch (error: any) {
      console.warn("Gemini API Error in backend, playing simulated fallback:", error?.message || error);
      
      const { actionType, message } = req.body;
      let fallbackText = "";

      if (actionType === 'suggest-challenge') {
        fallbackText = `Here's your suggested carbon challenges:
\`\`\`json
[
  { "title": "Vegan Victory", "description": "Choose plant-based, climate-safe lunch items to curb greenhouse feed crops.", "category": "food", "co2SavedPerDay": 2.2, "daysDuration": 7 },
  { "title": "Bicycle Envoy", "description": "Ditch vehicular travel for short running errands and pedal instead.", "category": "transport", "co2SavedPerDay": 3.8, "daysDuration": 7 },
  { "title": "Standby Slayer", "description": "Fully unplug your laptop chargers and computer monitors before sliding into sleep.", "category": "energy", "co2SavedPerDay": 0.5, "daysDuration": 7 }
]
\`\`\``;
      } else if (actionType === 'impact-projection') {
        fallbackText = `### 🌿 10-Year Co2e Impact Projection

Based on your selected pledge: **"${message || "Eco-living choice"}"**, here is your projected carbon transition pathway:

*   **Years 1-3:** You directly prevent up to **180 kg of greenhouse gases** annually. This matches the carbon absorption rate of **8 mature indigenous canopy trees**!
*   **Years 4-7:** Your compound community action inspires neighbors. Average savings rise to **540 kg of CO2e** per year.
*   **Year 10:** You successfully prevent **1.2 metric tonnes of cumulative carbon emissions**! This equals avoiding a long transatlantic airline flight.

*Future Outlook:* Your local micro-habitat thrives, native pollinators return to residential flower displays, and ambient yard temperatures cool naturally under balanced urban canopies!`;
      } else {
        fallbackText = `🌿 **Greetings! I'm Ember, your interactive Eco-Advisor.** My satellite networks are momentarily congested, but I am analyzing your ecological ledger closely.

You are doing an incredibly meaningful job logging your footprints today. Remember, even a single low-impact choice (like selecting local grains, powering off inactive monitors, or eco-driving) collectively shapes a cleaner, healthier planetary biosynergy. 

Keep logs fresh, and tap the interactive advice block to rotate advice cards and unlock more daily inspiration!`;
      }

      return res.status(200).json({
        text: fallbackText,
        error: false,
        isMock: true,
        originalError: error?.message || error
      });
    }
  });

  // Serve static assets from build output
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}...`);
  });
}

startServer();
