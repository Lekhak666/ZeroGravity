import parsePrompt from "../services/ai.service.js";
import commitHash from "../services/agent.service.js";

export default async function handleAgent(req, res) {
  try {
    const { prompt } = req.body;

    const parsed = await parsePrompt(prompt);

    if (parsed.action !== "commit") {
      throw new Error("Unsupported action");
    }

    const result = await commitHash(parsed.commitHash);

    return res.json({
      success: true,
      aiParsed: parsed,
      transaction: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
