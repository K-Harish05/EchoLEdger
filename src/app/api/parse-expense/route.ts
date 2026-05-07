import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { preParseAmount, validateAndCleanExpense } from "@/lib/parser";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing transcript text." }, { status: 400 });
    }

    const preParsedAmt = preParseAmount(text);
    const today = new Date().toISOString().split("T")[0];
    const hint = preParsedAmt !== null ? `Hint: Make sure the amount is carefully extracted. Based on regex, it is highly likely the amount is ${preParsedAmt}. ` : "";

    const userPrompt = `Extract structured expense data from the following text transcript. 
Today's date is ${today}. Resolve any relative dates (like "yesterday" or "five days back") correctly into YYYY-MM-DD format based on today's date.
${hint}
Text: "${text}"`;

    const result = await geminiModel.generateContent(userPrompt);
    const responseText = result.response.text();

    let jsonResult;
    try {
      jsonResult = JSON.parse(responseText);
    } catch (err) {
      console.error("Gemini failed to output valid JSON:", responseText, err);
      // Fallback JSON if parsing fails entirely
      jsonResult = { 
        amount: preParsedAmt, 
        category: null, 
        vendor: "Voice Log", 
        date: null, 
        notes: text, 
        confidence: "Low" 
      };
    }

    // Regex override to guarantee the amount is not lost if the AI hallucinates
    if (preParsedAmt !== null && jsonResult.amount !== preParsedAmt) {
      jsonResult.amount = preParsedAmt;
    }

    // Fill in defaults, clean dates, apply smart categorization fallbacks
    const finalData = validateAndCleanExpense(jsonResult);

    return NextResponse.json(finalData);

  } catch (error) {
    console.error("Parse Expense Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
