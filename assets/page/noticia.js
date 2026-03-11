const API_URL = "http://localhost:8080/api/noticias";

const postsContainer = document.getElementById('posts');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');

const noticiaDiv = document.getElementById('noticia-completa');
const tituloCompleto = document.getElementById('tituloCompleto');
const dataCompleto = document.getElementById('dataCompleto');
const imagemCompleto = document.getElementById('imagemCompleto');
const descricaoCompleto = document.getElementById('descricaoCompleto');
const conteudoCompleto = document.getElementById('conteudoCompleto');
const linkCompleto = document.getElementById('linkCompleto');
const voltarLista = document.getElementById('voltarLista');

let noticias = [];

async function carregarNoticias() {
    postsContainer.innerHTML = '';

    try {
        const res = await fetch(API_URL);
        noticias = await res.json();

        noticias.forEach(n => {

            const col = document.createElement('div');
            col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

            col.innerHTML = `
                <div class="post-card h-100">
                    <img src="${n.imagemUrl ? 'http://localhost:8080'+n.imagemUrl : 'assets/img/default.jpg'}">
                    <div class="post-content">
                        <span class="category">${n.categoria || 'Geral'}</span>
                        <h3>${n.titulo}</h3>
                        <p>${n.descricaoCurta}</p>
                        <small>${n.data || ''}</small>
                        <a href="#" class="btn-read-more mt-auto">Ler Mais →</a>
                    </div>
                </div>
            `;

            col.querySelector('.btn-read-more').addEventListener('click', e => {
                e.preventDefault();
                mostrarNoticia(n);
            });

            postsContainer.appendChild(col);
        });

        populateCategories();

    } catch(err) {
        console.error(err);
    }
}

function mostrarNoticia(n) {
    document.querySelector('.container.my-5').style.display = 'none';
    noticiaDiv.style.display = 'block';

    tituloCompleto.innerText = n.titulo;
    dataCompleto.innerText = n.data || '';
    imagemCompleto.src = n.imagemUrl ? 'http://localhost:8080'+n.imagemUrl : '';
    descricaoCompleto.innerText = n.descricaoCurta;
    conteudoCompleto.innerText = n.conteudoCompleto;
}

voltarLista.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.container.my-5').style.display = 'block';
    noticiaDiv.style.display = 'none';
});

function populateCategories() {
    const categorias = new Set(noticias.map(n => n.categoria || 'Geral'));
    categoryFilter.innerHTML = '<option value="all">Todas Categorias</option>';

    categorias.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categoryFilter.appendChild(opt);
    });
}

function filterPosts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    document.querySelectorAll('.col-12').forEach(col => {
        const title = col.querySelector('h3').textContent.toLowerCase();
        const summary = col.querySelector('p').textContent.toLowerCase();
        const category = col.querySelector('.category').textContent;

        col.style.display =
            (title.includes(searchTerm) || summary.includes(searchTerm)) &&
            (selectedCategory === 'all' || category === selectedCategory)
            ? 'block' : 'none';
    });
}

searchInput.addEventListener('input', filterPosts);
categoryFilter.addEventListener('change', filterPosts);

carregarNoticias();