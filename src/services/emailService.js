const nodemailer = require("nodemailer");

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
    }
    // create ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  })();

  return transporterPromise;
}

async function sendRegistrationEmail(to, event) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: "noreply@virtual-events.test",
    to,
    subject: `Registration confirmed: ${event.title}`,
    text: `You are registered for ${event.title} on ${event.date} at ${event.time}.\nDescription: ${event.description}`,
    html: `<p>You are registered for <b>${event.title}</b> on <b>${event.date}</b> at <b>${event.time}</b>.</p><p>${event.description}</p>`,
  });

  // Log preview URL when using Ethereal
  if (nodemailer.getTestMessageUrl(info)) {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  return info;
}

module.exports = { sendRegistrationEmail };
