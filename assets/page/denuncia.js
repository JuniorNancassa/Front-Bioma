document.addEventListener("DOMContentLoaded", () => {
  // ---------- Seletores dentro do modal ----------
  const btnMostrarForm = document.getElementById("btnMostrarForm");
  const modalForm = document.getElementById("modalForm");
  const btnFecharModal = document.getElementById("btnFecharModal");
  const serForm = document.getElementById("serFormModal"); // form dentro do modal
  const imagemInput = document.getElementById("imagem");
  const previewImagem = document.getElementById("previewImagem");
  const btnTirarFoto = document.getElementById("btnTirarFoto");
  const btnEscolherGaleria = document.getElementById("btnEscolherGaleria");
  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");
  const especieSelect = document.getElementById("especieId");
  const statusFiltro = document.getElementById("statusFiltro");
  const buscaTitulo = document.getElementById("buscaTitulo");
  const inputEndereco = document.getElementById("inputEndereco");
  const btnBuscarEndereco = document.getElementById("btnBuscarEndereco");
  const btnGPS = document.getElementById("btnGPS");

  const token = localStorage.getItem("token"); // JWT do usuário logado
  if (!token) {
    alert("Você precisa estar logado para enviar denúncias.");
    return;
  }

  let map;
  let marker;
  let todasDenuncias = [];

  // ---------- Abrir modal ----------
  btnMostrarForm.addEventListener("click", () => {
    modalForm.style.display = "flex";
    inicializarMapa();
    carregarEspecies();
  });

  // ---------- Fechar modal ----------
  btnFecharModal.addEventListener("click", () => {
    modalForm.style.display = "none";
    serForm.reset();
    previewImagem.style.display = "none";
  });
  modalForm.addEventListener("click", e => {
    if (e.target === modalForm) modalForm.style.display = "none";
  });

  // ---------- Inicializar mapa ----------
  function inicializarMapa() {
    if (!map) {
      map = L.map("map").setView([11.8037, -15.1804], 7);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap"
      }).addTo(map);

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        latitudeInput.value = lat;
        longitudeInput.value = lng;
        if (marker) marker.setLatLng(e.latlng);
        else marker = L.marker(e.latlng).addTo(map);
        buscarEndereco(lat, lng);
      });
    } else {
      map.invalidateSize();
    }
  }

  // ---------- Carregar espécies ----------
  function carregarEspecies() {
    fetch("http://localhost:8080/api/especies")
      .then(res => res.json())
      .then(data => {
        especieSelect.innerHTML = '<option value="">Selecione uma Espécie</option>';
        data.forEach(esp => {
          const option = document.createElement("option");
          option.value = esp.id;
          option.textContent = esp.nome;
          especieSelect.appendChild(option);
        });
        const naoSeiOption = document.createElement("option");
        naoSeiOption.value = "";
        naoSeiOption.textContent = "Desconhecido";
        especieSelect.appendChild(naoSeiOption);
      })
      .catch(err => console.error("Erro ao carregar espécies:", err));
  }

  // ---------- Upload de imagem ----------
  btnEscolherGaleria.addEventListener("click", () => {
    imagemInput.removeAttribute("capture");
    imagemInput.click();
  });
  btnTirarFoto.addEventListener("click", () => {
    imagemInput.setAttribute("capture", "environment");
    imagemInput.click();
  });
  imagemInput.addEventListener("change", () => {
    const file = imagemInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImagem.src = e.target.result;
        previewImagem.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // ---------- Envio da denúncia ----------
  async function enviarDenuncia(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const latitude = latitudeInput.value;
    const longitude = longitudeInput.value;
    const especieId = especieSelect.value;
    const imagemFile = imagemInput.files[0];

    if (!titulo || !descricao || !latitude || !longitude || !especieId) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("especieId", especieId);
    if (imagemFile) formData.append("imagem", imagemFile);

    try {
      const res = await fetch("http://localhost:8080/api/denuncias/multipart", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error(await res.text() || "Erro ao enviar denúncia");

      alert("Denúncia enviada com sucesso!");
      serForm.reset();
      previewImagem.style.display = "none";
      modalForm.style.display = "none";
      fetchDenuncias();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar denúncia: " + err.message);
    }
  }
  serForm.addEventListener("submit", enviarDenuncia);

  // ---------- Busca e filtros ----------
  async function fetchDenuncias() {
    try {
      const resp = await fetch("http://localhost:8080/api/denuncias");
      if (!resp.ok) throw new Error("Erro ao buscar denúncias");
      const data = await resp.json();

      todasDenuncias = data.filter(d => d.statusAprovacao === "APROVADO");
      aplicarFiltros();
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar denúncias.");
    }
  }

  function aplicarFiltros() {
    const statusSelecionado = statusFiltro.value.toUpperCase();
    const tituloBusca = buscaTitulo.value.toLowerCase();

    const filtradas = todasDenuncias.filter(d => {
      const statusOk = !statusSelecionado || d.statusAprovacao === statusSelecionado;
      const tituloOk = !tituloBusca || (d.titulo && d.titulo.toLowerCase().includes(tituloBusca));
      return statusOk && tituloOk;
    });

    mostrarDenuncias(filtradas);
  }

  statusFiltro.addEventListener("change", aplicarFiltros);
  buscaTitulo.addEventListener("input", aplicarFiltros);

  // ---------- Mostrar denúncias ----------
  function mostrarDenuncias(denuncias) {
    const container = document.getElementById("denuncias-container");
    container.innerHTML = "";

    denuncias.forEach(d => {
      const card = document.createElement("div");
      card.className = "denuncia-card";

      const imgWrapper = document.createElement("div");
      imgWrapper.className = "img-wrapper";

      const img = document.createElement("img");
      img.src = d.imagem ? `data:image/jpeg;base64,${d.imagem}` : "assets/images/default.png";
      imgWrapper.appendChild(img);

      // Badge contador
      const contador = document.createElement("span");
      contador.className = "contador-badge";
      contador.textContent = denuncias.filter(x => x.titulo === d.titulo).length;
      imgWrapper.appendChild(contador);

      card.appendChild(imgWrapper);

      const body = document.createElement("div");
      body.className = "card-body";

      const tituloWrapper = document.createElement("div");
      tituloWrapper.className = "titulo-wrapper";

      const titulo = document.createElement("h4");
      titulo.textContent = d.titulo || "—";

      const icon = document.createElement("i");
      icon.className = "fas fa-exclamation-triangle";

      tituloWrapper.appendChild(titulo);
      tituloWrapper.appendChild(icon);

      const descricaoWrapper = document.createElement("div");
      descricaoWrapper.className = "descricao-wrapper";

      const btnDescricao = document.createElement("button");
      btnDescricao.className = "btn-descricao";
      btnDescricao.textContent = "Ver detalhes ▼";

      const descricao = document.createElement("p");
      descricao.className = "descricao";
      descricao.textContent = d.descricao || "Sem descrição";

      btnDescricao.addEventListener("click", () => {
        if (descricao.style.maxHeight === "0px" || descricao.style.maxHeight === "0") {
          descricao.style.maxHeight = descricao.scrollHeight + "px";
          btnDescricao.textContent = "Ocultar ▲";
        } else {
          descricao.style.maxHeight = "0";
          btnDescricao.textContent = "Ver detalhes ▼";
        }
      });

      descricaoWrapper.appendChild(btnDescricao);
      descricaoWrapper.appendChild(descricao);

      const local = document.createElement("p");
      local.className = "localizacao";
      local.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${d.localizacao || "Localização não informada"}`;

      body.appendChild(tituloWrapper);
      body.appendChild(descricaoWrapper);
      body.appendChild(local);
      card.appendChild(body);

      container.appendChild(card);
    });
  }

  // ---------- GPS ----------
  btnGPS?.addEventListener("click", () => {
    if (!navigator.geolocation) return alert("Geolocalização não suportada.");

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        latitudeInput.value = latitude;
        longitudeInput.value = longitude;

        if (marker) marker.setLatLng([latitude, longitude]);
        else marker = L.marker([latitude, longitude]).addTo(map);

        map.setView([latitude, longitude], 14);
        buscarEndereco(latitude, longitude);
      },
      err => {
        console.error("Erro ao acessar GPS:", err);
        alert("Não foi possível obter localização pelo GPS.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

  // ---------- Buscar endereço ----------
  btnBuscarEndereco?.addEventListener("click", async () => {
    const endereco = inputEndereco.value.trim();
    if (!endereco) return alert("Digite um endereço.");

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1`);
      const data = await res.json();
      if (!data.length) return alert("Endereço não encontrado.");

      const { lat, lon } = data[0];
      latitudeInput.value = lat;
      longitudeInput.value = lon;

      if (marker) marker.setLatLng([lat, lon]);
      else marker = L.marker([lat, lon]).addTo(map);

      map.setView([lat, lon], 14);
      buscarEndereco(lat, lon);
    } catch(err) {
      console.error(err);
      alert("Erro ao buscar endereço.");
    }
  });

  // ---------- Buscar endereço a partir de lat/lng ----------
  async function buscarEndereco(lat, lng) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      const endereco = data.display_name || "Endereço não encontrado";
      inputEndereco.value = endereco;
      document.getElementById("enderecoValue").textContent = endereco;
    } catch(err) {
      console.error(err);
      inputEndereco.value = "";
      document.getElementById("enderecoValue").textContent = "Erro ao buscar endereço";
    }
  }

  // ---------- Inicialização ----------
  fetchDenuncias();
});
