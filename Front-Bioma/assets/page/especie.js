// especie.js
window.especiesCache = [];
let especieEditando = null;

// ============================ Fetch Inicial ============================
async function fetchEspecies() {
    try {
        const resp = await fetch("http://localhost:8080/api/especies");
        if (!resp.ok) throw new Error("Erro ao buscar espécies");
        window.especiesCache = await resp.json();
        renderizarEspeciesPage();
        mostrarEspecies(window.especiesCache);
    } catch (err) {
        console.error(err);
        alert("Erro ao buscar espécies.");
    }
}

// ============================ Renderizar Página ============================
function renderizarEspeciesPage() {
    const html = `
        <h2>Espécies</h2>
        <div style="margin-bottom:15px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <input type="text" id="search-especie-input" placeholder="Buscar por nome..." oninput="filtrarEspecies()">
            <select id="filter-categoria" onchange="filtrarEspecies()">
                <option value="">Todas</option>
            </select>
            <button id="btn-nova-especie" onclick="abrirFormularioNovo()">
                <i class="fas fa-plus"></i> Nova Espécie
            </button>
        </div>
        <div id="especies-container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px,1fr)); gap:20px;"></div>
    `;
    document.getElementById("main-content").innerHTML = html;

    // Estilizando input de busca (mais curto)
    const searchInput = document.getElementById("search-especie-input");
    Object.assign(searchInput.style, {
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        flex: "0 0 180px",
        transition: "0.3s",
        outline: "none",
        fontSize: "14px"
    });
    searchInput.onfocus = () => searchInput.style.borderColor = "#4CAF50";
    searchInput.onblur = () => searchInput.style.borderColor = "#ccc";

    // Estilizando select de categoria (moderno)
    const selectCategoria = document.getElementById("filter-categoria");
    Object.assign(selectCategoria.style, {
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: "#fff",
        cursor: "pointer",
        transition: "0.3s",
        outline: "none",
        fontSize: "14px"
    });
    selectCategoria.onfocus = () => selectCategoria.style.borderColor = "#4CAF50";
    selectCategoria.onblur = () => selectCategoria.style.borderColor = "#ccc";

    // Estilizando botão "Nova Espécie" (cor, bordas, hover)
    const btnNova = document.getElementById("btn-nova-especie");
    Object.assign(btnNova.style, {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        background: "#28a745",
        color: "#fff",
        cursor: "pointer",
        boxShadow: "0 6px 14px rgba(40,167,69,0.18)",
        transition: "transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease",
        fontSize: "14px"
    });
    btnNova.onmouseover = () => { btnNova.style.transform = "translateY(-2px)"; btnNova.style.boxShadow = "0 10px 20px rgba(40,167,69,0.22)"; };
    btnNova.onmouseout = () => { btnNova.style.transform = "translateY(0)"; btnNova.style.boxShadow = "0 6px 14px rgba(40,167,69,0.18)"; };

    fetchCategoriasParaFiltro();
}

// ============================ Buscar Categorias para filtro ============================
async function fetchCategoriasParaFiltro() {
    try {
        const resp = await fetch("http://localhost:8080/api/categorias");
        if (!resp.ok) throw new Error("Erro ao buscar categorias");
        const categorias = await resp.json();
        const select = document.getElementById("filter-categoria");
        if (select) {
            select.innerHTML = `<option value="">Todas</option>` +
                categorias.map(c => `<option value="${c.id}">${c.nome}</option>`).join("");
        }
    } catch (err) {
        console.error(err);
        // não interrompe a página, apenas loga
    }
}

// ============================ Filtrar Espécies ============================
function filtrarEspecies() {
    const termo = document.getElementById("search-especie-input").value.toLowerCase();
    const categoriaId = document.getElementById("filter-categoria").value;

    const filtradas = window.especiesCache.filter(e =>
        e.nome.toLowerCase().includes(termo) &&
        (categoriaId === "" || e.categoriaId == categoriaId)
    );
    mostrarEspecies(filtradas);
}

// ============================ Mostrar Espécies ============================
function mostrarEspecies(especies) {
    const container = document.getElementById("especies-container");
    container.innerHTML = "";
    especies.forEach(e => adicionarCard(e));
}

