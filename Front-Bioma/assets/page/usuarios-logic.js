const API_USUARIOS = "http://localhost:8080/api/usuarios";


// Função para listar usuários em cards estilo Pinterest com toggle ON/OFF
// Função para listar usuários em cards estilo Pinterest com toggle ON/OFF moderno
async function carregarUsuarios() {
    const container = document.getElementById("usuarios-container");
    if (!container) return;

    try {
        const res = await fetchWithAuth(API_USUARIOS);
        if (!res.ok) throw new Error("Erro ao buscar usuários");

        const usuarios = await res.json();
        container.innerHTML = ""; // limpa antes de adicionar

        usuarios.forEach(usuario => {
            const card = document.createElement("div");
            card.className = "bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center";

            // Avatar genérico moderno
            const avatarSvg = `
                <div class="w-24 h-24 mb-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-5xl">
                    <i class="fas fa-user"></i>
                </div>
            `;

            // Toggle switch moderno
            const toggleSwitch = `
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only" ${usuario.enabled ? 'checked' : ''} 
                           onchange="toggleUsuario('${usuario.id}', this.checked)">
                    <div class="w-16 h-8 bg-gray-300 rounded-full peer ${usuario.enabled ? 'bg-green-500' : ''} transition-colors"></div>
                    <div class="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform transform ${usuario.enabled ? 'translate-x-8' : ''}"></div>
                    <span class="absolute w-full text-center text-xs font-semibold text-white pointer-events-none">
                        ${usuario.enabled ? 'ON' : 'OFF'}
                    </span>
                </label>
            `;

            // Container dos botões (lado a lado)
            const buttonsContainer = `
                <div class="mt-4 flex gap-4 items-center">
                    <button onclick="deletarUsuario('${usuario.id}')" 
                            class="px-3 py-1 text-red-500 rounded hover:bg-red-50 transition flex items-center gap-2">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    ${toggleSwitch}
                </div>
            `;

            card.innerHTML = `
                ${avatarSvg}
                <h3 class="text-lg font-semibold mb-1">${usuario.nomeCompleto}</h3>
                <p class="text-gray-500 mb-2">${usuario.email}</p>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${
                    usuario.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }">
                    ${usuario.role}
                </span>
                ${buttonsContainer}
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        container.innerHTML = "<p class='text-red-500 text-center'>Não foi possível carregar usuários.</p>";
    }
}
// Função para deletar usuário
async function deletarUsuario(id) {
    if (!confirm("Deseja realmente deletar este usuário?")) return;

    try {
        const res = await fetchWithAuth(`${API_USUARIOS}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Erro ao deletar usuário");

        carregarUsuarios();
    } catch (error) {
        console.error(error);
        alert("Falha ao deletar usuário.");
    }
}

// Função para ativar/desativar usuário
async function toggleUsuario(id, isEnabled) {
    const acao = isEnabled ? "ativar" : "desativar"; // a lógica depende do backend
    try {
        const res = await fetchWithAuth(`${API_USUARIOS}/${id}/${acao}`, { method: "PATCH" });
        if (!res.ok) throw new Error(`Erro ao ${acao} usuário`);

        carregarUsuarios();
    } catch (error) {
        console.error(error);
        alert(`Falha ao ${acao} usuário.`);
    }
}

// Chama a função ao carregar a página de usuários
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("usuarios-container")) {
        carregarUsuarios();
    }
});