// Função para login tradicional
async function login() {
    const loginValue = document.getElementById("login").value.trim();
    const passwordValue = document.getElementById("password").value;

    if (!loginValue || !passwordValue) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: loginValue, password: passwordValue })
        });

        const data = await res.json();

        if (res.ok) {
            salvarDadosUsuario(data);
            redirecionarUsuario(data);
        } else if (res.status === 401) {
            alert("Login ou senha incorretos.");
        } else if (res.status === 403) {
            alert("Usuário desabilitado. Contate o administrador.");
        } else {
            alert("Erro no login: " + JSON.stringify(data));
        }
    } catch (err) {
        console.error(err);
        alert("Erro de rede ou servidor inacessível.");
    }
}

// Função para login via Google
window.handleGoogleResponse = async function(response) {
    try {
        const jwt = response.credential;
        const payload = JSON.parse(atob(jwt.split('.')[1]));

        const googleDTO = {
            tokenId: jwt,
            email: payload.email,
            nome: payload.name,
            login: payload.email.split('@')[0]
        };

        const res = await fetch("http://localhost:8080/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(googleDTO)
        });

        const data = await res.json();

        if (res.ok) {
            salvarDadosUsuario(data);
            redirecionarUsuario(data);
        } else {
            console.error("Erro no login com Google:", data);
            alert("Erro no login com Google: " + JSON.stringify(data));
        }
    } catch (err) {
        console.error(err);
        alert("Erro no login com Google");
    }
};

// Salva dados no localStorage
function salvarDadosUsuario(data) {
    localStorage.setItem("token", data.chave);
    localStorage.setItem("login", data.login);
    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role || "USER");
}

// Redireciona usuário com modal de admin se necessário
function redirecionarUsuario(data) {
    const destino = localStorage.getItem("destinoPosLogin");
    if (destino) {
        localStorage.removeItem("destinoPosLogin");
        window.location.href = destino;
        return;
    }

    if ((data.login || "").toLowerCase() === "admin" || (data.role || "").toUpperCase() === "ADMIN") {
        mostrarModalAdmin();
    } else {
        window.location.href = "index.html";
    }
}

// Modal de admin
function mostrarModalAdmin() {
    const modal = document.createElement("div");
    modal.id = "admin-modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.5)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "1000";

    const modalContent = document.createElement("div");
    modalContent.style.background = "#fff";
    modalContent.style.padding = "30px";
    modalContent.style.borderRadius = "8px";
    modalContent.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
    modalContent.style.textAlign = "center";
    modalContent.innerHTML = `
        <h2>Bem-vindo, Admin!</h2>
        <p>Para onde deseja ir?</p>
        <button id="admin-page-btn">Página Admin</button>
        <button id="main-page-btn">Página Principal</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Botões
    document.getElementById("admin-page-btn").onclick = () => window.location.href = "admin.html";
    document.getElementById("main-page-btn").onclick = () => window.location.href = "index.html";

    // Fecha ao clicar fora
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    // Fecha ao pressionar Esc
    document.addEventListener("keydown", function escClose(e) {
        if (e.key === "Escape") {
            modal.remove();
            document.removeEventListener("keydown", escClose);
        }
    });
}

