export async function onRequestPost({ request, env }) {
  const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;

  try {
    const { userId, solvedCount } = await request.json();

    if (!userId || solvedCount === undefined) {
      return new Response(JSON.stringify({ error: "userId and solvedCount are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (!TELEGRAM_BOT_TOKEN) {
      return new Response(JSON.stringify({ error: "TELEGRAM_BOT_TOKEN is not set" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    const result = {
      type: "article",
      id: `score_${userId}_${Date.now()}`,
      title: "Make100 Score",
      description: `I solved ${solvedCount} tickets!`,
      input_message_content: {
        message_text: `I solved ${solvedCount} tickets in Make100! Can you beat me?`
      },
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Play Make100",
              url: "https://t.me/Test_Make100_bot/app"
            }
          ]
        ]
      }
    };

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/savePreparedInlineMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        result: result,
        allow_user_chats: true,
        allow_bot_chats: true,
        allow_group_chats: true,
        allow_channel_chats: true
      })
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("Telegram API Error:", data);
      return new Response(JSON.stringify({ error: data.description || "Failed to save prepared message" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ id: data.result.id }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Share error:", error);
    return new Response(JSON.stringify({ error: "Internal server error during share preparation" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
