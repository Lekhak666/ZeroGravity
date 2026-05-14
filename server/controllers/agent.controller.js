import parsePrompt from "../services/ai.service.js";
import commitHash from "../services/agent.service.js";

import { buildManagedCommit } from "../services/managedCommit.service.js";

export default async function handleAgent(req, res) {
  try {
    const { prompt } = req.body;

    const parsed = await parsePrompt(prompt);

    if (parsed.action !== "commit") {
      throw new Error("Unsupported action");
    }

    const { commitHash: generatedHash, revealData } =
      buildManagedCommit(parsed);

    const result = await commitHash(generatedHash);

    console.log("PROMPT:", prompt);

    console.log("PARSED:", parsed);

    console.log("GENERATED HASH:", generatedHash);

    return res.json({
      success: true,

      mode: "managed",

      aiParsed: parsed,

      commitHash: generatedHash,

      revealData,

      transaction: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
