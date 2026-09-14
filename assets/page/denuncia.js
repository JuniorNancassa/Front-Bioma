document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     CONFIGURAÇÕES
  ========================================================= */


  const API_BASE_URL = "http://localhost:8080/api";

  const token = localStorage.getItem("token");

  /* =========================================================
     ELEMENTOS DA NAVBAR / MENU HAMBURGER
  ========================================================= */

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  /*
   * Menu hamburger
   *
   * Funciona somente quando os elementos existem.
   * Isso evita que o restante da página quebre caso
   * o script seja reutilizado em outra página.
   */
  if (hamburger && navLinks) {

    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");

      hamburger.classList.toggle("active", isOpen);

      hamburger.setAttribute("aria-expanded", String(isOpen));

      document.body.classList.toggle("menu-open", isOpen);
    });

    /*
     * Fecha o menu quando o usuário clica em um link.
     */
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        fecharMenu();
      });
    });

    /*
     * Fecha o menu pressionando ESC.
     */
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        fecharMenu();
      }
    });

    /*
     * Fecha o menu ao voltar para desktop.
     */
    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        fecharMenu();
      }
    });
  }

  function fecharMenu() {
    if (!hamburger || !navLinks) {
      return;
    }

    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");
  }


  /* =========================================================
     ELEMENTOS DO FORMULÁRIO / MODAL
  ========================================================= */

  const btnMostrarForm = document.getElementById("btnMostrarForm");
  const modalForm = document.getElementById("modalForm");
  const btnFecharModal = document.getElementById("btnFecharModal");

  const serForm =
    document.getElementById("serFormModal") ||
    document.getElementById("serForm");

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

  const denunciasContainer =
    document.getElementById("denuncias-container");

  const tokenAtual = localStorage.getItem("token");

