// Находим HTML-элементы
const productsGrid = document.querySelector("#products_grid");
const searchInput = document.querySelector("#search_input");
const categoryFilter = document.querySelector("#category_filter");
const sortFilter = document.querySelector("#sort_filter");
const productsCount = document.querySelector("#products_count");
const emptyMessage = document.querySelector("#empty_message");
const cartCount = document.querySelector("#cart_count");

// Форматируем цену
function formatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price) + " сом";
}

// Получаем корзину
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

// Обновляем количество товаров в корзине
function updateCartCount() {
    const currentUser = localStorage.getItem("currentUser")
    if(!currentUser){
        cartCount.textContent = "0"
        return
    }
    const cart = getCart();

    const total = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cartCount.textContent = total;
}

// Добавляем товар в корзину
function addToCart(productId) {

    const currentUser = localStorage.getItem("currentUser")

    //вошел ли юзер
    if(!currentUser){
        const goTuAuth = confirm( "Чтобы добавлять товары в корзину, нужно войти или зарегистрироваться. Перейти к авторизации?")
         if(goTuAuth){
            window.location.href = "index.html"
         }
         return
    }

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    alert("Товар добавлен в корзину!");
}

// Создаём карточку товара
function createProductCard(product) {
    return `
        <article class="product-card">
            <a
                class="product-image-link"
                href="product.html?id=${product.id}"
                aria-label="Подробнее: ${product.name}"
            >
                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </a>

            <div class="product-info">
                <p class="product-category">
                    ${getCategoryName(product.category)}
                </p>

                <h2>
                    <a href="product.html?id=${product.id}">
                        ${product.name}
                    </a>
                </h2>

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

                <div class="product-actions">
                    <a
                        class="product-details-button"
                        href="product.html?id=${product.id}"
                    >
                        Подробнее
                    </a>

                    <button
                        class="add-to-cart-button"
                        data-product-id="${product.id}"
                    >
                        В корзину
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Название категории
function getCategoryName(category) {
    const categories = {
        phones: "Телефоны",
        headphones: "Наушники",
        computers: "Ноутбуки",
        accessories: "Аксессуары"
    };

    return categories[category] || "Техника";
}

// Поиск, фильтрация и сортировка
function getFilteredProducts() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;

    let result = products.filter(product => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (selectedSort === "price-asc") {
        result.sort((a, b) => a.price - b.price);
    }

    if (selectedSort === "price-desc") {
        result.sort((a, b) => b.price - a.price);
    }

    if (selectedSort === "name") {
        result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    }

    return result;
}

// Показываем товары на странице
function renderProducts() {
    const filteredProducts = getFilteredProducts();

    productsGrid.innerHTML = filteredProducts
        .map(createProductCard)
        .join("");

    productsCount.textContent =
        `Найдено товаров: ${filteredProducts.length}`;

    emptyMessage.classList.toggle(
        "hidden",
        filteredProducts.length !== 0
    );
}

// События поиска и фильтров
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

// Обрабатываем нажатие на кнопку корзины
productsGrid.addEventListener("click", event => {
    const button = event.target.closest(".add-to-cart-button");

    if (!button) return;

    const productId = Number(button.dataset.productId);
    addToCart(productId);
});

// Первый запуск
renderProducts();
updateCartCount();