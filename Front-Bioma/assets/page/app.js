// auth.js - gerenciamento de autenticação e JWT para admin

(function() {
    // 1️⃣ Pega dados do localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const login = localStorage.getItem("login");

    // 2️⃣ Verifica se o usuário está logado e é ADMIN
    const isAuthorized = token && (role === "ADMIN" || (login && login.toLowerCase() === "admin"));

    if (!isAuthorized) {
        alert("Acesso negado! Você precisa ser um administrador para acessar esta página.");

        // Limpa dados sensíveis do localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // Redireciona para login
        window.location.href = "login.html";
    }
})();

// ==========================
// Funções de autenticação
// ==========================

// Pega o token JWT do localStorage
function getToken() {
    return localStorage.getItem("token");
}

// Cria headers com Authorization para fetch
function authHeaders() {
    const token = getToken();
    if (!token) return {};
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}

// Função utilitária para fetch com token
async function fetchWithAuth(url, options = {}) {
    const headers = {
        ...authHeaders(),
        ...options.headers
    };
    const opts = { ...options, headers };
    return fetch(url, opts);
}

// Expor as funções globalmente
window.getToken = getToken;
window.authHeaders = authHeaders;
window.fetchWithAuth = fetchWithAuth;