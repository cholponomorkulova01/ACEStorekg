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

const currentEmail = localStorage.getItem("currentUser");
const users = getUsers();

const user = users.find(
    user => user.email === currentEmail
);

if (!user) {
    window.location.href = "/pages/index.html";
} else {
    const name = user.name || "Пользователь";
    const email = user.email || "Не указан";

    document.querySelector("#profile_name").textContent = name;
    document.querySelector("#profile_email").textContent = email;

    const nameInfo = document.querySelector("#profile_name_info");
    const emailInfo = document.querySelector("#profile_email_info");
    const avatar = document.querySelector("#profile_avatar");

    if (nameInfo) {
        nameInfo.textContent = name;
    }

    if (emailInfo) {
        emailInfo.textContent = email;
    }

    if (avatar) {
        avatar.textContent = name.charAt(0).toUpperCase();
    }
}

// Выход из аккаунта
const logout = document.querySelector("#logout");

if (logout) {
    logout.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "/pages/index.html";
    });
}