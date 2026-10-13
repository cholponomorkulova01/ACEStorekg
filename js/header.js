document.addEventListener('click', (event) => {
    const button = event.target.closest('#menuToggle');

    if (!button) return;

    const menu = document.querySelector('#navbarList');

    if (!menu) return;

    const isOpen = menu.classList.toggle('active');

    button.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';

    button.setAttribute('aria-expanded', String(isOpen));
});

