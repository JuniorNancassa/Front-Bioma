// URLs da API
const API_BASE = "http://localhost:8080/api/estatisticas";

// Atualizar cards de estatísticas
async function carregarEstatisticas() {
    try {
        const [denunciasTotalRes, seresTotalRes, usuariosTotalRes] = await Promise.all([
            fetch(`${API_BASE}/denuncias/total`),
            fetch(`${API_BASE}/seres/total`),
            fetch(`${API_BASE}/usuarios/total`)
        ]);

        const denunciasTotal = await denunciasTotalRes.json();
        const seresTotal = await seresTotalRes.json();
        const usuariosTotal = await usuariosTotalRes.json();

        document.getElementById("count-denuncias").textContent = denunciasTotal;
        document.getElementById("count-seres").textContent = seresTotal;
        document.getElementById("count-usuarios").textContent = usuariosTotal;

    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
    }
}

// Carregar gráficos com Chart.js
async function carregarGraficos() {
    try {
        const [denunciasStatusRes, seresStatusRes] = await Promise.all([
            fetch(`${API_BASE}/denuncias/por-status`),
            fetch(`${API_BASE}/seres/por-status`)
        ]);

        const denunciasStatus = await denunciasStatusRes.json();
        const seresStatus = await seresStatusRes.json();

        // Gráfico de denúncias
        const ctxDenuncias = document.getElementById("chartDenuncias").getContext("2d");
        new Chart(ctxDenuncias, {
            type: 'pie',
            data: {
                labels: Object.keys(denunciasStatus),
                datasets: [{
                    label: 'Denúncias por status',
                    data: Object.values(denunciasStatus),
                    backgroundColor: ['#F56565', '#ED8936', '#ECC94B', '#48BB78']
                }]
            }
        });

        // Gráfico de conservação de espécies
        const ctxSeres = document.getElementById("chartSeres").getContext("2d");
        new Chart(ctxSeres, {
            type: 'pie',
            data: {
                labels: Object.keys(seresStatus),
                datasets: [{
                    label: 'Espécies por status de conservação',
                    data: Object.values(seresStatus),
                    backgroundColor: ['#48BB78', '#4299E1', '#ED8936', '#F56565']
                }]
            }
        });

    } catch (error) {
        console.error("Erro ao carregar gráficos:", error);
    }
}

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
    carregarEstatisticas();
    carregarGraficos();
});