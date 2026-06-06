// Evolution API client — self-hosted WhatsApp automation
// Docs: https://doc.evolution-api.com
// Setup: EVOLUTION_API_URL + EVOLUTION_API_KEY in .env.local
// Instance name: EVOLUTION_INSTANCE (default: "legendarios")

const BASE_URL = process.env.EVOLUTION_API_URL?.replace(/\/$/, "") ?? "";
const API_KEY = process.env.EVOLUTION_API_KEY ?? "";
const INSTANCE = process.env.EVOLUTION_INSTANCE ?? "legendarios";

function isConfigured(): boolean {
  return Boolean(BASE_URL && API_KEY);
}

function normalizePhone(raw: string): string {
  // Remove non-digits, ensure Brazilian country code
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length === 11 || digits.length === 10) return `55${digits}`;
  return digits;
}

async function sendText(phone: string, message: string): Promise<boolean> {
  if (!isConfigured()) {
    console.warn("[WhatsApp] Evolution API not configured — skipping message");
    return false;
  }

  const number = normalizePhone(phone);

  try {
    const res = await fetch(`${BASE_URL}/message/sendText/${INSTANCE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": API_KEY,
      },
      body: JSON.stringify({
        number,
        options: { delay: 1200, presence: "composing" },
        textMessage: { text: message },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[WhatsApp] Send failed:", res.status, body);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[WhatsApp] Network error:", e);
    return false;
  }
}

// Sends the family messages portal link to the spouse/emergency contact
export async function sendMensagensLink(opts: {
  phoneConjuge: string;
  nomeParticipante: string;
  mensagensToken: string;
  appUrl: string;
}): Promise<boolean> {
  const link = `${opts.appUrl}/mensagens/${opts.mensagensToken}`;
  const firstName = opts.nomeParticipante.split(" ")[0];

  const msg = `Olá! 🙏

*${firstName}* está inscrito no *Legendários TOP* e você foi indicado como contato de apoio.

Você pode enviar uma mensagem especial de apoio — carta, foto, vídeo ou áudio — que será entregue pessoalmente a ele durante o evento:

👉 ${link}

Esse link é exclusivo e pode ser usado mais de uma vez para enviar quantas mensagens quiser.

*Equipe Legendários TOP* ❤️`;

  return sendText(opts.phoneConjuge, msg);
}

// Sends check-in confirmation to the participant
export async function sendCheckinConfirmation(opts: {
  phoneSenderista: string;
  nomeParticipante: string;
  uploadToken: string;
  appUrl: string;
}): Promise<boolean> {
  const uploadLink = `${opts.appUrl}/exames/${opts.uploadToken}`;
  const firstName = opts.nomeParticipante.split(" ")[0];

  const msg = `✅ Check-in confirmado, *${firstName}*!

Bem-vindo ao *Legendários TOP*. Sua presença foi registrada.

Caso ainda não tenha enviado seus exames, use o link:
👉 ${uploadLink}

Que Deus abençoe sua jornada! 🏃‍♂️
*Equipe Hakuna*`;

  return sendText(opts.phoneSenderista, msg);
}

// Sends import notification to spouse for all newly imported participants
export async function sendBatchMensagensLinks(
  participants: Array<{
    nome: string;
    whatsapp_conjuge: string | null;
    mensagens_token: string;
  }>,
  appUrl: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const p of participants) {
    if (!p.whatsapp_conjuge) continue;
    const ok = await sendMensagensLink({
      phoneConjuge: p.whatsapp_conjuge,
      nomeParticipante: p.nome,
      mensagensToken: p.mensagens_token,
      appUrl,
    });
    if (ok) sent++; else failed++;
    // Rate limit: 1 message per second to avoid WhatsApp spam detection
    await new Promise(r => setTimeout(r, 1000));
  }

  return { sent, failed };
}
