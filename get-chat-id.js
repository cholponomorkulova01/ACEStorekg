
require("dotenv").config();

async function getChatId() {
    const token = process.env.BOT_TOKEN;

    if (!token) {
        console.log("Сначала укажи BOT_TOKEN в файле .env");
        return;
    }

    const response = await fetch(
        `https://api.telegram.org/bot${token}/getUpdates`
    );

    const data = await response.json();

    if (!data.ok) {
        console.log("Telegram вернул ошибку:", data.description);
        return;
    }

    if (data.result.length === 0) {
        console.log("Сначала отправь боту /start в Telegram.");
        return;
    }

    for (const update of data.result) {
        const chat = update.message?.chat;

        if (chat) {
            console.log("Имя:", chat.first_name);
            console.log("Chat ID:", chat.id);
        }
    }
}

getChatId();