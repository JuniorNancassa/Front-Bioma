window.fetchNotificacoes = async function() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
      <h2>Notificações</h2>
      <div id="notificacao-form">
        <div>
          <label><input type="radio" name="tipoNotificacao" value="global" checked> Global</label>
          <label><input type="radio" name="tipoNotificacao" value="usuario"> Por Usuário</label>
        </div>

        <div style="margin-top:10px;">
          <label>Mensagem:</label>
          <textarea id="mensagem" rows="3" placeholder="Digite a mensagem"></textarea>
        </div>

        <div id="usuarios-container" style="display:none; margin-top:10px;">
          <label>Usuários (digite logins separados por vírgula):</label>
          <input type="text" id="usuarioNomes" placeholder="Ex: joao, maria, carlos">
        </div>

        <button onclick="enviarNotificacao()">Enviar</button>
      </div>

      <h3>Notificações Enviadas</h3>
      <table id="notificacoes-tabela" border="1" style="width:100%; margin-top:10px; border-collapse: collapse;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Mensagem</th>
            <th>Usuário</th>
            <th>Lida</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;

    // Mostrar/ocultar campo de usuários
    document.getElementsByName("tipoNotificacao").forEach(radio => {
        radio.addEventListener("change", function() {
            document.getElementById("usuarios-container").style.display = this.value === "usuario" ? "block" : "none";
        });
    });

    // Carrega notificações existentes
    await carregarNotificacoes();
};

// ------------------ ENVIO DE NOTIFICAÇÃO ------------------
async function enviarNotificacao() {
    const mensagem = document.getElementById("mensagem").value.trim();
    const tipo = document.querySelector('input[name="tipoNotificacao"]:checked').value;

    if (!mensagem) { alert("Digite uma mensagem!"); return; }

    if (tipo === "global") {
        await fetch(`http://127.0.0.1:8080/api/notificacoes/enviar-global?mensagem=${encodeURIComponent(mensagem)}`, { method: "POST" });
        alert("Notificação global enviada!");
    } else {
        const logins = document.getElementById("usuarioNomes").value
            .split(",").map(l => l.trim()).filter(l => l);
        if (logins.length === 0) { alert("Digite pelo menos um login!"); return; }

        // Converte logins em IDs
        const ids = [];
        for (const login of logins) {
            const res = await fetch(`http://127.0.0.1:8080/api/usuarios/id-por-login?login=${encodeURIComponent(login)}`);
            if (res.ok) {
                const id = await res.text();
                ids.push(id);
            } else {
                console.warn(`Usuário ${login} não encontrado`);
            }
        }

        for (const usuarioId of ids) {
            await fetch(`http://127.0.0.1:8080/api/notificacoes/enviar?usuarioId=${encodeURIComponent(usuarioId)}&mensagem=${encodeURIComponent(mensagem)}`, { method: "POST" });
        }

        alert("Notificações enviadas para usuários selecionados!");
    }

    document.getElementById("mensagem").value = "";
    document.getElementById("usuarioNomes").value = "";
    await carregarNotificacoes();
}

// ------------------ CARREGAR NOTIFICAÇÕES ------------------
async function carregarNotificacoes() {
    const tbody = document.querySelector("#notificacoes-tabela tbody");
    tbody.innerHTML = "";

    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8080/api/notificacoes", {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return;

    const notificacoes = await res.json();
    notificacoes.forEach(n => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${n.id}</td>
            <td>${n.data ? new Date(n.data).toLocaleString() : ""}</td>
            <td>${n.mensagem}</td>
            <td>${n.usuarioId || "Global"}</td>
            <td>${n.lida ? "Sim" : "Não"}</td>
            <td>
                <button onclick="atualizarNotificacao(${n.id}, '${n.mensagem.replace(/'/g, "\\'")}')">Atualizar</button>
                <button onclick="deletarNotificacao(${n.id})">Deletar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// ------------------ ATUALIZAR NOTIFICAÇÃO ------------------
async function atualizarNotificacao(id, mensagemAtual) {
    const novaMensagem = prompt("Digite a nova mensagem:", mensagemAtual);
    if (!novaMensagem) return;

    const token = localStorage.getItem("token");
    const login = localStorage.getItem("login");

    const res = await fetch(`http://127.0.0.1:8080/api/notificacoes/${id}/atualizar?login=${encodeURIComponent(login)}&novaMensagem=${encodeURIComponent(novaMensagem)}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
        alert("Notificação atualizada!");
        await carregarNotificacoes();
    } else {
        alert("Erro ao atualizar notificação.");
    }
}

// ------------------ DELETAR NOTIFICAÇÃO ------------------
async function deletarNotificacao(id) {
    if (!confirm("Deseja realmente deletar esta notificação?")) return;

    const token = localStorage.getItem("token");
    const login = localStorage.getItem("login");

    const res = await fetch(`http://127.0.0.1:8080/api/notificacoes/${id}?login=${encodeURIComponent(login)}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
        alert("Notificação deletada!");
        await carregarNotificacoes();
    } else {
        alert("Erro ao deletar notificação.");
    }
}

