import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing from the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        amount: { type: SchemaType.NUMBER, nullable: true },
        category: { type: SchemaType.STRING, nullable: true },
        vendor: { type: SchemaType.STRING, nullable: true },
        date: { type: SchemaType.STRING, description: "YYYY-MM-DD format", nullable: true },
        notes: { type: SchemaType.STRING, nullable: true },
        confidence: { type: SchemaType.STRING, description: "Must be exactly one of: High, Medium, Low", nullable: true },
        friendName: { type: SchemaType.STRING, description: "Name of the person involved in a split expense, if any", nullable: true },
        splitType: { type: SchemaType.STRING, description: "Must be exactly one of: I owe, Owes me, None", nullable: true }
      },
      required: ["amount", "category", "vendor", "date", "notes", "confidence", "friendName", "splitType"]
    }
  }
});

export const chatModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
