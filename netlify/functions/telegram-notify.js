const formatMessage = (info = {}) => {
    const ip = info.ip || 'Не определен';
    const locationText = info.location && info.location !== 'Не определена'
        ? info.location
        : 'Не определена';
    const userAgent = info.userAgent
        ? info.userAgent.substring(0, 100) + (info.userAgent.length > 100 ? '...' : '')
        : 'Не определен';
    const timestamp = info.timestamp
        ? new Date(info.timestamp).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        })
        : new Date().toLocaleString('ru-RU');

    return `📱 Новый визит на страницу
URL: ${info.url || 'Не определен'}
Время: ${timestamp}
IP: ${ip}
Локация: ${locationText}
User-Agent: ${userAgent}`;
};

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

export async function handler(event) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: 'OK'
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'Telegram credentials are not configured',
                hint: 'Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Netlify env vars'
            })
        };
    }

    let payload = {};
    try {
        payload = JSON.parse(event.body || '{}');
    } catch (error) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Invalid JSON payload' })
        };
    }

    const message = payload.message || formatMessage(payload.info);
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                disable_web_page_preview: true
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Telegram API error', data })
            };
        }

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ ok: true, data })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Failed to call Telegram API', details: error.message })
        };
    }
}
