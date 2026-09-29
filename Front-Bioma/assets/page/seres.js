// ========================== SERES ==========================

// ---------------------------- Variáveis Globais ----------------------------
window.seresCache = [];
window.especiesCache = [];
window.locationCache = {};

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

// ---------------------------- Buscar Seres ----------------------------
async function fetchSeres() {
    try {
        const resp = await fetch("http://localhost:8080/api/seres"); // GET público
        if (!resp.ok) throw new Error("Erro ao buscar seres");
        const seres = await resp.json();
        window.seresCache = seres;
        renderizarSeresPage();
        mostrarSeres(seres);
    } catch (err) {
        console.error(err);
        alert("Erro ao buscar seres");
    }
}

// ---------------------------- Renderizar Página ----------------------------
function renderizarSeresPage() {
    const html = `
        <h2>Seres</h2>
        <div style="margin-bottom:10px; display:flex; align-items:center; gap:10px;">
            <input type="text" id="search-nome" placeholder="Nome comum ou científico" style="padding:5px; width:300px;">
            <select id="search-especie" style="padding:5px; width:150px;">
                <option value="">Espécie</option>
            </select>
            <select id="search-status" style="padding:5px;">
                <option value="">Status Aprovação</option>
                <option value="PENDENTE">Pendente</option>
                <option value="APROVADO">Aprovado</option>
                <option value="REJEITADA">Rejeitada</option>
                <option value="RESOLVIDA">Resolvida</option>
                <option value="NAO_RESOLVIDA">Não resolvida</option>
            </select>
            <button onclick="filtrarSeres()" style="padding:5px 10px;">Buscar</button>
        </div>
        <div id="cards-seres" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:15px; padding:10px;"></div>
        <div id="modal-container"></div>
    `;
    document.getElementById("main-content").innerHTML = html;
    fetchEspeciesDropdown();
}

// ---------------------------- Preencher Dropdown de Espécies ----------------------------
async function fetchEspeciesDropdown() {
    if (window.especiesCache.length === 0) {
        try {
            const token = getToken();
            const resp = await fetch("http://localhost:8080/api/especies", {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });
            if (resp.ok) window.especiesCache = await resp.json();
        } catch (err) { console.error(err); }
    }
    const select = document.getElementById("search-especie");
    select.innerHTML = `<option value="">Espécie</option>` +
        window.especiesCache.map(e => `<option value="${e.nome}">${e.nome}</option>`).join('');
}

// ---------------------------- Filtrar Seres ----------------------------
function filtrarSeres() {
    const nome = document.getElementById("search-nome").value.toLowerCase();
    const especie = document.getElementById("search-especie").value;
    const status = document.getElementById("search-status").value;

    const filtrados = window.seresCache.filter(s =>
        (!nome || s.nomeComum?.toLowerCase().includes(nome) || s.nomeCientifico?.toLowerCase().includes(nome)) &&
        (!especie || s.especie?.nome === especie) &&
        (!status || s.statusAprovacao === status)
    );

    mostrarSeres(filtrados);
}

