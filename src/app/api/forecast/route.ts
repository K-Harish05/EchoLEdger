import { NextResponse } from "next/server";
import { chatModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { expenses } = await req.json();

    if (!expenses || expenses.length === 0) {
      return NextResponse.json({ forecast: "Not enough data to generate a forecast. Keep tracking your expenses!" });
    }

    // Convert expenses into a concise string to reduce token usage
    const expenseSummary = expenses.map((e: any) => 
      `${e.date || 'Unknown'} - ${e.amount} at ${e.vendor || 'Unknown'} (${e.category || 'General'})`
    ).join("\n");

    const systemPrompt = `You are an elite financial analyst AI built into a premium fintech dashboard.
The user wants an advanced forecasting report based on their historical ledger.
Here is their ledger:
---
${expenseSummary}
---

Your task: Provide a highly analytical, actionable 3-paragraph forecast report. 
- Paragraph 1: Identify the main spending pattern or anomaly (e.g. "You are heavily front-loading your month with food expenses").
- Paragraph 2: Predict how the rest of the month/year will look if this trend continues. Use estimated numbers.
- Paragraph 3: Give one highly specific, data-backed recommendation to optimize their finances.

DO NOT use markdown formatting like ** or bullet points. Just return 3 clean text paragraphs separated by a blank line. Do not act like a chatbot. Write like a professional financial report.`;

    const result = await chatModel.generateContent(systemPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ forecast: responseText });
  } catch (error: any) {
    console.error("Forecast Route Error:", error);
    return NextResponse.json({ error: "Failed to generate forecast." }, { status: 500 });
  }
}
