import { Resend } from "resend";

const resend = new Resend("re_ednDy4D3_LfwTGRHxeqXeEAoYfG9H1epX");

async function checkResend() {
  console.log("Checking Resend sent emails...");
  try {
    const list = await resend.emails.list();
    console.log("Resend email list output:", JSON.stringify(list, null, 2));
  } catch (err) {
    console.error("Resend check error:", err);
  }
}

checkResend();
