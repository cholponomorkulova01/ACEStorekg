async function loadComponent(selector, path) {
    const el = document.querySelector(selector);

    if (!el) return;

    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Не удалось загрузить: ${path}`);
        }

        el.innerHTML = await response.text();

    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('#header', '/components/header.html');
});
