
const historias = document.querySelectorAll('.historia');
const progress = document.querySelector('.progress-bar span');
let atual = 0;
const duracao = 10000; // 2 minutos

function mostrarHistoria(index) {
  historias.forEach(h => h.classList.remove('active'));
  historias[index].classList.add('active');

  progress.style.transition = 'none';
  progress.style.width = '0%';

  setTimeout(() => {
    progress.style.transition = `width ${duracao}ms linear`;
    progress.style.width = '100%';
  }, 50);
}

mostrarHistoria(atual);

setInterval(() => {
  atual = (atual + 1) % historias.length;
  mostrarHistoria(atual);
}, duracao);

