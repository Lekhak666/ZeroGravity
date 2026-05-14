export async function encryptReveal(data: any) {
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encoded,
  );

  return {
    encrypted,
    iv,
  };
}
