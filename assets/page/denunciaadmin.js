// ---------------------------- Variáveis Globais ----------------------------
window.denunciasCache = [];
window.locationCache = {};
window.especiesCache = [];

// ---------------------------- Funções de Autenticação ----------------------------
function getToken() {
    const token = localStorage.getItem("token");
    if (!token) alert("Usuário não autenticado!");
    return token;
}

function isAdmin() {
    const token = getToken();
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.roles && payload.roles.includes("ADMIN");
    } catch (err) {
        console.error("Token inválido:", err);
        return false;
    }
}

// ---------------------------- Fetch Denúncias ----------------------------
async function fetchDenuncias() {
    try {
        const token = getToken();
        if (!token) return;

        const resp = await fetch("http://localhost:8080/api/denuncias", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error("Erro ao buscar denúncias");
        const denuncias = await resp.json();
        window.denunciasCache = denuncias;
        renderizarDenunciasPage();
        mostrarDenuncias(denuncias);
    } catch (err) {
        console.error(err);
        alert("Erro ao buscar denúncias. Verifique se você está autenticado.");
    }
}

// ---------------------------- Renderização da Página ----------------------------
function renderizarDenunciasPage() {
    const html = `
        <h2>Denúncias</h2>
        <div style="margin-bottom:10px; display:flex; align-items:center; gap:10px;">
            <input type="text" id="search-input" placeholder="Buscar por título ou descrição" style="padding:5px; width:300px;">
            <button onclick="filtrarDenuncias()" style="padding:5px 10px;">Buscar</button>
        </div>
        <div id="denuncias-container" style="overflow-x:auto;"></div>
        <div id="modal-container"></div>
    `;
    document.getElementById("main-content").innerHTML = html;
}

function filtrarDenuncias() {
    const termo = document.getElementById("search-input").value.toLowerCase();
    const filtradas = window.denunciasCache.filter(d =>
        (d.titulo?.toLowerCase().includes(termo) || d.descricao?.toLowerCase().includes(termo))
    );
    mostrarDenuncias(filtradas);
}

// ---------------------------- Renderização dos Cards ----------------------------
async function mostrarDenuncias(denuncias) {
    const container = document.getElementById("denuncias-container");
    container.innerHTML = "";
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))";
    container.style.gap = "20px";
    container.style.padding = "10px";

    for (const d of denuncias) {
        // Localização
        let locationName = window.locationCache[d.id] || "Localização não encontrada";
        if (!window.locationCache[d.id] && d.latitude != null && d.longitude != null) {
            try {
                const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${d.latitude}&lon=${d.longitude}&format=json`);
                if (resp.ok) {
                    const data = await resp.json();
                    if (data.display_name) locationName = data.display_name;
                    window.locationCache[d.id] = locationName;
                }
            } catch {}
        }

        // Imagem
        const imagemSrc = d.imagem ? `data:image/jpeg;base64,${d.imagem}` : "assets/images/default.png";

        // Card
        const card = document.createElement("div");
        Object.assign(card.style, {
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
        });

        const img = document.createElement("img");
        img.src = imagemSrc;
        Object.assign(img.style, { width: "100%", height: "180px", objectFit: "cover" });
        card.appendChild(img);

        const body = document.createElement("div");
        Object.assign(body.style, { padding: "12px", display: "flex", flexDirection: "column", gap: "6px" });

        const titulo = document.createElement("h4");
        titulo.textContent = d.titulo ?? "—";
        titulo.style.margin = 0;

        const descricao = document.createElement("p");
        descricao.style.margin = 0;
        descricao.style.fontSize = "13px";
        descricao.style.color = "#555";
        descricao.textContent = d.descricao ?? "";

        const info = document.createElement("p");
        info.style.fontSize = "12px";
        info.style.color = "#444";
        info.innerHTML = `
            <strong>ID:</strong> ${d.id} <br>
            <strong>Espécie:</strong> ${d.especie?.nome ?? "Desconhecida"} <br>
            <strong>Status:</strong> ${d.statusAprovacao ?? "—"} <br>
            <strong>Data:</strong> ${d.dataDenuncia ? new Date(d.dataDenuncia).toLocaleDateString() : "—"} <br>
            <strong>Localização:</strong> ${locationName} <br>
            <strong>Denunciado Por:</strong> ${d.denunciadoPor?.login ?? "—"}
        `;

        body.appendChild(titulo);
        body.appendChild(descricao);
        body.appendChild(info);

        // Botões
        const actions = document.createElement("div");
        Object.assign(actions.style, { display: "flex", justifyContent: "space-between", marginTop: "10px" });

        const criarBotao = (icon, cor, acao, title) => {
            const btn = document.createElement("button");
            Object.assign(btn.style, { background: cor, border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer", padding: "6px 10px" });
            btn.innerHTML = icon;
            btn.title = title;
            btn.onclick = acao;
            return btn;
        };

        actions.appendChild(criarBotao('<i class="fas fa-eye"></i>', "#6c757d", () => abrirDetalhesDenuncia(d), "Ver detalhes"));
        actions.appendChild(criarBotao('<i class="fas fa-edit"></i>', "#2196F3", () => abrirModalAtualizarDenuncia(d), "Editar denúncia"));
        actions.appendChild(criarBotao('<i class="fas fa-trash-alt"></i>', "#f44336", () => deletarDenuncia(d.id), "Deletar denúncia"));
        actions.appendChild(criarBotao('<i class="fas fa-check"></i>', "#28a745", () => aprovarDenuncia(d.id), "Aprovar denúncia"));

        body.appendChild(actions);
        card.appendChild(body);
        container.appendChild(card);
    }
}

// ---------------------------- Ver detalhes ----------------------------
function abrirDetalhesDenuncia(denuncia) {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;
    modalContainer.innerHTML = "";

    const overlay = document.createElement("div");
    Object.assign(overlay.style, { position: "fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", zIndex:999 });
    overlay.onclick = () => modalContainer.innerHTML = "";

    const modal = document.createElement("div");
    Object.assign(modal.style, { position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"#fefefe", padding:"25px", borderRadius:"12px", boxShadow:"0 10px 25px rgba(0,0,0,0.3)", zIndex:1000, width:"500px", maxHeight:"90%", overflowY:"auto" });

    const h3 = document.createElement("h3");
    h3.textContent = `Denúncia #${denuncia.id}`;
    modal.appendChild(h3);

    const info = document.createElement("p");
    info.innerHTML = `
        <strong>Título:</strong> ${denuncia.titulo} <br>
        <strong>Descrição:</strong> ${denuncia.descricao} <br>
        <strong>Espécie:</strong> ${denuncia.especie?.nome ?? "Desconhecida"} <br>
        <strong>Status:</strong> ${denuncia.statusAprovacao ?? "—"} <br>
        <strong>Data:</strong> ${denuncia.dataDenuncia ? new Date(denuncia.dataDenuncia).toLocaleDateString() : "—"} <br>
        <strong>Denunciado por:</strong> ${denuncia.denunciadoPor?.login ?? "—"}
    `;
    modal.appendChild(info);

    modalContainer.appendChild(overlay);
    modalContainer.appendChild(modal);
}

// ---------------------------- Funções de Ação ----------------------------
async function aprovarDenuncia(id) {
    if (!isAdmin()) return alert("Apenas administradores podem aprovar denúncias.");
    const token = getToken();
    if (!token) return alert("Token não encontrado.");

    try {
        const res = await fetch(`http://localhost:8080/api/denuncias/${id}/aprovar`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        alert(`Denúncia #${id} aprovada com sucesso!`);
        fetchDenuncias();
    } catch (err) {
        console.error(err);
        alert("Erro ao aprovar denúncia: " + err.message);
    }
}

async function deletarDenuncia(id) {
    if (!isAdmin()) return alert("Apenas administradores podem deletar denúncias.");
    if (!confirm(`Deseja realmente deletar a denúncia #${id}?`)) return;
    const token = getToken();
    if (!token) return;

    try {
        const res = await fetch(`http://localhost:8080/api/denuncias/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
        alert(`Denúncia #${id} deletada com sucesso!`);
        fetchDenuncias();
    } catch (err) {
        console.error(err);
        alert("Erro ao deletar denúncia: " + err.message);
    }
}

// ---------------------------- Modal Atualização ----------------------------
// ---------------------------- Modal Atualização ----------------------------
async function abrirModalAtualizarDenuncia(denuncia) {
    if (!isAdmin()) return alert("Apenas administradores podem atualizar denúncias.");
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;
    modalContainer.innerHTML = "";

    const overlay = document.createElement("div");
    Object.assign(overlay.style, { position: "fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", zIndex:999 });
    overlay.onclick = () => modalContainer.innerHTML = "";

    const modal = document.createElement("div");
    Object.assign(modal.style, { position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"#fefefe", padding:"25px", borderRadius:"12px", boxShadow:"0 10px 25px rgba(0,0,0,0.3)", zIndex:1000, width:"500px", maxHeight:"90%", overflowY:"auto" });

    const h3 = document.createElement("h3");
    h3.textContent = `Atualizar Denúncia #${denuncia.id}`;
    modal.appendChild(h3);

    const form = document.createElement("form");
    Object.assign(form.style, { display:"flex", flexDirection:"column", gap:"10px" });

    ["titulo","descricao","latitude","longitude"].forEach(name => {
        const label = document.createElement("label");
        Object.assign(label.style,{ display:"flex", flexDirection:"column", gap:"4px" });
        const span = document.createElement("span");
        span.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        label.appendChild(span);
        const input = document.createElement("input");
        input.type = (name === "latitude" || name === "longitude") ? "number" : "text";
        input.name = name;
        input.step = "any";
        input.value = denuncia[name] ?? "";
        Object.assign(input.style,{ width:"100%", padding:"5px" });
        label.appendChild(input);
        form.appendChild(label);
    });

    // Select espécies
    const labelEspecie = document.createElement("label");
    Object.assign(labelEspecie.style,{ display:"flex", flexDirection:"column", gap:"4px" });
    const spanEspecie = document.createElement("span");
    spanEspecie.textContent = "Espécie";
    labelEspecie.appendChild(spanEspecie);

    const selectEspecie = document.createElement("select");
    selectEspecie.name="especieId";
    Object.assign(selectEspecie.style,{ width:"100%", padding:"5px" });

    if (!window.especiesCache.length) {
        try {
            const resp = await fetch("http://localhost:8080/api/especies", {
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            if (resp.ok) window.especiesCache = await resp.json();
        } catch (err) { console.error(err); window.especiesCache=[]; }
    }

    window.especiesCache.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e.id;
        opt.textContent = e.nome;
        if (denuncia.especie?.id===e.id) opt.selected=true;
        selectEspecie.appendChild(opt);
    });

    labelEspecie.appendChild(selectEspecie);
    form.appendChild(labelEspecie);

    const salvarBtn = document.createElement("button");
    salvarBtn.type="submit";
    salvarBtn.textContent="Salvar";
    Object.assign(salvarBtn.style,{ padding:"8px 15px", background:"#2196F3", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer" });
    form.appendChild(salvarBtn);

    form.onsubmit = async e => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;

        const payload = {
            titulo: form.titulo.value,
            descricao: form.descricao.value,
            especieId: parseInt(form.especieId.value),
            latitude: parseFloat(form.latitude.value),
            longitude: parseFloat(form.longitude.value)
        };

        try {
            const resp = await fetch(`http://localhost:8080/api/denuncias/${denuncia.id}/atualizar-por-nome`, {
                method:"PUT",
                headers:{ 
                    "Content-Type":"application/json", 
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });
            if (!resp.ok) throw new Error(`Erro HTTP ${resp.status}`);
            alert("Denúncia atualizada com sucesso!");
            modalContainer.innerHTML="";
            fetchDenuncias();
        } catch(err) {
            console.error(err);
            alert("Erro ao atualizar denúncia: "+err.message);
        }
    };

    modal.appendChild(form);
    modalContainer.appendChild(overlay);
    modalContainer.appendChild(modal);
}

// ---------------------------- Inicialização ----------------------------
async function init() {
    fetchDenuncias();
}

init();
