import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';


const SERVICE_ID = "service_99ntmh2";
const TEMPLATE_ID = "template_p2v4xis";
const PUBLIC_KEY = "z3wIRauEpw4ovc5JF";

export const sendUnlockNotification = async (capsule) => {
  const recipients = capsule.recipients || [];
  if (recipients.length === 0) return;

  const toastId = toast.loading(`Sending emails...`);


  console.log("====================================");
  console.log(" 🔍 EMAILJS DEBUGGER");
  console.log("Service ID:", SERVICE_ID);
  console.log("Template ID:", TEMPLATE_ID);
  console.log("Public Key:", PUBLIC_KEY);
  console.log("====================================");

  if (!PUBLIC_KEY || PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    toast.error("Error: Public Key is missing!");
    console.error("STOPPING: You haven't replaced the PUBLIC_KEY string yet.");
    return;
  }

  const templateParams = {
    to_email: recipients.join(","),
    capsule_title: capsule.title,
    unlock_date: capsule.unlockDate,
    view_link: `${window.location.origin}/capsule/${capsule.id}`,
    message: capsule.content?.text || "New memory unlocked!"
  };

  try {

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

    toast.success("Emails sent successfully!", { id: toastId });
    console.log("✅ SUCCESS: Email sent.");

  } catch (error) {
    console.error("❌ FAILED:", error);

    // Detailed error message
    if (error.status === 412) {
      toast.error("Error 412: Invalid Public Key", { id: toastId });
      console.error("👉 FIX: Your Public Key is wrong. Go to Account > API Keys.");
    } else if (error.status === 404) {
      toast.error("Error 404: Service/Template ID wrong", { id: toastId });
    } else {
      toast.error(`Error ${error.status}: ${error.text}`, { id: toastId });
    }
  }
};