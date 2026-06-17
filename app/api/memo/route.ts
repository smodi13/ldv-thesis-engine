import Groq from "groq-sdk";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, sector, description, stage, scores } = body as {
    name: string;
    sector: string;
    description: string;
    stage: string;
    scores: Record<string, number>;
  };

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY ?? "" });

  const prompt = `You are a senior investment associate writing a concise one-page investment memo for an early-stage VC firm focused on AI, robotics, software, biotech, and deep tech.

Company: ${name}
Sector: ${sector}
Stage: ${stage}
Description: ${description}
Scoring (1-10 scale):
  Technical Defensibility: ${scores.technicalDefensibility}
  Market Size: ${scores.marketSize}
  Team Strength: ${scores.teamStrength}
  Timing: ${scores.timing}
  Traction: ${scores.traction}

Write a clean investment memo with exactly these five sections. Be specific, concise, and opinionated. No em dashes. Use commas and periods only.

## Company Overview
[2-3 sentences on what the company does, who founded it, and what makes it technically interesting]

## Investment Highlights
[3 bullet points on the strongest aspects: technology moat, market position, team]

## Market Opportunity
[1 paragraph on total addressable market, timing, and why this sector is compelling now]

## Key Risks
[3 bullet points on the most significant risks: technical, market, competitive]

## Preliminary Recommendation
[One of: INVEST / MONITOR / PASS]
[One sentence rationale tied directly to the scoring and description above]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a concise, opinionated VC investment analyst. Write clearly and directly. No em dashes. Use commas and periods.",
      },
      { role: "user", content: prompt },
    ],
    stream: false,
    max_tokens: 1000,
    temperature: 0.5,
  });

  const text = completion.choices[0]?.message?.content ?? "";

  return Response.json({ memo: text });
}