// ---------------------------- Mostrar Seres ----------------------------
async function mostrarSeres(seres) {
    const container = document.getElementById("cards-seres");
    if (!container) return;

    container.innerHTML = "";

    seres.forEach((s) => {
        const card = document.createElement("div");
        Object.assign(card.style, {
            background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden", display: "flex", flexDirection: "column"
        });

        const img = document.createElement("img");
        img.src = "assets/images/default.png";
        Object.assign(img.style, { width: "100%", height: "180px", objectFit: "cover" });
        card.appendChild(img);

        const body = document.createElement("div");
        Object.assign(body.style, { padding: "12px", display: "flex", flexDirection: "column", gap: "6px" });

        const titulo = document.createElement("h4");
        titulo.textContent = s.nomeComum ?? "—";
        const subtitulo = document.createElement("p");
        subtitulo.style.margin = 0;
        subtitulo.style.fontSize = "14px";
        subtitulo.style.color = "#555";
        subtitulo.textContent = s.nomeCientifico ? `(${s.nomeCientifico})` : "";

        const info = document.createElement("p");
        info.style.fontSize = "13px";
        info.style.color = "#444";
        info.innerHTML = `
            <strong>Espécie:</strong> ${s.especie?.nome ?? "—"} <br>
            <strong>Tipo:</strong> ${s.tipo?.nome ?? "—"} <br>
            <strong>Localização:</strong> <span id="loc-${s.id}">Carregando...</span> <br>
            <strong>Status Aprovação:</strong> ${s.statusAprovacao ?? "—"}
        `;

        body.appendChild(titulo);
        body.appendChild(subtitulo);
        body.appendChild(info);

        // Botões de ação (apenas admins)
        if (isAdmin()) {
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
            actions.appendChild(criarBotao('<i class="fas fa-eye"></i>', "#6c757d", () => abrirDetalhesSer(s), "Ver detalhes"));
            actions.appendChild(criarBotao('<i class="fas fa-edit"></i>', "#2196F3", () => abrirModalAtualizarSer(s), "Editar ser"));
            actions.appendChild(criarBotao('<i class="fas fa-trash-alt"></i>', "#f44336", () => deletarSer(s.id), "Deletar ser"));
            actions.appendChild(criarBotao('<i class="fas fa-check"></i>', "#28a745", () => aprovarSer(s.id), "Aprovar ser"));
            body.appendChild(actions);
        }

        card.appendChild(body);
        container.appendChild(card);

        // Carregar imagem Base64 do backend
        (async () => {
            try {
                const resp = await fetch(`http://localhost:8080/api/seres/${s.id}/imagem`);
                if (resp.ok) {
                    const base64 = await resp.text();
                    if (base64) img.src = `data:image/jpeg;base64,${base64}`;
                }
            } catch (err) {
                console.error("Erro ao carregar imagem do ser", s.id, err);
            }
        })();

        // Carregar localização via OpenStreetMap
        (async () => {
            let locationName = "Localização não encontrada";
            if (window.locationCache[s.id]) locationName = window.locationCache[s.id];
            else if (s.latitude != null && s.longitude != null) {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${s.latitude}&lon=${s.longitude}&format=json`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.display_name) locationName = data.display_name;
                    }
                    window.locationCache[s.id] = locationName;
                } catch {}
            }
            const locEl = document.getElementById(`loc-${s.id}`);
            if (locEl) locEl.textContent = locationName;
        })();
    });
}

// ---------------------------- Detalhes Ser ----------------------------
function abrirDetalhesSer(s) {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;
    modalContainer.innerHTML = "";

    const overlay = document.createElement("div");
    Object.assign(overlay.style, { position:"fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", zIndex:999 });
    overlay.onclick = () => modalContainer.innerHTML="";

    const modal = document.createElement("div");
    Object.assign(modal.style, { position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"#fefefe", padding:"25px", borderRadius:"12px", boxShadow:"0 10px 25px rgba(0,0,0,0.3)", zIndex:1000, width:"500px", maxHeight:"90%", overflowY:"auto" });

    const h3 = document.createElement("h3");
    h3.textContent = `Ser #${s.id}`;
    modal.appendChild(h3);

    const info = document.createElement("p");
    info.innerHTML = `
        <strong>Nome comum:</strong> ${s.nomeComum} <br>
        <strong>Nome científico:</strong> ${s.nomeCientifico ?? "—"} <br>
        <strong>Espécie:</strong> ${s.especie?.nome ?? "Desconhecida"} <br>
        <strong>Status:</strong> ${s.statusAprovacao ?? "—"} <br>
        <strong>Localização:</strong> ${s.latitude && s.longitude ? window.locationCache[s.id] : "—"} <br>
        <strong>Registrado por:</strong> ${s.registradoPor?.login ?? "—"}
    `;
    modal.appendChild(info);

    modalContainer.appendChild(overlay);
    modalContainer.appendChild(modal);
}

// ---------------------------- Ações Seres ----------------------------
async function aprovarSer(id) {
    if (!isAdmin()) return alert("Apenas administradores podem aprovar seres.");
    const token = getToken(); if(!token) return;
    try {
        const res = await fetch(`http://localhost:8080/api/seres/${id}/aprovar`, { method:"POST", headers:{ "Authorization": `Bearer ${token}` } });
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        alert(`Ser #${id} aprovado com sucesso!`);
        fetchSeres();
    } catch(err) { console.error(err); alert("Erro ao aprovar ser: "+err.message); }
}

async function deletarSer(id) {
    if (!isAdmin()) return alert("Apenas administradores podem deletar seres.");
    if (!confirm(`Deseja realmente deletar o ser #${id}?`)) return;
    const token = getToken(); if(!token) return;
    try {
        const res = await fetch(`http://localhost:8080/api/seres/${id}`, { method:"DELETE", headers:{ "Authorization": `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.text());
        alert(`Ser #${id} deletado com sucesso!`);
        fetchSeres();
    } catch(err) { console.error(err); alert("Erro ao deletar ser: "+err.message); }
}

// ---------------------------- Modal Atualizar Ser ----------------------------
async function abrirModalAtualizarSer(s) {
    if (!isAdmin()) return alert("Apenas administradores podem atualizar seres.");
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;
    modalContainer.innerHTML="";

    const overlay = document.createElement("div");
    Object.assign(overlay.style,{ position:"fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", zIndex:999 });
    overlay.onclick=()=>modalContainer.innerHTML="";

    const modal = document.createElement("div");
    Object.assign(modal.style,{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"#fefefe", padding:"25px", borderRadius:"12px", boxShadow:"0 10px 25px rgba(0,0,0,0.3)", zIndex:1000, width:"500px", maxHeight:"90%", overflowY:"auto" });

    const h3 = document.createElement("h3");
    h3.textContent=`Atualizar Ser #${s.id}`;
    modal.appendChild(h3);

    const form = document.createElement("form");
    Object.assign(form.style,{ display:"flex", flexDirection:"column", gap:"10px" });

    ["nomeComum","nomeCientifico","descricao","latitude","longitude"].forEach(name=>{
        const label=document.createElement("label");
        Object.assign(label.style,{ display:"flex", flexDirection:"column", gap:"4px" });
        const span=document.createElement("span"); span.textContent=name.charAt(0).toUpperCase()+name.slice(1);
        label.appendChild(span);
        const input=document.createElement("input");
        input.type=(name==="latitude"||name==="longitude")?"number":"text";
        input.step="any";
        input.name=name;
        input.value=s[name]??"";
        Object.assign(input.style,{ width:"100%", padding:"5px" });
        label.appendChild(input);
        form.appendChild(label);
    });

    // Select espécies
    const labelEspecie=document.createElement("label");
    Object.assign(labelEspecie.style,{ display:"flex", flexDirection:"column", gap:"4px" });
    const spanEspecie=document.createElement("span"); spanEspecie.textContent="Espécie"; labelEspecie.appendChild(spanEspecie);
    const selectEspecie=document.createElement("select"); selectEspecie.name="especieId"; Object.assign(selectEspecie.style,{ width:"100%", padding:"5px" });
    window.especiesCache.forEach(e=>{
        const opt=document.createElement("option"); opt.value=e.id; opt.textContent=e.nome; if(s.especie?.id===e.id) opt.selected=true; selectEspecie.appendChild(opt);
    });
    labelEspecie.appendChild(selectEspecie); form.appendChild(labelEspecie);

    const salvarBtn=document.createElement("button"); salvarBtn.type="submit"; salvarBtn.textContent="Salvar"; Object.assign(salvarBtn.style,{ padding:"8px 15px", background:"#2196F3", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer" }); form.appendChild(salvarBtn);

    form.onsubmit=async e=>{
        e.preventDefault();
        const token=getToken(); if(!token) return;
        const payload={
            nomeComum: form.nomeComum.value,
            nomeCientifico: form.nomeCientifico.value,
            descricao: form.descricao.value,
            latitude: parseFloat(form.latitude.value),
            longitude: parseFloat(form.longitude.value),
            especieId: parseInt(selectEspecie.value)
        };
        try {
            const resp=await fetch(`http://localhost:8080/api/seres/${s.id}/atualizar-multipart`,{
                method:"PUT",
                headers:{ "Authorization":`Bearer ${token}` },
                body:JSON.stringify(payload)
            });
            if(!resp.ok) throw new Error(`Erro HTTP ${resp.status}`);
            alert("Ser atualizado com sucesso!");
            modalContainer.innerHTML="";
            fetchSeres();
        } catch(err){ console.error(err); alert("Erro ao atualizar ser: "+err.message); }
    };

    modal.appendChild(form);
    modalContainer.appendChild(overlay);
    modalContainer.appendChild(modal);
}

// ---------------------------- Inicialização ----------------------------
async function initSeres() {
    fetchSeres();
}

initSeres();
