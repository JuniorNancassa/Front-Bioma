
/* =========================================================
   BIO-GUINÉ | CONTACTO
   MENU HAMBURGER RESPONSIVO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    const menuOverlay = document.getElementById("menu-overlay");

    /*
     * Verifica se os elementos existem.
     * Evita erros caso o script seja carregado em outra página.
     */
    if (!hamburger || !navLinks || !menuOverlay) {
        return;
    }


    /* =====================================================
       ABRIR MENU
    ===================================================== */

    function abrirMenu() {

        navLinks.classList.add("active");

        menuOverlay.classList.add("active");

        document.body.classList.add("no-scroll");

        hamburger.setAttribute("aria-expanded", "true");

        hamburger.setAttribute("aria-label", "Fechar menu");

        /*
         * Troca o ícone hamburger pelo X.
         */
        const icon = hamburger.querySelector("i");

        if (icon) {

            icon.classList.remove("fa-bars");

            icon.classList.add("fa-xmark");
        }
    }


    /* =====================================================
       FECHAR MENU
    ===================================================== */

    function fecharMenu() {

        navLinks.classList.remove("active");

        menuOverlay.classList.remove("active");

        document.body.classList.remove("no-scroll");

        hamburger.setAttribute("aria-expanded", "false");

        hamburger.setAttribute("aria-label", "Abrir menu");

        /*
         * Volta para o ícone hamburger.
         */
        const icon = hamburger.querySelector("i");

        if (icon) {

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");
        }
    }


    /* =====================================================
       TOGGLE
    ===================================================== */

    hamburger.addEventListener("click", () => {

        const menuAberto = navLinks.classList.contains("active");

        if (menuAberto) {

            fecharMenu();

        } else {

            abrirMenu();
        }
    });


    /* =====================================================
       FECHAR AO CLICAR NO OVERLAY
    ===================================================== */

    menuOverlay.addEventListener("click", fecharMenu);


    /* =====================================================
       FECHAR AO CLICAR NUM LINK
    ===================================================== */

    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", fecharMenu);
    });


    /* =====================================================
       FECHAR COM A TECLA ESC
    ===================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            fecharMenu();
        }
    });


    /* =====================================================
       SE VOLTAR PARA DESKTOP
       O MENU É RESETADO
    ===================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 991) {

            fecharMenu();
        }
    });

});

