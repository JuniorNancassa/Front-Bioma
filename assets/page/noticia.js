/* =========================================================
BIO-GUINÉ | NOTÍCIAS
Notícias + Pesquisa + Categorias + Menu Hamburger
========================================================= */

/* =========================================================
CONFIGURAÇÃO DA API
========================================================= */

const API_URL = "http://localhost:8080/api/noticias";

/* =========================================================
ELEMENTOS DO DOM
========================================================= */

const postsContainer = document.getElementById("posts");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");

const noticiaDiv = document.getElementById("noticia-completa");
const tituloCompleto = document.getElementById("tituloCompleto");
const dataCompleto = document.getElementById("dataCompleto");
const imagemCompleto = document.getElementById("imagemCompleto");
const descricaoCompleto = document.getElementById("descricaoCompleto");
const conteudoCompleto = document.getElementById("conteudoCompleto");
const linkCompleto = document.getElementById("linkCompleto");
const voltarLista = document.getElementById("voltarLista");

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const menuOverlay = document.getElementById("menu-overlay");

let noticias = [];

/* =========================================================
MENU HAMBURGER
========================================================= */

function inicializarMenuHamburger() {

const botaoMenu = document.getElementById("hamburger");
const menu = document.getElementById("nav-links");
const overlay = document.getElementById("menu-overlay");

if (!botaoMenu) {
    console.error("ERRO: botão hamburger não encontrado.");
    return;
}

if (!menu) {
    console.error("ERRO: menu #nav-links não encontrado.");
    return;
}

if (!overlay) {
    console.error("ERRO: overlay #menu-overlay não encontrado.");
    return;
}

const icone = botaoMenu.querySelector("i");

function abrirMenu() {

    menu.classList.add("active");
    overlay.classList.add("active");

    document.body.classList.add("menu-open");

    botaoMenu.setAttribute("aria-expanded", "true");
    botaoMenu.setAttribute("aria-label", "Fechar menu");

    if (icone) {
        icone.classList.remove("fa-bars");
        icone.classList.add("fa-xmark");
    }
}

function fecharMenu() {

    menu.classList.remove("active");
    overlay.classList.remove("active");

    document.body.classList.remove("menu-open");

    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");

    if (icone) {
        icone.classList.remove("fa-xmark");
        icone.classList.add("fa-bars");
    }
}

function alternarMenu(event) {

    event.preventDefault();
    event.stopPropagation();

    if (menu.classList.contains("active")) {
        fecharMenu();
    } else {
        abrirMenu();
    }
}

/* Clique no botão hamburger */
botaoMenu.addEventListener("click", alternarMenu);

/* Clique no overlay */
overlay.addEventListener("click", function () {
    fecharMenu();
});

/* Clique nos links do menu */
const links = menu.querySelectorAll("a");

links.forEach(function (link) {

    link.addEventListener("click", function () {

        fecharMenu();

    });

});

/* Tecla ESC */
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        fecharMenu();
    }

});

/* Ao mudar para desktop, fecha o menu */
window.addEventListener("resize", function () {

    if (window.innerWidth > 992) {
        fecharMenu();
    }

});

/* Estado inicial */
fecharMenu();

console.log("Menu hamburger inicializado com sucesso.");


}

/* =========================================================
CARREGAR NOTÍCIAS
========================================================= */

async function carregarNoticias() {

if (!postsContainer) {
    console.warn("Elemento #posts não encontrado.");
    return;
}

postsContainer.innerHTML = "";

try {

    const response = await fetch(API_URL);

    if (!response.ok) {

        throw new Error(
            `Erro ao carregar notícias: ${response.status}`
        );

    }

    noticias = await response.json();

    if (!Array.isArray(noticias)) {

        throw new Error(
            "A API não retornou uma lista de notícias."
        );

    }

    noticias.forEach(function (noticia) {

        const col = document.createElement("div");

        col.className =
            "col-12 col-sm-6 col-lg-4 col-xl-3";

        const imagem = noticia.imagemUrl
            ? "http://localhost:8080" + noticia.imagemUrl
            : "assets/img/default.jpg";

        col.innerHTML = `
            <article class="post-card">

                <img
                    src="${imagem}"
                    alt="${escaparHTML(
                        noticia.titulo || "Notícia"
                    )}"
                    loading="lazy"
                >

                <div class="post-content">

                    <span class="category">
                        ${escaparHTML(
                            noticia.categoria || "Geral"
                        )}
                    </span>

                    <h3>
                        ${escaparHTML(
                            noticia.titulo || ""
                        )}
                    </h3>

                    <p>
                        ${escaparHTML(
                            noticia.descricaoCurta || ""
                        )}
                    </p>

                    <small>
                        ${escaparHTML(
                            noticia.data || ""
                        )}
                    </small>

                    <a
                        href="#"
                        class="btn-read-more"
                        aria-label="Ler notícia completa"
                    >
                        Ler Mais →
                    </a>

                </div>

            </article>
        `;

        const botao = col.querySelector(
            ".btn-read-more"
        );

        if (botao) {

            botao.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    mostrarNoticia(noticia);

                }
            );

        }

        postsContainer.appendChild(col);

    });

    preencherCategorias();

} catch (error) {

    console.error(
        "Erro ao carregar notícias:",
        error
    );

    postsContainer.innerHTML = `
        <div class="noticias-erro">
            <p>
                Não foi possível carregar as notícias.
            </p>
        </div>
    `;

}


}

