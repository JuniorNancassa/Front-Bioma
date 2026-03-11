// ---- Usuários ----
async function fetchUsuarios() {
  try {
    const resp = await fetch("http://localhost:8080/api/usuarios");
    if (!resp.ok) throw new Error("Erro ao buscar usuários");
    const usuarios = await resp.json();

    // Estrutura principal
    let html = `
      <h2 style="margin-bottom:15px;">Usuários</h2>
      <div id="usuarios-container" style="
        display:grid;
        grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));
        gap:20px;
      "></div>
    `;
    document.getElementById("main-content").innerHTML = html;

    const container = document.getElementById("usuarios-container");

    usuarios.forEach(u => {
      // Card
      const card = document.createElement("div");
      Object.assign(card.style, {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
      });
      card.onmouseover = () => {
        card.style.transform = "translateY(-5px)";
        card.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
      };
      card.onmouseout = () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)";
      };

      // Avatar fake (iniciais do nome)
      const avatar = document.createElement("div");
      Object.assign(avatar.style, {
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        background: "#4a90e2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        fontWeight: "bold",
        color: "#fff",
        marginBottom: "12px"
      });
      avatar.textContent = u.nomeCompleto ? u.nomeCompleto.charAt(0).toUpperCase() : "?";

      // Nome completo
      const nome = document.createElement("h3");
      nome.textContent = u.nomeCompleto;
      nome.style.margin = "0 0 6px 0";
      nome.style.fontSize = "1.1rem";
      nome.style.color = "#333";

      // Email
      const email = document.createElement("p");
      email.textContent = u.email;
      email.style.margin = "0";
      email.style.fontSize = "0.9rem";
      email.style.color = "#666";

      // Login
      const login = document.createElement("p");
      login.innerHTML = `<strong>Login:</strong> ${u.login}`;
      login.style.margin = "6px 0 0 0";
      login.style.fontSize = "0.85rem";
      login.style.color = "#444";

      // Role
      const role = document.createElement("span");
      role.textContent = u.role;
      Object.assign(role.style, {
        marginTop: "12px",
        padding: "4px 10px",
        background: "#f0f0f0",
        borderRadius: "12px",
        fontSize: "0.8rem",
        fontWeight: "500",
        color: "#333"
      });

      // Montagem
      card.appendChild(avatar);
      card.appendChild(nome);
      card.appendChild(email);
      card.appendChild(login);
      card.appendChild(role);
      

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar usuários.");
  }
}
