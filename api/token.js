export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.LIVEAVATAR_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing LIVEAVATAR_API_KEY in Vercel env" });

    // твои значения
    const AVATAR_ID = "073b60a9-89a8-45aa-8902-c358f64d2852";
    const VOICE_ID  = "62bbb4b2-bb26-4727-bc87-cfb2bd4e0cc8";
    const CONTEXT_ID= "676aabcd-f345-47c1-ba6b-333f8f1578e1";

    const { language = "de" } = req.body || {};

    const payload = {
      mode: "FULL",
      avatar_id: AVATAR_ID,
      avatar_persona: {
        voice_id: VOICE_ID,
        context_id: CONTEXT_ID,
        language
      }
    };

    const r = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-API-KEY": apiKey
      },
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    if (!r.ok) return res.status(r.status).send(text);

    const json = JSON.parse(text);

    // важно: возвращаем и в удобном виде, и raw
    return res.status(200).json({
      session_id: json?.data?.session_id,
      session_token: json?.data?.session_token,
      raw: json
    });
  } catch (e) {
    return res.status(500).json({ error: "Token handler failed", details: String(e?.message || e) });
  }
}
