// ========================== INICIO TIPO ==================================================================================================================
window.tiposCache = [];
window.especiesCache = [];
let tipoEditando = null;
// tipo.js
window.tiposCache = [];

// ---------------- Buscar Tipos ----------------
async function fetchTipos() {
    try {
        const resp = await fetch("http://localhost:8080/api/tipos");
        if (!resp.ok) throw new Error("Erro ao buscar tipos");
        const tipos = await resp.json(); 
        window.tiposCache = tipos;

        renderizarTiposPage();
        mostrarTipos(tipos);
    } catch (err) {
        console.error(err);
        alert("Erro ao buscar tipos.");
    }
}

// ---------------- Renderizar página de tipos ----------------
function renderizarTiposPage() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
        <h2>Tipos</h2>
        <div style="margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
            <input id="buscar-tipo" placeholder="Buscar por nome..." style="padding:5px; width:200px;">
            <button id="btn-cadastrar-tipo" style="padding:5px 10px; cursor:pointer; background:#2196F3; color:#fff; border:none; border-radius:6px;">+ Novo Tipo</button>
        </div>
        <div id="tipos-container" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:15px;"></div>

        <!-- Modal -->
        <div id="modal-tipo" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); 
            justify-content:center; align-items:center; z-index:1000;">
            <div style="background:#fff; padding:20px; border-radius:10px; width:400px; max-width:90%; box-shadow:0 5px 20px rgba(0,0,0,0.3);">
                <h3 id="form-tipo-titulo">Cadastrar Novo Tipo</h3>
                <input type="text" id="tipo-nome" placeholder="Nome do tipo" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
                <textarea id="tipo-descricao" placeholder="Descrição do tipo" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;"></textarea>
                <select id="tipo-especie" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px;">
                    <option value="">Selecione a espécie</option>
                </select>
                <div style="display:flex; justify-content:flex-end; gap:10px;">
                    <button id="btn-salvar-tipo" style="padding:8px 12px; cursor:pointer; background:#28a745; border:none; color:#fff; border-radius:6px;">Salvar</button>
                    <button id="btn-cancelar-tipo" style="padding:8px 12px; cursor:pointer; background:#dc3545; border:none; color:#fff; border-radius:6px;">Cancelar</button>
                </div>
            </div>
        </div>
    `;

    // Preencher select com espécies
    const selectEspecie = document.getElementById("tipo-especie");
    window.especiesCache.forEach(e => {
        const option = document.createElement("option");
        option.value = e.id;
        option.textContent = e.nome;
        selectEspecie.appendChild(option);
    });

    // Eventos
    document.getElementById("btn-cadastrar-tipo").onclick = abrirFormularioNovoTipo;
    document.getElementById("btn-cancelar-tipo").onclick = fecharFormularioTipo;
    document.getElementById("btn-salvar-tipo").onclick = salvarOuAtualizarTipo;

    // Fechar modal ao clicar fora
    document.getElementById("modal-tipo").onclick = (e) => {
        if (e.target.id === "modal-tipo") fecharFormularioTipo();
    };

    // Busca por nome
    document.getElementById("buscar-tipo").oninput = () => {
        const filtro = document.getElementById("buscar-tipo").value.toLowerCase();
        const filtrados = window.tiposCache.filter(t => t.nome.toLowerCase().includes(filtro));
        mostrarTipos(filtrados);
    };
}

// ---------------- Mostrar tipos em cards ----------------
function mostrarTipos(tipos) {
    const container = document.getElementById("tipos-container");
    container.innerHTML = "";

    tipos.forEach(t => {
        const card = document.createElement("div");
        Object.assign(card.style, {
            background:"#fff",
            borderRadius:"12px",
            padding:"15px",
            boxShadow:"0 4px 12px rgba(0,0,0,0.1)",
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-between"
        });

        const title = document.createElement("h4");
        title.textContent = t.nome;

        const desc = document.createElement("p");
        desc.textContent = t.descricao || "Sem descrição.";
        desc.style.color = "#555";
        desc.style.fontSize = "14px";

        const especie = document.createElement("p");
        especie.textContent = t.especieNome || "Sem espécie";
        especie.style.color = "#888";
        especie.style.fontSize = "12px";

        const actions = document.createElement("div");
        Object.assign(actions.style, {display:"flex", gap:"8px", marginTop:"10px"});

        // Botão editar
        const btnEdit = document.createElement("button");
        btnEdit.innerHTML = `<i class="fas fa-edit"></i>`;
        Object.assign(btnEdit.style, {background:"#2196F3", border:"none", color:"#fff", borderRadius:"6px", padding:"6px 10px", cursor:"pointer"});
        btnEdit.onclick = () => abrirEditarTipo(t);

        // Botão deletar
        const btnDelete = document.createElement("button");
        btnDelete.innerHTML = `<i class="fas fa-trash"></i>`;
        Object.assign(btnDelete.style, {background:"#dc3545", border:"none", color:"#fff", borderRadius:"6px", padding:"6px 10px", cursor:"pointer"});
        btnDelete.onclick = () => deletarTipo(t.id);

        actions.appendChild(btnEdit);
        actions.appendChild(btnDelete);

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(especie);
        card.appendChild(actions);

        container.appendChild(card);
    });
}

// ---------------- Abrir modal NOVO tipo ----------------
function abrirFormularioNovoTipo() {
    tipoEditando = null;
    document.getElementById("form-tipo-titulo").textContent = "Cadastrar Novo Tipo";
    document.getElementById("tipo-nome").value = "";
    document.getElementById("tipo-descricao").value = "";
    document.getElementById("tipo-especie").value = "";
    document.getElementById("modal-tipo").style.display = "flex";
}

// ---------------- Abrir modal EDITAR tipo ----------------
function abrirEditarTipo(tipo) {
    tipoEditando = tipo;
    document.getElementById("form-tipo-titulo").textContent = "Editar Tipo";
    document.getElementById("tipo-nome").value = tipo.nome;
    document.getElementById("tipo-descricao").value = tipo.descricao || "";
    document.getElementById("tipo-especie").value = tipo.especieId;
    document.getElementById("modal-tipo").style.display = "flex";
}

// ---------------- Fechar modal ----------------
function fecharFormularioTipo() {
    document.getElementById("modal-tipo").style.display = "none";
    tipoEditando = null;
}

// ---------------- Salvar ou Atualizar ----------------
async function salvarOuAtualizarTipo() {
    const nome = document.getElementById("tipo-nome").value.trim();
    const descricao = document.getElementById("tipo-descricao").value.trim();
    const especieId = document.getElementById("tipo-especie").value;

    if (!nome) return alert("Informe o nome do tipo.");
    if (!especieId) return alert("Selecione a espécie.");

    try {
        if (tipoEditando) {
            // Atualizar
            const resp = await fetch(`http://localhost:8080/api/tipos/${tipoEditando.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, descricao, especieId: parseInt(especieId) })
            });
            if (!resp.ok) throw new Error("Erro ao atualizar tipo");

            const atualizado = await resp.json();
            window.tiposCache = window.tiposCache.map(t => t.id === tipoEditando.id ? atualizado : t);
            alert("Tipo atualizado!");
        } else {
            // Criar novo
            const resp = await fetch("http://localhost:8080/api/tipos/criar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([{ nome, descricao, especieId: parseInt(especieId) }])
            });
            if (!resp.ok) throw new Error("Erro ao cadastrar tipo");

            const novosTipos = await resp.json();
            window.tiposCache.push(...novosTipos);
            alert("Tipo cadastrado com sucesso!");
        }

        mostrarTipos(window.tiposCache);
        fecharFormularioTipo();

    } catch (err) {
        console.error(err);
        alert("Erro ao salvar tipo.");
    }
}

// ---------------- Deletar tipo ----------------
async function deletarTipo(id) {
    if (!confirm("Deseja realmente deletar este tipo?")) return;
    try {
        const resp = await fetch(`http://localhost:8080/api/tipos/${id}`, { method: "DELETE" });
        if (!resp.ok) throw new Error("Erro ao deletar tipo");

        window.tiposCache = window.tiposCache.filter(t => t.id !== id);
        mostrarTipos(window.tiposCache);
        alert("Tipo deletado com sucesso!");
    } catch (err) {
        console.error(err);
        alert("Erro ao deletar tipo.");
    }
}
// ========================== FIM TIPO ==================================================================================================================