// ============================ Adicionar card ============================
function adicionarCard(especie) {
    const container = document.getElementById("especies-container");

    const card = document.createElement("div");
    Object.assign(card.style, {
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minHeight: "200px",
        transition: "transform 0.18s, box-shadow 0.18s",
        width: "100%",
        maxWidth: "300px",
        margin: "0 auto"
    });
    card.onmouseover = () => { card.style.transform = "translateY(-4px)"; card.style.boxShadow = "0 12px 28px rgba(0,0,0,0.16)"; };
    card.onmouseout = () => { card.style.transform = "translateY(0)"; card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)"; };

    const nome = document.createElement("h3");
    nome.textContent = especie.nome;
    nome.id = `especie-nome-${especie.id}`;
    Object.assign(nome.style, {margin: "0 0 6px 0", fontSize: "18px", color: "#222"});

    const descricao = document.createElement("p");
    descricao.textContent = especie.descricao ?? "—";
    descricao.style.color = "#555";
    descricao.id = `especie-descricao-${especie.id}`;
    Object.assign(descricao.style, {margin: "0 0 8px 0", fontSize: "14px"});

    const categoria = document.createElement("p");
    categoria.innerHTML = `<strong>Categoria:</strong> ${especie.categoriaNome ?? "—"}`;
    categoria.id = `especie-categoria-${especie.id}`;
    Object.assign(categoria.style, {margin: "0 0 8px 0", fontSize: "13px", color: "#333"});

    const actions = document.createElement("div");
    Object.assign(actions.style, { display: "flex", gap: "8px", marginTop: "auto" });

    const btnEditar = document.createElement("button");
    btnEditar.innerHTML = `<i class="fas fa-edit"></i>`;
    Object.assign(btnEditar.style, {
        padding: "6px 12px",
        background: "#1976D2",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background 0.12s"
    });
    btnEditar.onmouseover = () => btnEditar.style.background = "#165fa6";
    btnEditar.onmouseout = () => btnEditar.style.background = "#1976D2";
    btnEditar.onclick = () => abrirFormularioEditar(especie);

    const btnDeletar = document.createElement("button");
    btnDeletar.innerHTML = `<i class="fas fa-trash"></i>`;
    Object.assign(btnDeletar.style, {
        padding: "6px 12px",
        background: "#e53935",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background 0.12s"
    });
    btnDeletar.onmouseover = () => btnDeletar.style.background = "#c62828";
    btnDeletar.onmouseout = () => btnDeletar.style.background = "#e53935";
    btnDeletar.onclick = () => deletarEspecie(especie.id);

    actions.appendChild(btnEditar);
    actions.appendChild(btnDeletar);

    card.appendChild(nome);
    card.appendChild(descricao);
    card.appendChild(categoria);
    card.appendChild(actions);

    container.appendChild(card);
}

// ============================ Modal Criar/Editar ============================
function abrirFormularioNovo() {
    especieEditando = null;
    abrirModal({ nome: "", descricao: "", categoriaId: "" });
}

function abrirFormularioEditar(especie) {
    especieEditando = especie;
    abrirModal(especie);
}

