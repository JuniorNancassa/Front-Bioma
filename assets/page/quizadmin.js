// ==============================
// QUIZ ADMIN
// ==============================
window.fetchQuiz = async function (token) {
    const content = document.getElementById("main-content");
    content.innerHTML = "";

    // ==============================
    // HTML
    // ==============================
    const container = document.createElement("div");
    container.innerHTML = `
        <h2>Gerenciar Quizzes</h2>
        <button id="btn-add-quiz">➕ Criar Quiz</button>
        <div id="quiz-list"></div>
    `;
    content.appendChild(container);

    // ==============================
    // CSS
    // ==============================
    const style = document.createElement("style");
    style.innerHTML = `
        #btn-add-quiz {
            padding: 8px 14px;
            margin-bottom: 15px;
            background: #2d89ef;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        .quiz-card {
            background: #fff;
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,.1);
        }

        .quiz-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .quiz-header h3 {
            margin: 0;
        }

        .quiz-actions button {
            margin-left: 5px;
            cursor: pointer;
        }

        .perguntas {
            margin-top: 10px;
            padding-left: 15px;
        }

        .pergunta {
            background: #f5f5f5;
            padding: 8px;
            border-radius: 6px;
            margin-bottom: 6px;
        }
    `;
    document.head.appendChild(style);

    // ==============================
    // FUNÇÕES API
    // ==============================
    async function carregarQuizzes() {
        const list = document.getElementById("quiz-list");
        list.innerHTML = "Carregando quizzes...";

        try {
            const res = await fetch("/api/quizzes", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Erro ao buscar quizzes");

            const quizzes = await res.json();
            list.innerHTML = "";

            quizzes.forEach(renderQuiz);
        } catch (err) {
            list.innerHTML = `<p style="color:red">${err.message}</p>`;
        }
    }

    function renderQuiz(quiz) {
        const list = document.getElementById("quiz-list");

        const div = document.createElement("div");
        div.className = "quiz-card";
        div.dataset.id = quiz.id;

        div.innerHTML = `
            <div class="quiz-header">
                <h3>${quiz.titulo}</h3>
                <div class="quiz-actions">
                    <button class="btn-add-pergunta">➕ Pergunta</button>
                    <button class="btn-delete-quiz">🗑️</button>
                </div>
            </div>
            <small>Nível: ${quiz.nivel}</small>
            <div class="perguntas"></div>
        `;

        if (quiz.perguntas) {
            const perguntasDiv = div.querySelector(".perguntas");
            quiz.perguntas.forEach(p => {
                const pDiv = document.createElement("div");
                pDiv.className = "pergunta";
                pDiv.textContent = p.pergunta;
                perguntasDiv.appendChild(pDiv);
            });
        }

        list.appendChild(div);
    }

    // ==============================
    // EVENTOS
    // ==============================
    container.addEventListener("click", async e => {

        // CRIAR QUIZ
        if (e.target.id === "btn-add-quiz") {
            const titulo = prompt("Título do quiz:");
            if (!titulo) return;

            const nivel = prompt("Nível (FACIL / INTERMEDIARIO / DIFICIL):", "FACIL");
            if (!nivel) return;

            const res = await fetch("/api/quizzes/criar-completo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ titulo, nivel })
            });

            if (!res.ok) {
                alert("Erro ao criar quiz");
                return;
            }

            const quiz = await res.json();
            renderQuiz(quiz);
        }

        // DELETAR QUIZ
        if (e.target.classList.contains("btn-delete-quiz")) {
            const card = e.target.closest(".quiz-card");
            const id = card.dataset.id;

            if (!confirm("Deseja excluir este quiz?")) return;

            await fetch(`/api/quizzes/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            card.remove();
        }

        // ADICIONAR PERGUNTA
        if (e.target.classList.contains("btn-add-pergunta")) {
            const card = e.target.closest(".quiz-card");
            const quizId = card.dataset.id;

            const pergunta = prompt("Digite a pergunta:");
            if (!pergunta) return;

            const res = await fetch(`/api/quizzes/${quizId}/perguntas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    pergunta,
                    respostas: []
                })
            });

            if (!res.ok) {
                alert("Erro ao criar pergunta");
                return;
            }

            const p = await res.json();
            const pDiv = document.createElement("div");
            pDiv.className = "pergunta";
            pDiv.textContent = p.pergunta;
            card.querySelector(".perguntas").appendChild(pDiv);
        }
    });

    // ==============================
    // INIT
    // ==============================
    carregarQuizzes();
};
