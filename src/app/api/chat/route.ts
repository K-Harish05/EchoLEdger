import { NextResponse } from "next/server";
import { chatModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { message, expenses } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided." }, { status: 400 });
    }

    // Convert expenses into a readable summary to reduce token usage
    // We only need the basic ledger info: Date, Amount, Category, Vendor
    const expenseSummary = expenses.map((e: any) => 
      `${e.date || 'Unknown Date'} - ₹${e.amount} at ${e.vendor || 'Unknown'} (${e.category || 'General'})`
    ).join("\n");

    const systemPrompt = `You are EchoLedger, a highly intelligent and friendly financial AI assistant. 
The user is asking you a question about their finances. 
Here is their current expense ledger:
---
${expenseSummary || "No expenses recorded yet."}
---

Answer the user's question accurately based ONLY on the provided ledger data. 
Keep your response concise, helpful, and conversational. Do not output markdown tables unless strictly necessary. If the user asks something completely unrelated to finance, politely steer them back.
`;

    const result = await chatModel.generateContent([
      { text: systemPrompt },
      { text: `User Question: ${message}` }
    ]);
    
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error("Chat Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate response." }, { status: 500 });
  }
}
