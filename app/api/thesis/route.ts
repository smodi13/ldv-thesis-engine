import Groq from "groq-sdk";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { theme } = await req.json();
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY ?? "" });

  if (!theme || typeof theme !== "string") {
    return new Response(JSON.stringify({ error: "Theme is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const systemPrompt = `You are a senior investment associate at an early-stage venture capital firm focused on AI, robotics, software, biotech, and deep tech. You write rigorous, opinionated investment theses grounded in technical and market insight. Your writing is precise, direct, and data-informed. Never use em dashes. Use commas and periods.`;

  const userPrompt = `Write a structured investment thesis for the theme: "${theme}"

Format your response with clear sections using these exact headers:

## Market Thesis and Why Now
[2-3 paragraphs on the macro tailwinds, enabling infrastructure shifts, and why this is the right timing to invest]

## Key Sub-Sectors to Watch
[Bullet list of 4-6 specific sub-sectors with one sentence each explaining the opportunity]

## What Makes a Company Defensible
[Bullet list of 4-5 specific moats: technical, data, distribution, network effects, etc.]

## Key Risks to Underwrite
[Bullet list of 4-5 concrete risks with brief commentary on each]

## Target Company Archetypes
[Three specific types of companies you would want to source in this space, with a one-paragraph description of each including what the ideal founding team looks like and what early signals of product-market fit would be]

Write with conviction. Be specific, not generic. Reference real technical dynamics and market conditions where relevant.`;

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    stream: true,
    max_tokens: 1800,
    temperature: 0.7,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
