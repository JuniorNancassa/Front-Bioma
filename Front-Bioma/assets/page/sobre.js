document.addEventListener("DOMContentLoaded", function () {

    /*
    =========================================================
    ELEMENTOS DO MENU
    =========================================================
    */

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    const menuOverlay = document.getElementById("menu-overlay");
    const userMenu = document.getElementById("user-menu");


    /*
    =========================================================
    VALIDAÇÃO
    =========================================================
    */

    if (!hamburger || !navLinks || !menuOverlay) {

        console.error(
            "Menu mobile: elementos necessários não encontrados."
        );

        return;
    }


    /*
    =========================================================
    ABRIR MENU
    =========================================================
    */

    function abrirMenu() {

        navLinks.classList.add("active");

        menuOverlay.classList.add("active");

        document.body.classList.add("menu-open");

        hamburger.setAttribute(
            "aria-expanded",
            "true"
        );

        hamburger.setAttribute(
            "aria-label",
            "Fechar menu"
        );

        hamburger.innerHTML =
            '<i class="fas fa-xmark" aria-hidden="true"></i>';

        navLinks.setAttribute(
            "aria-hidden",
            "false"
        );

        menuOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /*
    =========================================================
    FECHAR MENU
    =========================================================
    */

    function fecharMenu() {

        navLinks.classList.remove("active");

        menuOverlay.classList.remove("active");

        document.body.classList.remove("menu-open");

        hamburger.setAttribute(
            "aria-expanded",
            "false"
        );

        hamburger.setAttribute(
            "aria-label",
            "Abrir menu"
        );

        hamburger.innerHTML =
            '<i class="fas fa-bars" aria-hidden="true"></i>';

        navLinks.setAttribute(
            "aria-hidden",
            "true"
        );

        menuOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /*
    =========================================================
    ALTERNAR MENU
    =========================================================
    */

    function alternarMenu() {

        const menuAberto =
            navLinks.classList.contains("active");


        if (menuAberto) {

            fecharMenu();

        } else {

            abrirMenu();

        }

    }


    /*
    =========================================================
    CLICK NO HAMBURGER
    =========================================================
    */

    hamburger.addEventListener(
        "click",
        alternarMenu
    );


    /*
    =========================================================
    CLICK NO OVERLAY
    =========================================================
    */

    menuOverlay.addEventListener(
        "click",
        fecharMenu
    );


    /*
    =========================================================
    FECHAR AO CLICAR NOS LINKS
    =========================================================
    */

    const links =
        navLinks.querySelectorAll("a");


    links.forEach(function (link) {

        link.addEventListener(
            "click",
            fecharMenu
        );

    });


    /*
    =========================================================
    TECLA ESC
    =========================================================
    */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                navLinks.classList.contains("active")
            ) {

                fecharMenu();

            }

        }
    );


    /*
    =========================================================
    FECHAR MENU AO VOLTAR PARA DESKTOP
    =========================================================
    */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 992 &&
                navLinks.classList.contains("active")
            ) {

                fecharMenu();

            }

        }
    );


    /*
    =========================================================
    MENU DO UTILIZADOR
    =========================================================
    */

    if (userMenu) {

        userMenu.addEventListener(
            "click",
            function () {

                /*
                O comportamento de autenticação/utilizador
                continua sendo tratado pelo usuariospage.js.
                */

            }
        );


        /*
        Suporte para teclado
        */

        userMenu.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    userMenu.click();

                }

            }
        );

    }


    /*
    =========================================================
    ANIMAÇÃO REVEAL
    =========================================================
    */

    const elementosReveal =
        document.querySelectorAll(".reveal");


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        elementosReveal.forEach(
            function (elemento) {

                observer.observe(elemento);

            }
        );

    } else {

        elementosReveal.forEach(
            function (elemento) {

                elemento.classList.add(
                    "visible"
                );

            }
        );

    }


    /*
    =========================================================
    ANO AUTOMÁTICO DO FOOTER
    =========================================================
    */

    const anoAtual =
        document.getElementById("ano-atual");


    if (anoAtual) {

        anoAtual.textContent =
            new Date().getFullYear();

    }

});