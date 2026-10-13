const cartItems = document.querySelector("#cart_items");
const cartEmpty = document.querySelector("#cart_empty");
const cartSummary = document.querySelector("#cart_summary");
const cartTotal = document.querySelector("#cart_total");
const clearCartButton = document.querySelector("#clear_cart");

const currentUser = localStorage.getItem("currentUser")
if(!currentUser){
    cartItems.innerHTML = ""
    cartSummary.classList.add("hidden")
    cartEmpty.classList.add("hidden")

    const goTuAuth = confirm("Чтобы просматривать корзину, нужно войти или зарегистрироваться. Перейти к авторизации?")
    if(goTuAuth){
        window.location.href = "index.html"
    }else{
        window.location.href = "catalog.html"
    }
}else{
    function formatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price) + " сом";
}

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        if (!Array.isArray(cart)) return [];

        return cart.filter(item =>
            Number.isInteger(item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();

    // Берём актуальные товары из массива
    const items = cart
        .map(item => {
            const product = products.find(
                product => product.id === item.id
            );

            if (!product) return null;

            return {
                ...product,
                quantity: item.quantity
            };
        })
        .filter(Boolean);

    cartItems.innerHTML = items.map(item => `
        <article class="cart-item">
            <img
                class="cart-item-image"
                src="${item.image}"
                alt="${item.name}"
            >

            <div>
                <h2>
                    <a href="product.html?id=${item.id}">
                        ${item.name}
                    </a>
                </h2>

                <p>${formatPrice(item.price)} за штуку</p>
                <strong>
                    ${formatPrice(item.price * item.quantity)}
                </strong>
            </div>

            <div class="cart-item-controls">
                <button
                    type="button"
                    data-action="decrease"
                    data-id="${item.id}"
                    aria-label="Уменьшить количество"
                >−</button>

                <span>${item.quantity}</span>

                <button
                    type="button"
                    data-action="increase"
                    data-id="${item.id}"
                    aria-label="Увеличить количество"
                >+</button>

                <button
                    type="button"
                    class="remove-item"
                    data-action="remove"
                    data-id="${item.id}"
                >Удалить</button>
            </div>
        </article>
    `).join("");

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent = formatPrice(total);

    cartEmpty.classList.toggle("hidden", items.length !== 0);
    cartSummary.classList.toggle("hidden", items.length === 0);
}

// Обработка кнопок изменения количества
cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const productId = Number(button.dataset.id);
    const action = button.dataset.action;
    let cart = getCart();

    if (action === "remove") {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);

        if (!item) return;

        if (action === "increase") {
            item.quantity++;
        }

        if (action === "decrease") {
            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(
                    item => item.id !== productId
                );
            }
        }
    }

    saveCart(cart);
    renderCart();
});

// Очистка корзины
clearCartButton.addEventListener("click", () => {
    localStorage.removeItem("cart");
    renderCart();
});

renderCart();

}