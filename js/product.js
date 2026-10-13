const productDetail = document.querySelector("#product_detail");
const productNotFound = document.querySelector("#product_not_found");

// Получаем ID из адреса страницы
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// Находим товар
const product = products.find(item => item.id === productId);

function formatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price) + " сом";
}

if (!product) {
    productNotFound.classList.remove("hidden");
} else {
    productDetail.innerHTML = `
        <article class="product-detail">
            <img
                class="product-detail-image"
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-detail-info">
                <p>${product.category}</p>
                <h1>${product.name}</h1>
                <p class="product-detail-description">
                    ${product.description}
                </p>
                <p class="product-detail-price">
                    ${formatPrice(product.price)}
                </p>

                <button id="detail_add_to_cart" type="button">
                    Добавить в корзину
                </button>
            </div>
        </article>
    `;

    document.querySelector("#detail_add_to_cart")
        .addEventListener("click", () => {

            const currentUser = localStorage.getItem("currentUser")
            if(!currentUser){
                const goTuAuth = confirm( "Чтобы добавлять товары в корзину, нужно войти или зарегистрироваться. Перейти к авторизации?")
                if(goTuAuth){
                    window.location.href = "index.html"
                }
                return
            }
            let cart = [];

            try {
                const savedCart = JSON.parse(
                    localStorage.getItem("cart") || "[]"
                );

                if (Array.isArray(savedCart)) {
                    cart = savedCart;
                }
            } catch {
                cart = [];
            }

            const existingItem = cart.find(
                item => item.id === product.id
            );

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: product.id,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Товар добавлен в корзину!");
        });
}
