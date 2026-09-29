
    
window.locationCache = JSON.parse(localStorage.getItem("locationCache") || "{}");
const especieId = new URLSearchParams(window.location.search).get("id");

// Carrega detalhes do ser
async function carregarDetalhes() {
    if (!especieId) { alert("ID do ser não fornecido!"); return; }

    try {
        const res = await fetch(`http://localhost:8080/api/seres/${especieId}/detalhes`);
        if (!res.ok) throw new Error("Ser não encontrado");
        const ser = await res.json();

        document.getElementById("nomeComum").textContent =
            ser.nomeComum ? `${ser.nomeComum}${ser.nomeCientifico ? ` (${ser.nomeCientifico})` : ''}` : "—";
        document.getElementById("descricao").textContent = ser.descricao || "—";
        document.getElementById("tipo").textContent = ser.tipo?.nome || "—";
        document.getElementById("especie").textContent = ser.especie?.nome || "—";
        document.getElementById("categoria").textContent = ser.categoria?.nome || "—";
        document.getElementById("statusConservacao").textContent = ser.statusConservacao || "—";
        document.getElementById("registradoPor").textContent = ser.registradoPor?.login || "—";
        document.getElementById("dataRegistro").textContent = ser.dataRegistro ? new Date(ser.dataRegistro).toLocaleString() : "—";

        if (ser.imagem) document.getElementById("serImg").src = `data:image/jpeg;base64,${ser.imagem}`;

        let locationName = "Localização não encontrada";
        if (window.locationCache[ser.id]) {
            locationName = window.locationCache[ser.id];
        } else if (ser.latitude != null && ser.longitude != null) {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${ser.latitude}&lon=${ser.longitude}&format=json`
                );
                if (response.ok) {
                    const locationData = await response.json();
                    if (locationData?.display_name) locationName = locationData.display_name;
                }
                window.locationCache[ser.id] = locationName;
                localStorage.setItem("locationCache", JSON.stringify(window.locationCache));
            } catch {
                locationName = `Lat: ${ser.latitude.toFixed(5)}, Lng: ${ser.longitude.toFixed(5)}`;
            }
        }
        document.getElementById("localizacao").textContent = locationName;

    } catch (err) {
        console.error(err);
        alert("Erro ao carregar detalhes do ser.");
    }
}



const token = localStorage.getItem("token"); // token JWT do usuário logado

function tempoRelativo(dataComentario) {
    const agora = new Date();
    const comentario = new Date(dataComentario);
    const diffMs = agora - comentario;
    const diffSegundos = Math.floor(diffMs / 1000);
    const diffMinutos = Math.floor(diffSegundos / 60);
    const diffHoras = Math.floor(diffMinutos / 60);
    const diffDias = Math.floor(diffHoras / 24);
    const diffMeses = Math.floor(diffDias / 30);
    const diffAnos = Math.floor(diffDias / 365);

    if (diffSegundos < 60) return "há poucos segundos";
    if (diffMinutos < 60) return `há ${diffMinutos} min`;
    if (diffHoras < 24) return `há ${diffHoras} h`;
    if (diffDias < 30) return `há ${diffDias} dia${diffDias > 1 ? "s" : ""}`;
    if (diffMeses < 12) return `há ${diffMeses} mês${diffMeses > 1 ? "es" : ""}`;
    return `há ${diffAnos} ano${diffAnos > 1 ? "s" : ""}`;
}

async function carregarComentarios() {
    const lista = document.getElementById("listaComentarios");
    lista.innerHTML = "Carregando comentários...";

    try {
        const res = await fetch(`http://localhost:8080/api/comentarios/especie/${especieId}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const comentarios = await res.json();

        if (!comentarios.length) {
            lista.innerHTML = "<p>Nenhum comentário ainda.</p>";
            return;
        }

        lista.innerHTML = "";

        comentarios.forEach(c => {
            const div = document.createElement("div");
            div.className = "mb-2 p-2";

            // Agora usamos somente o autorLogin do DTO
            const autor = c.autorLogin || "(Usuário desconhecido)";
            const tempo = tempoRelativo(c.dataComentario);

            div.innerHTML = `
                <strong><i class="bi bi-person-circle me-1"></i>${autor}</strong>
                <small class="text-muted ms-1">${tempo}</small>
                <p>${c.texto}</p>
            `;

            lista.prepend(div);
        });
    } catch (err) {
        console.error(err);
        lista.innerHTML = "<p class='text-danger'>Erro ao carregar comentários.</p>";
    }
}

document.getElementById("btnEnviarComentario").addEventListener("click", async () => {
    const texto = document.getElementById("novoComentario").value.trim();
    if (!texto) return alert("Digite um comentário.");

    try {
        const res = await fetch(`http://localhost:8080/api/comentarios/criar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                texto,
                especie: { id: especieId }
            })
        });

        if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || "Erro ao enviar comentário");
        }

        document.getElementById("novoComentario").value = "";
        carregarComentarios();
    } catch (err) {
        console.error(err);
        alert("Erro ao enviar comentário: " + err.message);
    }
});

// Toggle comentários
document.getElementById("toggleComentarios").addEventListener("click", () => {
    const lista = document.getElementById("listaComentarios");
    const icon = document.getElementById("iconToggle");

    if (lista.style.display === "none") {
        lista.style.display = "block";
        icon.classList.remove("bi-chevron-down");
        icon.classList.add("bi-chevron-up");
    } else {
        lista.style.display = "none";
        icon.classList.remove("bi-chevron-up");
        icon.classList.add("bi-chevron-down");
    }
});

window.addEventListener("DOMContentLoaded", () => {
    carregarDetalhes();
    carregarComentarios();
});
