const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
let router = express.Router();
const pino = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  makeCacheableSignalKeyStore,
  Browsers,
  jidNormalizedUser,
} = require("@whiskeysockets/baileys");
const { upload } = require("./mega");

function removeFile(FilePath) {
  if (!fs.existsSync(FilePath)) return false;
  fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get("/", async (req, res) => {
  let num = req.query.number;

  async function CyberAnuwhPair() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    try {
      let CyberAnuwhPair = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(
            state.keys,
            pino({ level: "fatal" }).child({ level: "fatal" })
          ),
        },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }).child({ level: "fatal" }),
        browser: Browsers.macOS("Safari"),
      });

      if (!CyberAnuwhPair.authState.creds.registered) {
        await delay(1500);
        num = num.replace(/[^0-9]/g, "");
        const code = await CyberAnuwhPair.requestPairingCode(num);
        if (!res.headersSent) {
          await res.send({ code });
        }
      }

      CyberAnuwhPair.ev.on("creds.update", saveCreds);

      CyberAnuwhPair.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection === "open") {
          try {
            await delay(10000);
            const sessionPrabath = fs.readFileSync("./session/creds.json");

            const auth_path = "./session/";
            const user_jid = jidNormalizedUser(RobinPairWeb.user.id);

            function randomMegaId(length = 6, numberLength = 4) {
              const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              let result = "";
              for (let i = 0; i < length; i++) {
                result += characters.charAt(
                  Math.floor(Math.random() * characters.length)
                );
              }
              const number = Math.floor(
                Math.random() * Math.pow(10, numberLength)
              );
              return `${result}${number}`;
            }

            // FIXED: Wrap in backticks for template literal usage
            const mega_url = await upload(
              fs.createReadStream(auth_path + "creds.json"),
              `${randomMegaId()}.json`
            );

            const string_session = mega_url.replace(
              "https://mega.nz/file/",
              ""
            );

            // Wrap multi-line strings with backticks, and escape backslash in config.js path
            const sid = `*✅ CYBER ANUWH MD V1 FREE BOT IS SUCCESSFULLY CONNECTED TO YOUR WHATSAPP NUMBER. THANK YOU FOR USING OUR SERVICE.!*\n\n🔐 *Session ID:* \n👉 ${string_session} 👈\n\n📌 *Please copy and paste this Session ID into your* \\config.js\\ *file to activate your bot.*\n\n💬 *Need help? Contact support:* \nhttps://wa.me/94715450089`;

            const mg = `⚠️ *Security Notice:*\n\n*Do NOT share this Session ID with anyone.*\n\n*මෙම කේතය කිසිවෙකුටත් ලබා නොදෙන්න. ඔබගේ ගිණුම සුරක්ෂිත විය යුතුය.*`;

            const dt = await RobinPairWeb.sendMessage(user_jid, {
              image: {
                url: "https://raw.githubusercontent.com/Mahii-Botz/Mahii-md-LOGO/refs/heads/main/ChatGPT%20Image%20Apr%2021%2C%202025%2C%2005_32_50%20PM.png",
              },
              caption: sid,
            });

            const msg = await RobinPairWeb.sendMessage(user_jid, {
              text: string_session,
            });

            const msg1 = await RobinPairWeb.sendMessage(user_jid, { text: mg });
          } catch (e) {
            exec("pm2 restart prabath");
          }

          await delay(100);
          await removeFile("./session");
          process.exit(0);
        } else if (
          connection === "close" &&
          lastDisconnect &&
          lastDisconnect.error &&
          lastDisconnect.error.output.statusCode !== 401
        ) {
          await delay(10000);
          RobinPair();
        }
      });
    } catch (err) {
      exec("pm2 restart Robin-md");
      console.log("service restarted");
      RobinPair();
      await removeFile("./session");
      if (!res.headersSent) {
        await res.send({ code: "Service Unavailable" });
      }
    }
  }
  return await RobinPair();
});

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
  exec("pm2 restart Robin");
});

module.exports = router;

