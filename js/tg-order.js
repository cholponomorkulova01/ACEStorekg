const orderForm = document.querySelector("#order_form");

if (orderForm) {
    orderForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const currentUser = localStorage.getItem("currentUser");

        if (!currentUser) {
            alert("Сначала войди в аккаунт.");
            window.location.href = "index.html";
            return;
        }

        const cart = JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

        if (cart.length === 0) {
            alert("Сначала добавь товары в корзину.");
            return;
        }

        const name = document.querySelector("#order_name").value.trim();
        const phone = document.querySelector("#order_phone").value.trim();
        const address = document.querySelector("#order_address").value.trim();
        const submitButton = document.querySelector("#order_submit");
        const status = document.querySelector("#order_status");

        submitButton.disabled = true;
        status.textContent = "Отправляем заказ...";

        try {
            const response = await fetch(
                "http://localhost:3000/api/order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        address,
                        items: cart.map(item => ({
                            id: Number(item.id),
                            quantity: Number(item.quantity)
                        }))
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(
                    data.error || "Не удалось отправить заказ."
                );
            }
            
status.textContent =
    `Заказ № ${data.orderNumber} успешно отправлен!`;

// Получаем информацию о товарах до очистки корзины.
const orderItems = cart.map(item => {
    const product = products.find(
        p => p.id === Number(item.id)
    );

    return {
        id: Number(item.id),
        name: product.name,
        price: product.price,
        quantity: Number(item.quantity),
        subtotal: product.price * Number(item.quantity)
    };
});

const total = orderItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
);

// История хранится отдельно для каждого аккаунта
// в текущем браузере.
const historyKey = "orders_" + currentUser;

const orderHistory = JSON.parse(
    localStorage.getItem(historyKey) || "[]"
);

orderHistory.unshift({
    orderNumber: data.orderNumber,
    date: new Date().toISOString(),
    name,
    phone,
    address,
    items: orderItems,
    total,
    status: "Отправлен в Telegram"
});

localStorage.setItem(
    historyKey,
    JSON.stringify(orderHistory)
);

// Очищаем корзину после успешной отправки.
localStorage.removeItem("cart");

orderForm.reset();

alert(
    `Заказ № ${data.orderNumber} отправлен в ACE STORE!`
);

window.location.reload();

            orderForm.reset();

            alert(
                `Заказ № ${data.orderNumber} отправлен в ACE STORE!`
            );

            window.location.reload();

        } catch (error) {
            console.error(error);

            status.textContent =
                error.message === "Failed to fetch"
                    ? "Сервер недоступен. Проверь, запущен ли server.js."
                    : error.message;

        } finally {
            submitButton.disabled = false;
        }
    });
}