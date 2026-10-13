const homeProductsGrid = document.querySelector("#home_products");

function homeFormatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price) + " сом";
}

// Заполняем рекламный баннер данными первого товара
const heroProduct = products.find(product => product.id === 1);

if (heroProduct) {
    document.querySelector("#hero_product_image").src =
        heroProduct.image;

    document.querySelector("#hero_product_image").alt =
        heroProduct.name;

    document.querySelector("#hero_product_name").textContent =
        heroProduct.name;

    document.querySelector("#hero_product_price").textContent =
        homeFormatPrice(heroProduct.price);
}

// Показываем первые четыре товара
const popularProducts = products.slice(0, 4);

homeProductsGrid.innerHTML = popularProducts.map(product => `
    <article class="home-product-card">
        <a
            class="home-product-image"
            href="product.html?id=${product.id}"
        >
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >
            <span class="home-product-view">Подробнее ↗</span>
        </a>

        <div class="home-product-info">
            <p>${product.category}</p>

            <h3>
                <a href="product.html?id=${product.id}">
                    ${product.name}
                </a>
            </h3>

            <div class="home-product-bottom">
                <strong>${homeFormatPrice(product.price)}</strong>
                <a
                    href="product.html?id=${product.id}"
                    aria-label="Посмотреть ${product.name}"
                >↗</a>
            </div>
        </div>
    </article>
`).join("");