async function abrirModal(especie) {
    let modal = document.getElementById("modal-especie");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal-especie";
        Object.assign(modal.style, {
            display: "flex",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000"
        });
        modal.innerHTML = `
            <div style="
                background:#fff;
                padding:26px;
                border-radius:14px;
                width:420px;
                max-width:92%;
                box-shadow:0 18px 40px rgba(0,0,0,0.25);
                display:flex;
                flex-direction:column;
                gap:14px;
                font-family: Arial, sans-serif;
            ">
                <h3 id="modal-titulo" style="margin:0; font-size:20px; color:#222;"></h3>
                <input type="text" id="modal-nome" placeholder="Nome">
                <textarea id="modal-descricao" placeholder="Descrição"></textarea>
                <select id="modal-categoria"></select>
                <div style="display:flex; justify-content:flex-end; gap:10px;">
                    <button id="modal-salvar" class="btn-salvar"><i class="fas fa-save"></i> Salvar</button>
                    <button id="modal-cancelar" class="btn-cancelar"><i class="fas fa-times"></i> Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // estilizando botões e inputs do modal
        const btnCancelar = modal.querySelector(".btn-cancelar");
        Object.assign(btnCancelar.style, {
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#9e9e9e",
            color: "#fff"
        });
        btnCancelar.onclick = () => modal.style.display = "none";

        const btnSalvar = modal.querySelector(".btn-salvar");
        Object.assign(btnSalvar.style, {
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#28a745",
            color: "#fff"
        });
        btnSalvar.onclick = salvarOuAtualizarEspecie;

        const inputs = modal.querySelectorAll("input, textarea, select");
        inputs.forEach(i => Object.assign(i.style, {
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            outline: "none",
            transition: "border-color .15s",
            width: "100%",
            boxSizing: "border-box",
            fontSize: "14px"
        }));
        inputs.forEach(i => {
            i.onfocus = () => i.style.borderColor = "#4CAF50";
            i.onblur = () => i.style.borderColor = "#ddd";
        });
    }

    document.getElementById("modal-titulo").textContent = especieEditando ? `Editar Espécie #${especieEditando.id}` : "Nova Espécie";
    document.getElementById("modal-nome").value = especie.nome ?? "";
    document.getElementById("modal-descricao").value = especie.descricao ?? "";

    // popula o select com as categorias (GET apenas)
    try {
        const resp = await fetch("http://localhost:8080/api/categorias");
        if (!resp.ok) throw new Error("Erro ao buscar categorias");
        const categorias = await resp.json();
        const select = document.getElementById("modal-categoria");
        select.innerHTML = `<option value="">Selecione a categoria</option>` +
            categorias.map(c => `<option value="${c.id}" ${c.id == especie.categoriaId ? "selected" : ""}>${c.nome}</option>`).join("");
    } catch (err) {
        console.error(err);
        alert("Não foi possível carregar as categorias.");
    }

    modal.style.display = "flex";
}

// ============================ Salvar ou Atualizar Espécie ============================
async function salvarOuAtualizarEspecie() {
    const modal = document.getElementById("modal-especie");
    const nome = modal.querySelector("input").value.trim();
    const descricao = modal.querySelector("textarea").value.trim();
    const categoriaIdStr = modal.querySelector("select").value;
    const categoriaId = categoriaIdStr ? parseInt(categoriaIdStr) : null;

    if (!nome || !categoriaId) return alert("Informe nome e categoria.");

    try {
        if (especieEditando) {
            const resp = await fetch(`http://localhost:8080/api/especies/${especieEditando.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, descricao, categoriaId })
            });
            if (!resp.ok) throw new Error("Erro ao atualizar espécie");
            const especieAtualizada = await resp.json();
            window.especiesCache = window.especiesCache.map(e => e.id === especieEditando.id ? especieAtualizada : e);
            atualizarCard(especieAtualizada);
            alert("Espécie atualizada!");
        } else {
            const resp = await fetch("http://localhost:8080/api/especies/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([{ nome, descricao, categoriaId }])
            });
            if (!resp.ok) throw new Error("Erro ao criar espécie");
            const nova = await resp.json();
            window.especiesCache.push(...nova);
            nova.forEach(e => adicionarCard(e));
            alert("Espécie cadastrada!");
        }
        modal.style.display = "none";
    } catch (err) {
        console.error(err);
        alert("Erro ao salvar espécie.");
    }
}

// ============================ Atualizar card existente ============================
function atualizarCard(especie) {
    const cardNome = document.getElementById(`especie-nome-${especie.id}`);
    const cardDescricao = document.getElementById(`especie-descricao-${especie.id}`);
    const cardCategoria = document.getElementById(`especie-categoria-${especie.id}`);

    if (cardNome) cardNome.textContent = especie.nome;
    if (cardDescricao) cardDescricao.textContent = especie.descricao ?? "—";
    if (cardCategoria) cardCategoria.innerHTML = `<strong>Categoria:</strong> ${especie.categoriaNome ?? "—"}`;
}

// ============================ Deletar Espécie ============================
async function deletarEspecie(id) {
    if (!confirm("Deseja realmente deletar esta espécie?")) return;
    try {
        const resp = await fetch(`http://localhost:8080/api/especies/${id}`, { method: "DELETE" });
        if (!resp.ok) throw new Error("Erro ao deletar espécie");
        window.especiesCache = window.especiesCache.filter(e => e.id !== id);
        // remove card (local)
        const card = document.getElementById(`especie-nome-${id}`)?.closest("div");
        if (card) card.remove();
        alert("Espécie deletada com sucesso!");
    } catch (err) {
        console.error(err);
        alert("Erro ao deletar espécie.");
    }
}

// ============================ Inicialização ============================
fetchEspecies();
