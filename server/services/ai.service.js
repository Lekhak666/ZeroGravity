import groq from "./groq.service.js";
import chat from "./groq.service.js";

export default async function parsePrompt(prompt) {
  const completion = await chat.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: `
You are an intent parser.

Extract ONLY:
- action
- commitHash

Return STRICT JSON.

Example:
{
  "action": "commit",
  "commitHash": "0x..."
}

Do not explain anything.
`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0,
  });

  const content = completion.choices[0].message.content;

  return JSON.parse(content);
}
