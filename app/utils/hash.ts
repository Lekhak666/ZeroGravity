import { keccak256, toUtf8Bytes } from "ethers";

export const generateCommitHash = (
  to: string,
  amount: string,
  secret: string
) => {
  const data = `${to}-${amount}-${secret}`;
  return keccak256(toUtf8Bytes(data));
};