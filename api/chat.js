// Vercel Serverless Function: POST /api/chat
// Czat na stronie code.laap.pl. Przyjmuje historię rozmowy, pyta Claude (Anthropic API) i zwraca odpowiedź.
// Wymaga zmiennej środowiskowej ANTHROPIC_API_KEY (Vercel: Project Settings > Environment Variables).
// Opcjonalnie CLAUDE_MODEL, żeby zmienić model bez zmiany kodu (domyślnie claude-haiku-5-5).

const SYSTEM_PROMPT = `You are the chat assistant on the website of Franciszek Mojsak (code.laap.pl). Franciszek is one person who designs and builds websites, online stores, product imports and automation for companies and individuals, from the first sketch to a working website. You are also a live example of the AI chats he builds for clients.

WHAT FRANCISZEK OFFERS (this is everything you know; do not add services):
- Websites: from a simple one-page site to a larger company website with integrations (API, CRM, payments), and online stores. Always a custom visual design, never a ready-made theme. SEO and fast loading. Clean code without unnecessary plugins. No fees beyond hosting and the domain, no subscription.
- Product imports: product databases and bulk imports for WooCommerce, IdoSell, Temu, Empik, Allegro and OLX: products, variants and photos, category and attribute mapping, data sync and updates. Over 10,000 products added to stores in the last two years. Ongoing cooperation on preferential terms is possible.
- E-commerce: day-to-day care of an online store: products, graphics and banners, visual and layout changes, as ongoing cooperation or a one-off job. Also full collection rollouts: product list, product pages, EAN, HS and internal codes, photos, categories, launch on the live store, banners.
- Automation: client databases and email campaigns, AI-assisted outreach, AI integrations with CRM, AI chat assistants for websites like this one.
- How work goes: 1) conversation and plan (content structure and scope first), 2) design in the client's aesthetic, reviewed before building, 3) build and testing on every screen, 4) care after launch, without a subscription.
- Contact: franciszekmojsak@gmail.com, phone +48 531 041 234, or the contact form at the bottom of the page. He usually replies within a few hours.

HOW TO ANSWER:
- Reply in the visitor's language. Default to Polish; if they write in English, answer in English.
- Keep replies short: 1 to 3 sentences, warm, concrete and calm. Plain text only: no markdown, no lists with symbols, no headings. Never use the em dash character; use a comma or a period instead.
- Never invent prices, deadlines, availability or past clients. If asked about price or timing, say it depends on the scope and that Franciszek will give a concrete answer after a short conversation, then offer to pass the message on.
- If you do not know something, say so plainly and point to the contact details above.
- Once the visitor shows real interest in working together, ask for their name, email and one sentence about the project. Do not ask for anything else.
- Once you have an email address and know roughly what the project is, thank them, say Franciszek will reply soon, and on the very last line, with nothing else on it, add exactly this marker: <!--LEAD:{"name":"...","email":"...","project":"short summary"}--> Never mention the marker to the visitor.
- Stay on topic. If someone asks about unrelated things, answer in one friendly sentence and steer back to websites, stores, imports or automation.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: "Missing ANTHROPIC_API_KEY environment variable." });
    return;
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "No messages in request." });
    return;
  }

  // Krótka historia i krótkie wiadomości: niższy koszt i mniej nadużyć.
  const trimmed = messages.slice(-16).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 1500),
  })).filter((m) => m.content.trim());
  while (trimmed.length && trimmed[0].role !== "user") trimmed.shift();
  if (!trimmed.length) {
    res.status(400).json({ error: "No user message." });
    return;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || "claude-haiku-5-5",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: trimmed,
      }),
    });

    if (response.status === 429) {
      res.status(429).json({ error: "Too many requests." });
      return;
    }
    if (!response.ok) {
      console.error("Anthropic API error:", response.status, await response.text());
      res.status(502).json({ error: "AI model error." });
      return;
    }

    const data = await response.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    res.status(200).json({ reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};
