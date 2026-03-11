// auth.js

// Salva token e dados do usuário
export async function login(login, password) {
    const resp = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password })
    });

    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();

    localStorage.setItem("token", data.chave);
    localStorage.setItem("login", data.login);
    localStorage.setItem("email", data.email);

    return data;
}

// Logout global
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("login");
    localStorage.removeItem("email");
    window.location.href = "login.html";
}

// Recupera token
export function getToken() {
    return localStorage.getItem("token");
}

// Verifica se está logado
export function isLoggedIn() {
    return !!getToken();
}

// Extrai role do token JWT
export function getRole() {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub === 'admin' ? 'ADMIN' : 'USER';
}

// Exige login em qualquer página
export function requireLogin(redirect = true) {
    if (!isLoggedIn() && redirect) {
        window.location.href = "login.html";
    }
}

// Requisições autenticadas
export async function authFetch(url, options = {}) {
    const token = getToken();
    if (!token) throw new Error("Usuário não autenticado!");

    options.headers = {
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