if (!tokenAtual) {
    alert("Você precisa estar logado para enviar denúncias.");
    return;
}

  /* =========================================================
     VARIÁVEIS
  ========================================================= */

  let map = null;
  let marker = null;

  let todasDenuncias = [];


  /* =========================================================
     MAPA
  ========================================================= */

  function inicializarMapa() {

    const mapElement = document.getElementById("map");

    if (!mapElement) {
      console.warn("Elemento #map não encontrado.");
      return;
    }

    /*
     * Leaflet precisa estar carregado.
     */
    if (typeof L === "undefined") {
      console.error("Leaflet não foi carregado.");
      return;
    }

    /*
     * Se o mapa já existe, apenas atualiza o tamanho.
     */
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 150);

      return;
    }

    /*
     * Coordenadas aproximadas da Guiné-Bissau.
     */
    map = L.map(mapElement).setView(
      [11.8037, -15.1804],
      7
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors"
      }
    ).addTo(map);


    /*
     * Clique no mapa.
     */
    map.on("click", (event) => {

      const { lat, lng } = event.latlng;

      definirLocalizacao(lat, lng);

      buscarEndereco(lat, lng);
    });


    /*
     * Corrige problemas de renderização
     * quando o mapa está dentro de um modal.
     */
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }


  /* =========================================================
     DEFINIR LOCALIZAÇÃO
  ========================================================= */

  function definirLocalizacao(latitude, longitude) {

    if (latitudeInput) {
      latitudeInput.value = latitude;
    }

    if (longitudeInput) {
      longitudeInput.value = longitude;
    }

    if (!map) {
      return;
    }

    const position = [
      Number(latitude),
      Number(longitude)
    ];

    if (marker) {

      marker.setLatLng(position);

    } else {

      marker = L.marker(position).addTo(map);
    }

    map.setView(position, 14);
  }


  /* =========================================================
     ABRIR MODAL
  ========================================================= */

  if (btnMostrarForm && modalForm) {

    btnMostrarForm.addEventListener("click", () => {

      /*
       * O envio exige autenticação.
       */
      if (!token) {
        alert(
          "Você precisa estar logado para enviar uma denúncia."
        );
        return;
      }

      modalForm.style.display = "flex";

      inicializarMapa();
      carregarEspecies();
    });
  }


  /* =========================================================
     FECHAR MODAL
  ========================================================= */

  function fecharModal() {

    if (!modalForm) {
      return;
    }

    modalForm.style.display = "none";

    if (serForm) {
      serForm.reset();
    }

    if (previewImagem) {
      previewImagem.style.display = "none";
      previewImagem.removeAttribute("src");
    }

    /*
     * Remove marcador do mapa.
     */
    if (marker && map) {
      map.removeLayer(marker);
      marker = null;
    }
  }


  if (btnFecharModal) {

    btnFecharModal.addEventListener(
      "click",
      fecharModal
    );
  }


  /*
   * Fechar clicando fora do modal.
   */
  if (modalForm) {

    modalForm.addEventListener("click", (event) => {

      if (event.target === modalForm) {
        fecharModal();
      }
    });
  }


  /* =========================================================
     CARREGAR ESPÉCIES
  ========================================================= */

  async function carregarEspecies() {

    if (!especieSelect) {
      return;
    }

    try {

      const response = await fetch(
        `${API_BASE_URL}/especies`
      );

      if (!response.ok) {
        throw new Error(
          `Erro HTTP ${response.status}`
        );
      }

      const data = await response.json();

      especieSelect.innerHTML = "";

      const primeiraOpcao =
        document.createElement("option");

      primeiraOpcao.value = "";
      primeiraOpcao.textContent =
        "Selecione uma espécie";

      especieSelect.appendChild(primeiraOpcao);


      /*
       * Verifica se a API devolveu um array.
       */
      if (Array.isArray(data)) {

        data.forEach((especie) => {

          const option =
            document.createElement("option");

          option.value = especie.id;

          option.textContent =
            especie.nome ||
            especie.nomeComum ||
            "Espécie sem nome";

          especieSelect.appendChild(option);
        });
      }


      /*
       * Opção para espécie desconhecida.
       */
      const desconhecida =
        document.createElement("option");

      desconhecida.value = "";
      desconhecida.textContent = "Desconhecido";

      especieSelect.appendChild(desconhecida);

    } catch (error) {

      console.error(
        "Erro ao carregar espécies:",
        error
      );

      /*
       * Não interrompe o funcionamento da página.
       */
    }
  }


  /* =========================================================
     UPLOAD DE IMAGEM
  ========================================================= */

  if (btnEscolherGaleria && imagemInput) {

    btnEscolherGaleria.addEventListener(
      "click",
      () => {

        imagemInput.removeAttribute("capture");

        imagemInput.click();
      }
    );
  }


  if (btnTirarFoto && imagemInput) {

    btnTirarFoto.addEventListener(
      "click",
      () => {

        imagemInput.setAttribute(
          "capture",
          "environment"
        );

        imagemInput.click();
      }
    );
  }


  if (imagemInput) {

    imagemInput.addEventListener(
      "change",
      () => {

        const file = imagemInput.files?.[0];

        if (!file) {
          return;
        }

        /*
         * Verifica se é realmente uma imagem.
         */
        if (!file.type.startsWith("image/")) {

          alert(
            "Selecione um arquivo de imagem válido."
          );

          imagemInput.value = "";
          return;
        }


        const reader = new FileReader();

        reader.onload = (event) => {

          if (!previewImagem) {
            return;
          }

          previewImagem.src =
            event.target.result;

          previewImagem.style.display =
            "block";
        };

        reader.onerror = () => {

          alert(
            "Não foi possível carregar a imagem."
          );
        };

        reader.readAsDataURL(file);
      }
    );
  }


  /* =========================================================
     ENVIAR DENÚNCIA
  ========================================================= */

  async function enviarDenuncia(event) {

    event.preventDefault();


    /*
     * Verifica autenticação somente no momento do envio.
     */
    if (!token) {

      alert(
        "Sua sessão não foi encontrada. Faça login para enviar uma denúncia."
      );

      return;
    }


    const tituloElement =
      document.getElementById("titulo");

    const descricaoElement =
      document.getElementById("descricao");


    const titulo =
      tituloElement?.value.trim() || "";

    const descricao =
      descricaoElement?.value.trim() || "";

    const latitude =
      latitudeInput?.value || "";

    const longitude =
      longitudeInput?.value || "";

    const especieId =
      especieSelect?.value || "";

    const imagemFile =
      imagemInput?.files?.[0] || null;


    /*
     * Validação.
     */
    if (
      !titulo ||
      !descricao ||
      !latitude ||
      !longitude ||
      !especieId
    ) {

      alert(
        "Preencha todos os campos obrigatórios."
      );

      return;
    }


    const formData = new FormData();

    formData.append(
      "titulo",
      titulo
    );

    formData.append(
      "descricao",
      descricao
    );

    formData.append(
      "latitude",
      latitude
    );

    formData.append(
      "longitude",
      longitude
    );

    formData.append(
      "especieId",
      especieId
    );


    if (imagemFile) {

      formData.append(
        "imagem",
        imagemFile
      );
    }


    try {

      const response = await fetch(
        `${API_BASE_URL}/denuncias/multipart`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          body: formData
        }
      );


      if (!response.ok) {

        let mensagemErro =
          "Erro ao enviar denúncia.";

        try {

          const erro =
            await response.json();

          mensagemErro =
            erro.message ||
            erro.mensagem ||
            mensagemErro;

        } catch {

          const texto =
            await response.text();

          if (texto) {
            mensagemErro = texto;
          }
        }

        throw new Error(
          mensagemErro
        );
      }


      alert(
        "Denúncia enviada com sucesso!"
      );


      fecharModal();

      /*
       * Atualiza a lista.
       */
      await fetchDenuncias();


    } catch (error) {

      console.error(
        "Erro ao enviar denúncia:",
        error
      );

      alert(
        `Erro ao enviar denúncia: ${error.message}`
      );
    }
  }


  if (serForm) {

    serForm.addEventListener(
      "submit",
      enviarDenuncia
    );
  }


  /* =========================================================
     BUSCAR DENÚNCIAS
  ========================================================= */

  async function fetchDenuncias() {

    if (!denunciasContainer) {
      return;
    }

    try {

      mostrarEstadoCarregamento();


      const response = await fetch(
        `${API_BASE_URL}/denuncias`
      );


      if (!response.ok) {

        throw new Error(
          `Erro HTTP ${response.status}`
        );
      }


      const data =
        await response.json();


      /*
       * Garante que seja um array.
       */
      if (!Array.isArray(data)) {

        todasDenuncias = [];

      } else {

        /*
         * Mostra somente denúncias aprovadas.
         */
        todasDenuncias =
          data.filter(
            (denuncia) =>
              denuncia.statusAprovacao ===
              "APROVADO"
          );
      }


      aplicarFiltros();


    } catch (error) {

      console.error(
        "Erro ao buscar denúncias:",
        error
      );

      mostrarEstadoErro();
    }
  }


  /* =========================================================
     FILTROS
  ========================================================= */

  function aplicarFiltros() {

    const statusSelecionado =
      statusFiltro?.value
        ?.trim()
        .toUpperCase() || "";


    const tituloBusca =
      buscaTitulo?.value
        ?.trim()
        .toLowerCase() || "";


    const filtradas =
      todasDenuncias.filter(
        (denuncia) => {

          /*
           * Status.
           */
          const statusAtual =
            (
              denuncia.statusAprovacao ||
              ""
            ).toUpperCase();


          const statusOk =
            !statusSelecionado ||
            statusAtual ===
            statusSelecionado;


          /*
           * Título.
           */
          const tituloAtual =
            (
              denuncia.titulo ||
              ""
            ).toLowerCase();


          const tituloOk =
            !tituloBusca ||
            tituloAtual.includes(
              tituloBusca
            );


          return statusOk && tituloOk;
        }
      );


    mostrarDenuncias(filtradas);
  }


  if (statusFiltro) {

    statusFiltro.addEventListener(
      "change",
      aplicarFiltros
    );
  }


  if (buscaTitulo) {

    buscaTitulo.addEventListener(
      "input",
      aplicarFiltros
    );
  }


  /* =========================================================
     MOSTRAR DENÚNCIAS
  ========================================================= */

  function mostrarDenuncias(denuncias) {

    if (!denunciasContainer) {
      return;
    }


    denunciasContainer.innerHTML = "";


    /*
     * Nenhuma denúncia.
     */
    if (!denuncias.length) {

      const vazio =
        document.createElement("div");

      vazio.className =
        "denuncias-vazio";

      vazio.textContent =
        "Nenhuma denúncia encontrada.";

      denunciasContainer.appendChild(
        vazio
      );

      return;
    }


    /*
     * Conta quantas denúncias possuem
     * o mesmo título.
     */
    const contadorTitulos =
      new Map();


    denuncias.forEach((denuncia) => {

      const titulo =
        denuncia.titulo || "Sem título";

      contadorTitulos.set(
        titulo,
        (contadorTitulos.get(titulo) || 0) + 1
      );
    });


    denuncias.forEach((denuncia) => {

      const card =
        document.createElement("article");

      card.className =
        "denuncia-card";


      /* =====================================================
         IMAGEM
      ===================================================== */

      const imgWrapper =
        document.createElement("div");

      imgWrapper.className =
        "img-wrapper";


      const img =
        document.createElement("img");


      img.alt =
        denuncia.titulo
          ? `Imagem da denúncia: ${denuncia.titulo}`
          : "Imagem da denúncia";


      img.loading = "lazy";


      if (denuncia.imagem) {

        /*
         * Caso a API devolva Base64.
         */
        img.src =
          denuncia.imagem.startsWith("data:")
            ? denuncia.imagem
            : `data:image/jpeg;base64,${denuncia.imagem}`;

      } else {

        img.src =
          "assets/images/default.png";
      }


      /*
       * Se a imagem não carregar,
       * utiliza imagem padrão.
       */
      img.addEventListener(
        "error",
        () => {

          if (
            img.src.includes(
              "assets/images/default.png"
            )
          ) {
            return;
          }

          img.src =
            "assets/images/default.png";
        }
      );


      imgWrapper.appendChild(img);


      /* =====================================================
         CONTADOR
      ===================================================== */

      const titulo =
        denuncia.titulo || "Sem título";


      const quantidade =
        contadorTitulos.get(titulo) || 1;


      const contador =
        document.createElement("span");

      contador.className =
        "contador-badge";

      contador.textContent =
        quantidade;


      contador.setAttribute(
        "aria-label",
        `${quantidade} denúncia${quantidade > 1 ? "s" : ""} com este título`
      );


      imgWrapper.appendChild(
        contador
      );


      card.appendChild(
        imgWrapper
      );


      /* =====================================================
         CORPO DO CARD
      ===================================================== */

      const body =
        document.createElement("div");

      body.className =
        "card-body";


      /* =====================================================
         TÍTULO
      ===================================================== */

      const tituloWrapper =
        document.createElement("div");

      tituloWrapper.className =
        "titulo-wrapper";


      const tituloElement =
        document.createElement("h4");

      tituloElement.textContent =
        titulo;


      const icon =
        document.createElement("i");

      icon.className =
        "fas fa-exclamation-triangle";

      icon.setAttribute(
        "aria-hidden",
        "true"
      );


      tituloWrapper.appendChild(
        tituloElement
      );

      tituloWrapper.appendChild(
        icon
      );


      body.appendChild(
        tituloWrapper
      );


      /* =====================================================
         DESCRIÇÃO
      ===================================================== */

      const descricaoWrapper =
        document.createElement("div");

      descricaoWrapper.className =
        "descricao-wrapper";


      const btnDescricao =
        document.createElement("button");

      btnDescricao.type =
        "button";

      btnDescricao.className =
        "btn-descricao";

      btnDescricao.textContent =
        "Ver detalhes ▼";


      const descricao =
        document.createElement("p");

      descricao.className =
        "descricao";

      descricao.textContent =
        denuncia.descricao ||
        "Sem descrição";


      /*
       * Estado inicial fechado.
       */
      descricao.style.maxHeight =
        "0px";


      btnDescricao.setAttribute(
        "aria-expanded",
        "false"
      );


      btnDescricao.addEventListener(
        "click",
        () => {

          const aberto =
            btnDescricao.getAttribute(
              "aria-expanded"
            ) === "true";


          if (!aberto) {

            descricao.style.maxHeight =
              `${descricao.scrollHeight}px`;

            btnDescricao.textContent =
              "Ocultar ▲";

            btnDescricao.setAttribute(
              "aria-expanded",
              "true"
            );

          } else {

            descricao.style.maxHeight =
              "0px";

            btnDescricao.textContent =
              "Ver detalhes ▼";

            btnDescricao.setAttribute(
              "aria-expanded",
              "false"
            );
          }
        }
      );


      descricaoWrapper.appendChild(
        btnDescricao
      );

      descricaoWrapper.appendChild(
        descricao
      );


      body.appendChild(
        descricaoWrapper
      );


      /* =====================================================
         LOCALIZAÇÃO
      ===================================================== */

      const local =
        document.createElement("p");

      local.className =
        "localizacao";


      const localIcon =
        document.createElement("i");

      localIcon.className =
        "fas fa-map-marker-alt";

      localIcon.setAttribute(
        "aria-hidden",
        "true"
      );


      const localTexto =
        document.createElement("span");

      localTexto.textContent =
        denuncia.localizacao ||
        "Localização não informada";


      local.appendChild(
        localIcon
      );

      local.appendChild(
        localTexto
      );


      body.appendChild(
        local
      );


      card.appendChild(
        body
      );


      denunciasContainer.appendChild(
        card
      );
    });
  }


  /* =========================================================
     ESTADO DE CARREGAMENTO
  ========================================================= */

  function mostrarEstadoCarregamento() {

    if (!denunciasContainer) {
      return;
    }

    denunciasContainer.innerHTML = "";

    const loading =
      document.createElement("div");

    loading.className =
      "denuncias-loading";

    loading.textContent =
      "Carregando denúncias...";

    denunciasContainer.appendChild(
      loading
    );
  }


  /* =========================================================
     ESTADO DE ERRO
  ========================================================= */

  function mostrarEstadoErro() {

    if (!denunciasContainer) {
      return;
    }

    denunciasContainer.innerHTML = "";

    const erro =
      document.createElement("div");

    erro.className =
      "denuncias-erro";

    erro.textContent =
      "Não foi possível carregar as denúncias. Tente novamente.";

    denunciasContainer.appendChild(
      erro
    );
  }


  /* =========================================================
     GPS
  ========================================================= */

  if (btnGPS) {

    btnGPS.addEventListener(
      "click",
      () => {

        if (!navigator.geolocation) {

          alert(
            "A geolocalização não é suportada pelo seu navegador."
          );

          return;
        }


        /*
         * Garante que o mapa esteja inicializado.
         */
        inicializarMapa();


        navigator.geolocation.getCurrentPosition(

          (position) => {

            const {
              latitude,
              longitude
            } = position.coords;


            definirLocalizacao(
              latitude,
              longitude
            );


            buscarEndereco(
              latitude,
              longitude
            );
          },


          (error) => {

            console.error(
              "Erro ao acessar GPS:",
              error
            );


            let mensagem =
              "Não foi possível obter sua localização.";


            switch (error.code) {

              case error.PERMISSION_DENIED:

                mensagem =
                  "Permissão de localização negada. Autorize o GPS no navegador.";

                break;


              case error.POSITION_UNAVAILABLE:

                mensagem =
                  "A localização não está disponível.";

                break;


              case error.TIMEOUT:

                mensagem =
                  "A solicitação de localização demorou demais.";

                break;
            }


            alert(mensagem);
          },


          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }
    );
  }


  /* =========================================================
     BUSCAR ENDEREÇO
  ========================================================= */

  if (btnBuscarEndereco) {

    btnBuscarEndereco.addEventListener(
      "click",
      async () => {

        const endereco =
          inputEndereco?.value.trim() || "";


        if (!endereco) {

          alert(
            "Digite um endereço para pesquisar."
          );

          return;
        }


        try {

          btnBuscarEndereco.disabled =
            true;


          const url =
            `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(endereco)}` +
            `&format=json&limit=1`;


          const response =
            await fetch(url, {
              headers: {
                Accept:
                  "application/json"
              }
            });


          if (!response.ok) {

            throw new Error(
              `Erro HTTP ${response.status}`
            );
          }


          const data =
            await response.json();


          if (!data.length) {

            alert(
              "Endereço não encontrado."
            );

            return;
          }


          const latitude =
            Number(data[0].lat);

          const longitude =
            Number(data[0].lon);


          inicializarMapa();


          definirLocalizacao(
            latitude,
            longitude
          );


          /*
           * Usa o endereço retornado pelo Nominatim.
           */
          if (inputEndereco) {

            inputEndereco.value =
              data[0].display_name || endereco;
          }


          const enderecoValue =
            document.getElementById(
              "enderecoValue"
            );


          if (enderecoValue) {

            enderecoValue.textContent =
              data[0].display_name ||
              endereco;
          }


        } catch (error) {

          console.error(
            "Erro ao buscar endereço:",
            error
          );

          alert(
            "Erro ao buscar endereço. Verifique sua conexão com a internet."
          );


        } finally {

          btnBuscarEndereco.disabled =
            false;
        }
      }
    );
  }


  /* =========================================================
     REVERSE GEOCODING
  ========================================================= */

  async function buscarEndereco(
    latitude,
    longitude
  ) {

    try {

      const url =
        `https://nominatim.openstreetmap.org/reverse?` +
        `lat=${encodeURIComponent(latitude)}` +
        `&lon=${encodeURIComponent(longitude)}` +
        `&format=json`;


      const response =
        await fetch(url, {
          headers: {
            Accept:
              "application/json"
          }
        });


      if (!response.ok) {

        throw new Error(
          `Erro HTTP ${response.status}`
        );
      }


      const data =
        await response.json();


      const endereco =
        data.display_name ||
        "Endereço não encontrado";


      if (inputEndereco) {

        inputEndereco.value =
          endereco;
      }


      const enderecoValue =
        document.getElementById(
          "enderecoValue"
        );


      if (enderecoValue) {

        enderecoValue.textContent =
          endereco;
      }


    } catch (error) {

      console.error(
        "Erro ao buscar endereço:",
        error
      );


      if (inputEndereco) {

        inputEndereco.value =
          "";
      }


      const enderecoValue =
        document.getElementById(
          "enderecoValue"
        );


      if (enderecoValue) {

        enderecoValue.textContent =
          "Não foi possível identificar o endereço.";
      }
    }
  }


  /* =========================================================
     INICIALIZAÇÃO
  ========================================================= */

  /*
   * A lista de denúncias é pública.
   *
   * Portanto, NÃO colocamos a verificação do token aqui.
   * O token é necessário somente para enviar uma denúncia.
   */
  fetchDenuncias();

});