/* =========================================================
MOSTRAR NOTÍCIA COMPLETA
========================================================= */

function mostrarNoticia(noticia) {


const lista = document.querySelector(
    ".search-section"
);

if (lista) {
    lista.style.display = "none";
}

if (postsContainer) {
    postsContainer.style.display = "none";
}

if (!noticiaDiv) {
    return;
}

noticiaDiv.style.display = "block";

if (tituloCompleto) {
    tituloCompleto.innerText =
        noticia.titulo || "";
}

if (dataCompleto) {
    dataCompleto.innerText =
        noticia.data || "";
}

if (imagemCompleto) {

    imagemCompleto.src = noticia.imagemUrl
        ? "http://localhost:8080" + noticia.imagemUrl
        : "assets/img/default.jpg";

    imagemCompleto.alt =
        noticia.titulo || "Notícia";

}

if (descricaoCompleto) {
    descricaoCompleto.innerText =
        noticia.descricaoCurta || "";
}

if (conteudoCompleto) {
    conteudoCompleto.innerText =
        noticia.conteudoCompleto || "";
}

window.scrollTo({
    top: 0,
    behavior: "smooth"
});


}

/* =========================================================
VOLTAR PARA LISTA
========================================================= */

if (voltarLista) {

voltarLista.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        const lista = document.querySelector(
            ".search-section"
        );

        if (lista) {
            lista.style.display = "flex";
        }

        if (postsContainer) {
            postsContainer.style.display = "grid";
        }

        if (noticiaDiv) {
            noticiaDiv.style.display = "none";
        }

    }
);


}

/* =========================================================
CATEGORIAS
========================================================= */

function preencherCategorias() {

if (!categoryFilter) {
    return;
}

const categorias = new Set(
    noticias.map(function (noticia) {

        return noticia.categoria || "Geral";

    })
);

categoryFilter.innerHTML =
    '<option value="all">Todas Categorias</option>';

categorias.forEach(function (categoria) {

    const option =
        document.createElement("option");

    option.value = categoria;
    option.textContent = categoria;

    categoryFilter.appendChild(option);

});


}

/* =========================================================
FILTRO DE NOTÍCIAS
========================================================= */

function filtrarNoticias() {

if (!postsContainer) {
    return;
}

const termo =
    searchInput?.value
        ?.trim()
        .toLowerCase() || "";

const categoriaSelecionada =
    categoryFilter?.value || "all";

const cards =
    postsContainer.querySelectorAll(
        '[class*="col-"]'
    );

cards.forEach(function (card) {

    const titulo =
        card.querySelector("h3")
            ?.textContent
            ?.toLowerCase() || "";

    const resumo =
        card.querySelector("p")
            ?.textContent
            ?.toLowerCase() || "";

    const categoria =
        card.querySelector(".category")
            ?.textContent
            ?.trim() || "";

    const correspondeTexto =
        titulo.includes(termo) ||
        resumo.includes(termo);

    const correspondeCategoria =
        categoriaSelecionada === "all" ||
        categoria === categoriaSelecionada;

    card.style.display =
        correspondeTexto &&
        correspondeCategoria
            ? ""
            : "none";

});


}

/* =========================================================
PESQUISA
========================================================= */

if (searchInput) {


searchInput.addEventListener(
    "input",
    filtrarNoticias
);


}

if (categoryFilter) {


categoryFilter.addEventListener(
    "change",
    filtrarNoticias
);


}

/* =========================================================
PROTEÇÃO CONTRA HTML INJETADO
========================================================= */

function escaparHTML(valor) {


const div =
    document.createElement("div");

div.textContent = valor ?? "";

return div.innerHTML;


}

/* =========================================================
INICIALIZAÇÃO
========================================================= */

function inicializarPagina() {


console.log(
    "Página de notícias inicializando..."
);

/* Inicializa primeiro o hamburger */
inicializarMenuHamburger();

/* Depois carrega as notícias */
carregarNoticias();


}

/* =========================================================
DOM READY
========================================================= */

if (document.readyState === "loading") {

document.addEventListener(
    "DOMContentLoaded",
    inicializarPagina
);


} else {


inicializarPagina();


}
