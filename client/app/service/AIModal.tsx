import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyACPd-CKzVfsLGF7OPEG6_WCZXNmCOrEZA"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Specify the model
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const predefinedHistory = [
  {
    role: "user",
    parts: [
      {
        text:
          'Generate three distinct eco-driving tips to reduce fuel consumption and CO2 emissions. The output MUST be a valid JSON object with the following structure:\n\n```json\n{\n  "eco_driving_tips": [\n    {\n      "tip": "String: A concise, actionable eco-driving tip.",\n      "immediate_action": boolean (true if the tip is something the driver can immediately implement, false otherwise)\n    },\n    {\n      "tip": "String: A concise, actionable eco-driving tip.",\n      "reason": "String: A brief explanation of why this tip is effective in reducing fuel consumption and emissions."\n    },\n    {\n      "tip": "String: A concise, actionable eco-driving tip.",\n      "reason": "String: A brief explanation of why this tip is effective in reducing fuel consumption and emissions."\n    }\n  ]\n}\n```\n\nSpecifically:\n\n*   One tip MUST be an immediate action: This tip should be something the driver can do *right now* to improve their fuel efficiency.  It should be very concise (suitable for display on a car dashboard).  Mark this tip with `"immediate_action": true`.\n*   The other two tips MUST have a \'reason\' key: Provide a brief explanation (1-2 sentences) of *why* the tip is effective.\n*   The tips should cover different aspects of eco-driving: Don\'t provide three tips that are all about speed; instead, consider route optimization, vehicle maintenance, trip planning, etc.\n*   Focus on *realistic* tips: Don\'t suggest things that are impossible. Ensure the JSON is well-formed and syntactically correct. Do not include any introductory or explanatory text outside of the JSON object.',
      },
    ],
  },
  {
    role: "model",
    parts: [
      {
        text:
          '```json\n{\n  "eco_driving_tips": [\n    {\n      "tip": "Ease up on the accelerator!",\n      "immediate_action": true\n    },\n    {\n      "tip": "Optimize your route.",\n      "reason": "Reduce distance traveled and avoid unnecessary acceleration/deceleration in heavy traffic which leads to more fuel/energy consumption."\n    },\n    {\n      "tip": "Check Tire Pressure Regularly",\n      "reason": "Properly inflated tires reduce rolling resistance, improving fuel efficiency."\n    }\n  ]\n}\n```',
      },
    ],
  },
];

export const chatSession = model.startChat({
  generationConfig,
  history: predefinedHistory,
});