document.querySelector('button.text-red-500').addEventListener('click', function() {
    // Limpa todos os dados do usuário
    localStorage.clear();
    // Redireciona para login
    window.location.href = "login.html";
});

 const content = document.getElementById("content");
const links = document.querySelectorAll(".nav-item");

// LOGOUT
document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.clear();
    window.location.href = "login.html";
});

async function loadPage(page) {
    try {
        const response = await fetch("pages/" + page);
        if (!response.ok) throw new Error("Página não encontrada");

        const html = await response.text();
        content.innerHTML = `
            <div class="w-full max-w-none">
                ${html}
            </div>
        `;

        // Chama funções específicas para cada página
        if (page === "dashboard.html") {
            carregarEstatisticas();
            carregarGraficos();
        }
        else if (page === "usuarios.html") {
            carregarUsuarios();
        }
         else if (page === "seres.html") {
            carregarSeres();
        }
        // Adicione outras páginas aqui conforme necessário

    } catch (error) {
        content.innerHTML = `
            <div class="text-red-500 text-lg font-semibold">
                Erro ao carregar ${page}
            </div>
        `;
        console.error(error);
    }
}

// CLIQUE NO MENU
links.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const page = link.getAttribute("data-page");
        loadPage(page);
    });
});

// CARREGAR DASHBOARD INICIAL
window.addEventListener("DOMContentLoaded", () => {
    loadPage("dashboard.html");
});