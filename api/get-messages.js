export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }

    try {
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        
        if (!TELEGRAM_BOT_TOKEN) {
            return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
        }

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.ok) {
            const messages = data.result
                .filter(update => update.message && update.message.text)
                .map(update => ({
                    id: update.update_id,
                    text: update.message.text,
                    date: new Date(update.message.date * 1000).toLocaleTimeString()
                }))
                .slice(-10);

            return res.status(200).json({ messages });
        } else {
            return res.status(500).json({ error: 'Ошибка получения сообщений' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}
