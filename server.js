require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const PORT = process.env.PORT || 3000;

const products = [
    {
        id: 1,
        name: "iPhone 14 Pro",
        category: "phones",
        price: 50000,
        description: "Память 128гб. Привозной с Кореи. Высокое качество с камеры и производительность. Гарантия на 12 месяцев. Цвета: золотой, серый, белый, черный",
        image: "/img/photo_5361774586522969265_y.jpg"
    },
    {
        id: 2,
        name: "iPhone 12 Pro",
        category: "phones",
        price: 28000,
        description: "Память 256. Привозной с Кореи. Высокое качество с камеры и производительность. Гарантия на 12 месяцев. Цвета: серый, белый, черный.",
        image: "/img/photo_5361774586522969315_y.jpg"
    },
    {
        id: 3,
        name: "iPhone 13 Pro",
        category: "phones",
        price: 44500,
        description: "Память 128. Привозной с Кореи. Высокое качество с камеры и производительность. Гарантия на 12 месяцев. Цвета: синий, серый, белый, черный.",
        image: "/img/photo_5361774586522969316_y.jpg"
    },
    {
        id: 4,
        name: "iPhone 17 Pro",
        category: "phones",
        price: 97200,
        description: "Память 256. Привозной с Кореи. Высокое качество с камеры и производительность. Гарантия на 12 месяцев. Цвета: оранжевый, белый, черный.",
        image: "/img/photo_5361774586522969317_y.jpg"
    },
    {
        id: 5,
        name: "iPhone 15 Pro",
        category: "phones",
        price: 73500,
        description: "Память 256гб. Привозной с Кореи. Высокое качество с камеры и производительность. Гарантия на 12 месяцев. Цвета: серый, белый, черный",
        image: "/img/photo_5361774586522969237_y.jpg"
    },
    {
        id: 6,
        name: "iPhone 16 Pro",
        category: "phones",
        price: 94000,
        description: "Память 256гб. Привозной с Кореи. Высокое качество с камеры и производительность. Гарантия на 12 месяцев. Цвета: серый, белый, черный",
        image: "/img/photo_5361774586522969373_y.jpg"
    },
    {
        id: 7,
        name: "AirPods Pro 2",
        category: "headphones",
        price: 2190,
        description: "Ваакумные наушники с шумоподавлением, оригинальные функции и анимации. Разные цвета чехлов на выбор",
        image: "/img/photo_5346276132610840237_y.jpg"
    },
    {
        id: 8,
        name: "AirPods 4",
        category: "headphones",
        price: 2390,
        description: "Наушники без вакуума с шумоподавлением, оригинальные функции и анимации. Разные цвета чехлов на выбор",
        image: "/img/photo_5346276132610840239_y.jpg"
    },
        {
        id: 9,
        name: "AirPods 3",
        category: "headphones",
        price: 1490,
        description: "Наушники без вакуума и без шумоподавления, оригинальные функции и анимации. Разные цвета чехлов на выбор",
        image: "/img/photo_5346276132610840241_y.jpg"
    },
];

const formatPrice = (price) =>
    new Intl.NumberFormat("ru-RU").format(price) + " сом";

app.get("/api/health", (req, res) => {
    res.json({ ok: true, message: "ACE STORE server is running" });
});

app.post("/api/order", async (req, res) => {
    try {
        if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
            return res.status(500).json({
                error: "Настройки Telegram не заполнены в .env"
            });
        }

        const { name, phone, address, items } = req.body;

        if (
            typeof name !== "string" ||
            typeof phone !== "string" ||
            typeof address !== "string" ||
            !name.trim() ||
            !phone.trim() ||
            !address.trim()
        ) {
            return res.status(400).json({
                error: "Заполни имя, телефон и адрес доставки."
            });
        }

        if (
            name.length > 100 ||
            phone.length > 40 ||
            address.length > 300
        ) {
            return res.status(400).json({
                error: "Проверь длину введённых данных."
            });
        }

        if (
            !Array.isArray(items) ||
            items.length === 0 ||
            items.length > products.length
        ) {
            return res.status(400).json({
                error: "Корзина пуста или содержит неверные данные."
            });
        }

        const orderItems = [];
        const seenIds = new Set();

        for (const item of items) {
            const id = Number(item.id);
            const quantity = Number(item.quantity);
            const product = products.find(p => p.id === id);

            if (
                !product ||
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > 99 ||
                seenIds.has(id)
            ) {
                return res.status(400).json({
                    error: "В корзине обнаружен некорректный товар."
                });
            }

            seenIds.add(id);

            orderItems.push({
                ...product,
                quantity,
                subtotal: product.price * quantity
            });
        }

        const total = orderItems.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        const orderNumber = Date.now().toString().slice(-8);

        const message = [
            "🛍 НОВЫЙ ЗАКАЗ — ACE STORE",
            `Заказ № ${orderNumber}`,
            "",
            "👤 Покупатель: " + name.trim(),
            "📞 Телефон: " + phone.trim(),
            "📍 Адрес: " + address.trim(),
            "",
            "📦 Товары:",
            ...orderItems.map(item =>
                `• ${item.name} × ${item.quantity} — ${formatPrice(item.subtotal)}`
            ),
            "",
            `💰 Итого: ${formatPrice(total)}`,
            "",
            "Статус: ожидает подтверждения"
        ].join("\n");

        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: ADMIN_CHAT_ID,
                    text: message
                })
            }
        );

        const telegramData = await telegramResponse.json();

        if (!telegramResponse.ok || !telegramData.ok) {
            console.error("Telegram API error:", telegramData);

            return res.status(502).json({
                error: "Не удалось отправить заказ в Telegram. Попробуй позже."
            });
        }

        res.json({
            ok: true,
            orderNumber
        });
    } catch (error) {
        console.error("Order error:", error);

        res.status(500).json({
            error: "Ошибка сервера при оформлении заказа."
        });
    }
});

app.listen(PORT, () => {
    console.log(`ACE STORE server: http://localhost:${PORT}`);
});