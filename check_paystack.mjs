const PAYSTACK_SECRET = "sk_live_1a980e7291d6d00bee171624bf0dd071369e7adb";

async function verifyTx() {
  const ref = "PD-1789222025594";
  console.log(`Fetching full details for ${ref}...`);
  const res = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

verifyTx();
