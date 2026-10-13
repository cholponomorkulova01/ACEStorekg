const ordersList = document.querySelector("#orders_list");
const currentUser = localStorage.getItem("currentUser");

function formatOrderPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price) + " сом";
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

if (!currentUser) {
    ordersList.innerHTML = `
        <div class="orders-empty">
            <h2>Войди в аккаунт</h2>
            <p>Чтобы просматривать историю заказов, нужно войти.</p>
            <a href="index.html" class="hero-button">
                Войти в аккаунт →
            </a>
        </div>
    `;
} else {
    const historyKey = "orders_" + currentUser;

    let orders = [];

    try {
        orders = JSON.parse(
            localStorage.getItem(historyKey) || "[]"
        );

        if (!Array.isArray(orders)) {
            orders = [];
        }
    } catch (error) {
        orders = [];
    }

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="orders-empty">
                <div class="orders-empty-icon">↗</div>
                <h2>Пока заказов нет</h2>
                <p>Когда ты оформишь первый заказ, он появится здесь.</p>
                <a href="catalog.html" class="hero-button">
                    Перейти в каталог →
                </a>
            </div>
        `;
    } else {
        ordersList.innerHTML = orders.map(order => {
            const date = new Date(order.date);
            const validDate = !Number.isNaN(date.getTime());

            const formattedDate = validDate
                ? date.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                })
                : "Дата не указана";

            const items = Array.isArray(order.items)
                ? order.items
                : [];

            return `
                <article class="order-card">
                    <div class="order-card-header">
                        <div>
                            <p class="order-caption">НОМЕР ЗАКАЗА</p>
                            <h2>№ ${escapeHTML(order.orderNumber)}</h2>
                            <p class="order-date">${formattedDate}</p>
                        </div>

                        <span class="order-status">
                            ${escapeHTML(order.status || "Оформлен")}
                        </span>
                    </div>

                    <div class="order-items">
                        ${items.map(item => `
                            <div class="order-item">
                                <span>
                                    ${escapeHTML(item.name)}
                                    <small>× ${Number(item.quantity) || 0}</small>
                                </span>
                                <strong>
                                    ${formatOrderPrice(Number(item.subtotal) || 0)}
                                </strong>
                            </div>
                        `).join("")}
                    </div>

                    <div class="order-total">
                        <span>Итого</span>
                        <strong>
                            ${formatOrderPrice(Number(order.total) || 0)}
                        </strong>
                    </div>

                    <details class="order-details">
                        <summary>Данные доставки</summary>
                        <p>Имя: ${escapeHTML(order.name || "—")}</p>
                        <p>Телефон: ${escapeHTML(order.phone || "—")}</p>
                        <p>Адрес: ${escapeHTML(order.address || "—")}</p>
                    </details>
                </article>
            `;
        }).join("");
    }
}