document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("user-menu");
  if (!container) return;

  const login = localStorage.getItem("login");
  const email = localStorage.getItem("email");

  container.innerHTML = ''; // Limpa container

  if (login && email) {
    const userMenu = document.createElement("div");
    userMenu.className = "user-menu";
    userMenu.style.position = "relative";
    userMenu.style.display = "inline-block";
    userMenu.style.fontFamily = "Arial, sans-serif";

    userMenu.innerHTML = `
      <i class="fas fa-user-circle fa-2x"
         style="cursor:pointer; color:#4caf50; transition: color 0.2s;"></i>
      <p style="margin:5px 0 0 0; font-weight:600; font-size:0.95rem; color:#333;">${login}</p>

      <div class="user-dropdown" style="
          display:none;
          position:absolute;
          right:0;
          top:60px;
          background:#fff;
          border-radius:12px;
          padding:12px;
          box-shadow:0 8px 20px rgba(0,0,0,0.15);
          z-index:100;
          min-width:220px;
          transition: transform 0.2s ease, opacity 0.2s ease;
          transform: translateY(-10px);
          opacity: 0;
      ">
        <p style="
          margin:0 0 12px 0;
          font-weight:600;
          font-size:0.9rem;
          text-align:center;
          background-color:#4caf50;
          color:#fff;
          border-radius:8px;
          padding:8px 0;
        ">${login}</p>

        <button onclick="viewProfile()" class="dropdown-btn">Ver Perfil</button>
        <button onclick="logout()" class="dropdown-btn">Sair</button>
        <button onclick="loginAnother()" class="dropdown-btn">Entrar com outra conta</button>
      </div>
    `;
    container.appendChild(userMenu);

    // Botões estilizados
    const buttons = userMenu.querySelectorAll(".dropdown-btn");
    buttons.forEach(btn => {
      btn.style.width = "100%";
      btn.style.padding = "8px 0";
      btn.style.marginBottom = "6px";
      btn.style.border = "none";
      btn.style.borderRadius = "8px";
      btn.style.backgroundColor = "#f0f0f0";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "0.9rem";
      btn.style.transition = "all 0.2s";
      btn.onmouseenter = () => btn.style.backgroundColor = "#e0e0e0";
      btn.onmouseleave = () => btn.style.backgroundColor = "#f0f0f0";
    });

    const icon = userMenu.querySelector("i");
    const dropdown = userMenu.querySelector(".user-dropdown");

    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (dropdown.style.display === "block") {
        dropdown.style.transform = "translateY(-10px)";
        dropdown.style.opacity = "0";
        setTimeout(() => dropdown.style.display = "none", 200);
      } else {
        dropdown.style.display = "block";
        setTimeout(() => {
          dropdown.style.transform = "translateY(0)";
          dropdown.style.opacity = "1";
        }, 10);
      }
    });

    // Fecha ao clicar fora
    document.addEventListener("click", () => {
      dropdown.style.transform = "translateY(-10px)";
      dropdown.style.opacity = "0";
      setTimeout(() => dropdown.style.display = "none", 200);
    });

  } else {
    const loginButton = document.createElement("a");
    loginButton.href = "login.html";
    loginButton.innerText = "Entrar";

    // Estilização do botão de login
    loginButton.style.display = "inline-block";
    loginButton.style.padding = "10px 20px";
    loginButton.style.background = "#4caf50";
    loginButton.style.color = "#fff";
    loginButton.style.border = "none";
    loginButton.style.borderRadius = "8px";
    loginButton.style.fontSize = "1rem";
    loginButton.style.fontWeight = "600";
    loginButton.style.textDecoration = "none";
    loginButton.style.cursor = "pointer";
    loginButton.style.transition = "all 0.3s ease";
    loginButton.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";

    // Hover effect
    loginButton.addEventListener("mouseenter", () => {
      loginButton.style.background = "#45a049";
      loginButton.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
    });
    loginButton.addEventListener("mouseleave", () => {
      loginButton.style.background = "#4caf50";
      loginButton.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    });

    container.appendChild(loginButton);
  }
});

// Funções auxiliares
function viewProfile() { window.location.href = "usuarios.html"; }
function logout() {
  localStorage.removeItem("login");
  localStorage.removeItem("email");
  localStorage.removeItem("token"); // 🔑 limpa o JWT também

  alert("Você saiu da conta.");
  window.location.reload();
}
function loginAnother() { window.location.href = "login.html"; }
