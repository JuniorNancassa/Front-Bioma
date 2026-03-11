// Configurações Globais
const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "login.html"; 
        return;
    }

    loadContent('Inicio'); 
});

function toggleMenu() {
    document.getElementById('sider').classList.toggle('collapsed');
}

async function loadContent(name, el = null) {
    const content = document.getElementById('main-content');
    const breadcrumb = document.getElementById('breadcrumb');
    const token = localStorage.getItem('token');

    // UI: Menu Ativo
    document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
    if (el) el.classList.add('active');

    breadcrumb.textContent = `Dashboard / ${name}`;
    content.innerHTML = `<div class="loader-container"><i class="fas fa-spinner fa-spin"></i> Carregando...</div>`;

    try {
        if (name === "Inicio") {
            const response = await fetch(`${API_BASE_URL}/estatisticas/resumo`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Falha na conexão com a API");
            const data = await response.json();

            content.innerHTML = `
                <div class="dashboard-grid">
                    <div class="card-stat">
                        <div class="card-icon blue"><i class="fas fa-dragon"></i></div>
                        <div class="card-info">
                            <p>Seres Catalogados</p>
                            <h2>${data.totalSeres || 0}</h2>
                        </div>
                    </div>
                    <div class="card-stat">
                        <div class="card-icon red"><i class="fas fa-exclamation-circle"></i></div>
                        <div class="card-info">
                            <p>Denúncias Ativas</p>
                            <h2>${data.totalDenuncias || 0}</h2>
                        </div>
                    </div>
                    <div class="card-stat">
                        <div class="card-icon green"><i class="fas fa-users"></i></div>
                        <div class="card-info">
                            <p>Usuários Registrados</p>
                            <h2>${data.totalUsuarios || 0}</h2>
                        </div>
                    </div>
                </div>

                <div class="dashboard-visuals">
                    <div class="card-large">
                        <p style="color:var(--text-muted); font-size:0.8rem">Volume de Atividade</p>
                        <canvas id="dashboardChart"></canvas>
                    </div>
                    
                    <div class="card-large">
                        <h3>Agenda</h3>
                        <div id="calendar-placeholder" style="text-align:center; padding:10px;">
                            <p style="font-size:2.5rem; font-weight:800; color:var(--accent-color)">${new Date().getDate()}</p>
                            <p style="text-transform: capitalize;">${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date())}</p>
                            <hr style="margin:10px 0; border:0; border-top:1px solid #eee">
                            <ul style="list-style:none; font-size:0.8rem; text-align:left; color:var(--text-muted)">
                                <li>• 09:00 - Revisão de Seres</li>
                                <li>• 14:30 - Analisar Denúncias</li>
                            </ul>
                        </div>
                    </div>

                    <div class="card-large">
                        <h3>Status do Bioma</h3>
                        <canvas id="pieChart"></canvas>
                    </div>
                </div>

                <div class="dashboard-visuals" style="grid-template-columns: 1fr 1.5fr;">
                    <div class="card-large">
                        <h3>Mapa de Ocorrências</h3>
                        <div id="map" style="height: 300px; border-radius: 15px;"></div>
                        <div style="margin-top:10px; font-size:0.75rem; display:flex; gap:15px;">
                            <span><span class="map-dot" style="background:#ff4d4f; width:10px; height:10px; border-radius:50%; display:inline-block;"></span> Denúncia</span>
                            <span><span class="map-dot" style="background:#52c41a; width:10px; height:10px; border-radius:50%; display:inline-block;"></span> Cadastro</span>
                        </div>
                    </div>

                    <div class="card-table-container">
                        <h3>Usuários Recentes</h3>
                        <table class="user-table">
                            <thead>
                                <tr>
                                    <th>Usuário</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="user-recent-list">
                                <tr><td>João Silva</td><td>Hoje</td><td><span class="status-pill status-active">Ativo</span></td></tr>
                                <tr><td>Maria Santos</td><td>Ontem</td><td><span class="status-pill status-active">Ativo</span></td></tr>
                                <tr><td>Admin Teste</td><td>08/03</td><td><span class="status-pill status-pending">Pendente</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            renderGrafico(data);
            renderPieChart(data);
            renderMapaCompleto();
            return;
        }

        // --- CASO: PERFIL ---
        if (name === "Perfil") {
            const login = localStorage.getItem("login") || "Admin";
            const email = localStorage.getItem("email") || "admin@bioguine.com";
            const template = document.getElementById("perfil-template").content.cloneNode(true);
            template.querySelector(".user-login").textContent = login;
            template.querySelector(".user-email").textContent = email;
            content.innerHTML = "";
            content.appendChild(template);
            return;
        }

        // --- OUTROS MÓDULOS ---
        const modules = {
            "Usuários": window.fetchUsuarios,
            "Seres": window.fetchSeres,
            "Denúncias": window.fetchDenuncias
        };

        if (modules[name]) {
            await modules[name](token);
        } else {
            content.innerHTML = `<div class="info-msg">Módulo <b>${name}</b> em desenvolvimento.</div>`;
        }

    } catch (error) {
        content.innerHTML = `<div class="error-msg"><i class="fas fa-times"></i> Erro: ${error.message}</div>`;
    }
}

// --- FUNÇÕES DE RENDERIZAÇÃO ---

function renderGrafico(data) {
    const ctx = document.getElementById('dashboardChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Seres', 'Denúncias', 'Usuários'],
            datasets: [{
                data: [data.totalSeres, data.totalDenuncias, data.totalUsuarios],
                backgroundColor: ['#52c41a', '#ff4d4f', '#1890ff'],
                borderRadius: 6
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { display: false } } 
        }
    });
}

function renderPieChart(data) {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Seguro', 'Risco'],
            datasets: [{
                data: [data.totalSeres, data.totalDenuncias],
                backgroundColor: ['#52c41a', '#ff4d4f']
            }]
        },
        options: { 
            cutout: '70%', 
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } 
        }
    });
}

function renderMapaCompleto() {
    const map = L.map('map').setView([11.8636, -15.5977], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const iconRed = L.divIcon({className: 'map-custom-icon', html: '<div style="background:#ff4d4f; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3)"></div>'});
    const iconGreen = L.divIcon({className: 'map-custom-icon', html: '<div style="background:#52c41a; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3)"></div>'});

    L.marker([11.87, -15.58], {icon: iconRed}).addTo(map).bindPopup("<b>Denúncia</b><br>Caça ilegal detectada.");
    L.marker([11.85, -15.60], {icon: iconGreen}).addTo(map).bindPopup("<b>Cadastro</b><br>Novo espécime: Macaco Galago.");
}

function openLogoutModal() {
    let modal = document.getElementById("logoutModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "logoutModal";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <i class="fas fa-sign-out-alt fa-3x" style="color:#ff4d4f; margin-bottom:15px;"></i>
                <h3>Sair do Sistema?</h3>
                <div class="modal-actions">
                    <button id="confirmLogout">Sair</button>
                    <button id="cancelLogout" class="btn-secondary">Voltar</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        modal.querySelector("#confirmLogout").addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "login.html";
        });
        modal.querySelector("#cancelLogout").addEventListener("click", () => modal.classList.remove("show"));
    }
    setTimeout(() => modal.classList.add("show"), 10);
}