import { generateCommitment } from "./commit";

export async function createLocalCommit(payload: any) {
  const nonce = crypto.getRandomValues(new Uint32Array(1))[0];

  const salt = crypto.randomUUID();

  const commitHash = generateCommitment(payload, nonce, salt);

  const revealData = {
    payload,
    nonce,
    salt,
    commitHash,
  };

  localStorage.setItem(`commit:${commitHash}`, JSON.stringify(revealData));

  return commitHash;
}
