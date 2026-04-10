const API_SERES = "http://localhost:8080/api/seres";

let seresCache = [];

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
    carregarSeres();

    document.getElementById("filtro-nome")
        .addEventListener("input", debounce(filtrarLocal, 300));

    document.getElementById("filtro-status")
        .addEventListener("change", filtrarLocal);
});

// =========================
// CARREGAR TODOS
// =========================
async function carregarSeres() {
    try {
        const res = await fetchWithAuth(API_SERES);
        if (!res.ok) throw new Error();

        seresCache = await res.json();
        filtrarLocal();

    } catch (error) {
        console.error(error);
        document.getElementById("seres-container").innerHTML =
            "<p class='text-red-500 text-center'>Erro ao carregar seres</p>";
    }
}

// =========================
// FILTRO LOCAL (rápido)
// =========================
function filtrarLocal() {
    const nome = document.getElementById("filtro-nome").value.toLowerCase();
    const status = document.getElementById("filtro-status").value;

    const filtrados = seresCache.filter(s => {
        const matchNome =
            !nome ||
            s.nomeComum?.toLowerCase().includes(nome) ||
            s.nomeCientifico?.toLowerCase().includes(nome);

        const matchStatus =
            !status || s.statusConservacao === status;

        return matchNome && matchStatus;
    });

    renderizarSeres(filtrados);
}

// =========================
// RENDERIZAR
// =========================
async function renderizarSeres(seres) {
    const container = document.getElementById("seres-container");
    container.innerHTML = "";

    const usuarioRole = localStorage.getItem("role");

    if (!seres.length) {
        container.innerHTML = "<p class='text-center'>Nenhum ser encontrado</p>";
        return;
    }

    for (const ser of seres) {
        // 🔥 IMAGEM CORRIGIDA (fetch base64)
        let imagemSrc = "https://via.placeholder.com/300x200";

        try {
            const imgRes = await fetch(`${API_SERES}/${ser.id}/imagem`);
            if (imgRes.ok) {
                const base64 = await imgRes.text();
                if (base64) {
                    imagemSrc = `data:image/jpeg;base64,${base64}`;
                }
            }
        } catch {}

        // 🔥 ESPÉCIE CORRIGIDA
        const especieNome = ser.especie?.nome || ser.especie || "—";

        // 🔥 MONTAGEM DOS BOTÕES
        // Botões comuns a todos os usuários autenticados
        let botoes = `
            <button onclick="aprovarSer(${ser.id})" title="Aprovar"
                class="text-green-500 hover:bg-green-50 p-2 rounded">
                <i class="fas fa-check"></i>
            </button>

            <button onclick="rejeitarSer(${ser.id})" title="Rejeitar"
                class="text-orange-500 hover:bg-orange-50 p-2 rounded">
                <i class="fas fa-ban"></i>
            </button>

            <button onclick="editarSer(${ser.id})" title="Editar"
                class="text-blue-500 hover:bg-blue-50 p-2 rounded">
                <i class="fas fa-edit"></i>
            </button>

            <button onclick="deletarSer(${ser.id})" title="Excluir"
                class="text-red-500 hover:bg-red-50 p-2 rounded">
                <i class="fas fa-trash"></i>
            </button>
        `;

        // Botão exclusivo para ADMIN
        if (usuarioRole === "ADMIN") {
            botoes += `
                <button onclick="desaprovarSer(${ser.id})" title="Desaprovar"
                    class="text-yellow-500 hover:bg-yellow-50 p-2 rounded">
                    <i class="fas fa-times"></i>
                </button>
            `;
        }

        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-2xl shadow hover:shadow-lg transition";

        card.innerHTML = `
            <img src="${imagemSrc}" 
                class="w-full h-40 object-cover rounded-lg mb-3">

            <h3 class="text-lg font-bold">${ser.nomeComum}</h3>
            <p class="text-gray-500 text-sm italic">${ser.nomeCientifico}</p>

            <p class="text-sm mt-2">
                <span class="font-semibold">Espécie:</span> ${especieNome}
            </p>

            <span class="inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                ser.statusConservacao === 'CRITICAMENTE_EM_PERIGO'
                    ? 'bg-red-100 text-red-600'
                    : ser.statusConservacao === 'EM_PERIGO'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-yellow-100 text-yellow-600'
            }">
                ${ser.statusConservacao}
            </span>

            <div class="mt-4 flex justify-center gap-2">
                ${botoes}
            </div>
        `;

        container.appendChild(card);
    }
}

// =========================
// DEBOUNCE
// =========================
function debounce(func, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };
}

// =========================
// AÇÕES
// =========================

