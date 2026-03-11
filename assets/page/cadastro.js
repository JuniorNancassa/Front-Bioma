// ==========================
// Listagem e Filtros de Seres
// ==========================
let seresCache = [];
window.locationCache = JSON.parse(localStorage.getItem("locationCache") || "{}");

const filtroNome = document.getElementById("filtroNome");
const filtroEspecie = document.getElementById("filtroEspecie");
const filtroStatus = document.getElementById("filtroStatus");

// Carregar a lista inicial
document.addEventListener("DOMContentLoaded", () => {
    listarSeres();

    // Eventos de filtro
    filtroNome.addEventListener("input", filtrarSeres);
    filtroEspecie.addEventListener("change", filtrarSeres);
    filtroStatus.addEventListener("change", filtrarSeres);
});

// ------------------------ LISTAR SERES ------------------------
async function listarSeres() {
    const listaContainer = document.getElementById("listaEspecies");
    listaContainer.innerHTML = "<p>Carregando seres...</p>";

    try {
        const res = await fetch("http://localhost:8080/api/seres");
        const data = await res.json();

        // Apenas aprovados
        seresCache = data.filter(s => s.statusAprovacao === "APROVADO");

        // Preencher select de espécies
        preencherSelectEspecies(seresCache);

        filtrarSeres();
    } catch (err) {
        console.error(err);
        listaContainer.innerHTML = "<p class='text-danger'>Erro ao carregar seres.</p>";
    }
}

// ------------------------ FILTRAR SERES ------------------------
function filtrarSeres() {
    const nome = filtroNome.value.toLowerCase();
    const especieId = filtroEspecie.value;
    const status = filtroStatus.value;

    const filtrados = seresCache.filter(s => {
        const matchesNome = !nome || 
            (s.nomeComum?.toLowerCase().includes(nome) || s.nomeCientifico?.toLowerCase().includes(nome));
        const matchesEspecie = !especieId || s.especie?.id == especieId;
        const matchesStatus = !status || s.statusConservacao === status;
        return matchesNome && matchesEspecie && matchesStatus;
    });

    renderizarSeres(filtrados);
}

// ------------------------ RENDERIZAR SERES ------------------------
async function renderizarSeres(seres) {
    const listaContainer = document.getElementById("listaEspecies");
    listaContainer.innerHTML = "";

    if (!seres.length) {
        listaContainer.innerHTML = "<p>Nenhum ser encontrado para os filtros aplicados.</p>";
        return;
    }

    const statusIconMap = {
        "EXTINTO": '<i class="bi bi-x-circle-fill text-dark"></i>',
        "CRITICAMENTE_EM_PERIGO": '<i class="bi bi-exclamation-octagon-fill text-danger"></i>',
        "EM_PERIGO": '<i class="bi bi-exclamation-triangle-fill text-danger"></i>',
        "VULNERAVEL": '<i class="bi bi-exclamation-circle-fill text-warning"></i>',
        "QUASE_AMEACADO": '<i class="bi bi-shield-fill-exclamation text-warning"></i>',
        "POUCO_PREOCUPANTE": '<i class="bi bi-check-circle-fill text-success"></i>',
        "DADOS_INSUFICIENTES": '<i class="bi bi-question-circle-fill text-secondary"></i>'
    };

    const fragment = document.createDocumentFragment();

    await Promise.all(seres.map(async s => {
        // Imagem
        let imagemSrc = "assets/images/default.png";
        try {
            const imgRes = await fetch(`http://localhost:8080/api/seres/${s.id}/imagem`);
            if (imgRes.ok) {
                const base64 = await imgRes.text();
                if (base64) imagemSrc = `data:image/jpeg;base64,${base64}`;
            }
        } catch {}

        // Localização
        let locationName = window.locationCache[s.id] || "Localização não encontrada";
        if (!window.locationCache[s.id] && s.latitude != null && s.longitude != null) {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${s.latitude}&lon=${s.longitude}&format=json`);
                if(res.ok){
                    const data = await res.json();
                    locationName = data.display_name || locationName;
                    window.locationCache[s.id] = locationName;
                    localStorage.setItem("locationCache", JSON.stringify(window.locationCache));
                }
            } catch(err){
                console.error("Erro ao buscar localização:", err);
            }
        }

        // Card
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = `
            <div class="card h-100 pinterest-card">
                <img src="${imagemSrc}" class="card-img-top" alt="Foto de ${s.nomeComum}" onerror="this.src='assets/images/default.png'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${s.nomeComum} <small class="text-muted">(${s.nomeCientifico})</small></h5>
                    <p class="mb-1">${statusIconMap[s.statusConservacao] || ""} ${s.statusConservacao || "—"}</p>
                    <p class="mb-1"><i class="bi bi-person-circle me-1"></i>${s.registradoPor?.login || "—"}</p>
                    <p class="mb-2"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${locationName}</p>
                    <a href="seresDetalhes.html?id=${s.id}" class="btn btn-sm btn-success mt-auto text-center">Ver Mais</a>
                </div>
            </div>
        `;
        fragment.appendChild(col);
    }));

    listaContainer.appendChild(fragment);
}

// ------------------------ PREENCHER SELECT DE ESPÉCIES ------------------------
function preencherSelectEspecies(seres) {
    const especiesUnicas = Array.from(new Set(seres.map(s => s.especie?.id)))
        .map(id => seres.find(s => s.especie.id === id).especie);

    filtroEspecie.innerHTML = `<option value="">Todas as espécies</option>`;
    especiesUnicas.forEach(e => {
        filtroEspecie.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
    });
}


// ==========================
// Menu Hamburger (Mobile)
// ==========================
function inicializarMenuHamburger() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (!hamburger || !sidebar || !overlay) return;

    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
        sidebar.setAttribute('aria-hidden', 'false');
    }
    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        sidebar.setAttribute('aria-hidden', 'true');
    }

    hamburger.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);
    sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeSidebar));
}
