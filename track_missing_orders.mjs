const PAYSTACK_SECRET = "sk_live_1a980e7291d6d00bee171624bf0dd071369e7adb";

async function verifyRef(ref) {
  console.log(`\n=========================================\nFetching details for reference: ${ref}`);
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
    });
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error(`Error verifying ${ref}:`, err);
  }
}

async function run() {
  await verifyRef("PD-1790581966807");
  await verifyRef("PD-1790441538961");
}

run();