async function aprovarSer(id) {
    try {
        const login = localStorage.getItem("login");
        const email = localStorage.getItem("email");

        await fetchWithAuth(
            `${API_SERES}/${id}/aprovar?usuarioLogin=${login}&usuarioEmail=${email}`,
            { method: "POST" }
        );

        carregarSeres();
    } catch {
        alert("Erro ao aprovar");
    }
}

async function rejeitarSer(id) {
    if (!confirm("Deseja rejeitar este registro?")) return;
    try {
        const login = localStorage.getItem("login");
        const email = localStorage.getItem("email");

        await fetchWithAuth(
            `${API_SERES}/${id}/rejeitar?usuarioLogin=${login}&usuarioEmail=${email}`,
            { method: "POST" }
        );

        carregarSeres();
    } catch {
        alert("Erro ao rejeitar");
    }
}

async function desaprovarSer(id) {
    if (!confirm("Deseja desaprovar?")) return;

    try {
        const login = localStorage.getItem("login");
        const email = localStorage.getItem("email");

        await fetchWithAuth(
            `${API_SERES}/${id}/desaprovar?usuarioLogin=${login}&usuarioEmail=${email}`,
            { method: "POST" }
        );

        carregarSeres();
    } catch {
        alert("Erro ao desaprovar");
    }
}

async function deletarSer(id) {
    if (!confirm("Deseja deletar?")) return;

    try {
        const login = localStorage.getItem("login");
        const email = localStorage.getItem("email");

        await fetchWithAuth(
            `${API_SERES}/${id}?usuarioLogin=${login}&usuarioEmail=${email}`,
            { method: "DELETE" }
        );

        carregarSeres();
    } catch {
        alert("Erro ao deletar");
    }
}

// Funções de controle do Drawer
function abrirDrawer() {
    document.getElementById("drawer-editar").classList.remove("translate-x-full");
    document.getElementById("overlay").classList.remove("hidden");
}

function fecharDrawer() {
    document.getElementById("drawer-editar").classList.add("translate-x-full");
    document.getElementById("overlay").classList.add("hidden");
}

// Fechar ao clicar no overlay
document.getElementById("overlay").addEventListener("click", fecharDrawer);

// =========================
// CARREGAR DADOS NO FORM
// =========================
async function editarSer(id) {
    // Busca os dados atuais do cache para preencher o form
    const ser = seresCache.find(s => s.id === id);
    if (!ser) return;

    // Preenche os campos
    document.getElementById("edit-id").value = ser.id;
    document.getElementById("edit-nomeComum").value = ser.nomeComum || "";
    document.getElementById("edit-nomeCientifico").value = ser.nomeCientifico || "";
    document.getElementById("edit-tipo").value = ser.tipo?.nome || "";
    document.getElementById("edit-especie").value = ser.especie?.nome || "";
    document.getElementById("edit-status").value = ser.statusConservacao;
    document.getElementById("edit-descricao").value = ser.descricao || "";
    document.getElementById("edit-lat").value = ser.latitude || 0;
    document.getElementById("edit-long").value = ser.longitude || 0;

    abrirDrawer();
}

// =========================
// ENVIAR ATUALIZAÇÃO (Multipart)
// =========================
document.getElementById("form-editar").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const login = localStorage.getItem("login");
    const email = localStorage.getItem("email");

    // Criar o FormData (necessário para MultipartFile)
    const formData = new FormData();
    formData.append("nomeComum", document.getElementById("edit-nomeComum").value);
    formData.append("nomeCientifico", document.getElementById("edit-nomeCientifico").value);
    formData.append("tipoNome", document.getElementById("edit-tipo").value);
    formData.append("especieNome", document.getElementById("edit-especie").value);
    formData.append("descricao", document.getElementById("edit-descricao").value);
    formData.append("statusConservacao", document.getElementById("edit-status").value);
    formData.append("latitude", document.getElementById("edit-lat").value);
    formData.append("longitude", document.getElementById("edit-long").value);
    formData.append("usuarioLogin", login);
    formData.append("usuarioEmail", email);

    const fileInput = document.getElementById("edit-imagem");
    if (fileInput.files[0]) {
        formData.append("imagemFile", fileInput.files[0]);
    }

    try {
        // Observe o endpoint: /{id}/atualizar-multipart
        const res = await fetchWithAuth(`${API_SERES}/${id}/atualizar-multipart`, {
            method: "PUT",
            body: formData 
            // Dica: Não defina Content-Type manualmente ao usar FormData, 
            // o navegador faz isso automaticamente incluindo o boundary.
        });

        if (res.ok) {
            alert("Atualizado com sucesso!");
            fecharDrawer();
            carregarSeres(); // Recarrega a lista
        } else {
            alert("Erro ao atualizar. Verifique os dados.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
});




