import { getContract } from "./web3";

export async function revealCommit(
  to: string,
  amount: string,
  nonce: number,
  salt: string,
) {
  const contract = await getContract();
  const tx = await contract.reveal(to, amount, nonce, salt);

  await tx.wait();

  return tx.hash;
}
