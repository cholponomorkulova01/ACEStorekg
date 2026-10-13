const auth = document.querySelector("#auth");
const profile = document.querySelector("#profile");

const register_form = document.querySelector("#register_form");
const login_form = document.querySelector("#login_form");

const reg_name = document.querySelector("#reg_name");
const reg_email = document.querySelector("#reg_email");
const reg_pass = document.querySelector("#reg_pass");
const reg_confirm_pass = document.querySelector("#reg_confirm_pass");

const login_email = document.querySelector("#login_email");
const login_pass = document.querySelector("#login_pass");

const register_tab = document.querySelector("#register_tab");
const login_tab = document.querySelector("#login_tab");

const auth_title = document.querySelector("#auth_title");
const auth_subtitle = document.querySelector("#auth_subtitle");
const message = document.querySelector("#message");

const welcome = document.querySelector("#welcome");
const logout = document.querySelector("#logout");

// Сохранение пользователей
function setUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// Получение пользователей
function getUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem("users") || "[]"
        );

        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

// Сообщения
function showMessage(text, type = "error") {
    message.textContent = text;
    message.className = type;
}

const isAuthPage =
    document.querySelector("#register_form") &&
    document.querySelector("#login_form");

if (isAuthPage && localStorage.getItem("currentUser")) {
    window.location.href = "profile.html";
}

// Переключение на регистрацию
register_tab.addEventListener("click", () => {
    register_form.classList.remove("hidden");
    login_form.classList.add("hidden");

    register_tab.classList.add("active");
    login_tab.classList.remove("active");

    auth_title.textContent = "Регистрация";
    auth_subtitle.textContent = "Заполни данные для регистрации";

    register_form.reset();
    login_form.reset();
    showMessage("");
});

// Переключение на вход
login_tab.addEventListener("click", () => {
    register_form.classList.add("hidden");
    login_form.classList.remove("hidden");

    login_tab.classList.add("active");
    register_tab.classList.remove("active");

    auth_title.textContent = "Вход";
    auth_subtitle.textContent = "Войди в свой аккаунт";

    register_form.reset();
    login_form.reset();
    showMessage("");
});

// Регистрация
register_form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = reg_name.value.trim();
    const email = reg_email.value.trim().toLowerCase();
    const password = reg_pass.value;
    const confirmPassword = reg_confirm_pass.value;

    const users = getUsers();

    if (!name || !email || !password || !confirmPassword) {
        showMessage("Заполни все поля!");
        return;
    }

    if (password.length < 6) {
        showMessage("Пароль должен содержать минимум 6 символов!");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Пароли не совпадают!");
        return;
    }

    const emailExists = users.some(
        user => user.email === email
    );

    if (emailExists) {
        showMessage("Этот email уже зарегистрирован!");
        return;
    }

    const newUser = {
        name,
        email,
        password
    };

    users.push(newUser);
    setUsers(users);

    showMessage(
        "Регистрация успешна! Теперь войди в аккаунт.",
        "success"
    );

    register_form.reset();

    // Переключаемся на форму входа
    register_form.classList.add("hidden");
    login_form.classList.remove("hidden");

    register_tab.classList.remove("active");
    login_tab.classList.add("active");

    auth_title.textContent = "Вход";
    auth_subtitle.textContent = "Войди в свой аккаунт";

    login_email.value = email;
});

// Вход
login_form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = login_email.value.trim().toLowerCase();
    const password = login_pass.value;

    const users = getUsers();

    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (!user) {
        showMessage("Неверный email или пароль!");
        return;
    }

    // showProfile(user);
    localStorage.setItem("currentUser", user.email);
    window.location.href = "profile.html";
});