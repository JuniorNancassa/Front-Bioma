/* =========================================================
   BIOMA-GUINÉ
   DASHBOARD DE ESPÉCIES
========================================================= */


/* =========================================================
   DADOS DEMONSTRATIVOS
========================================================= */

const speciesData = [

    {
        nome: "Tartaruga-verde",
        cientifico: "Chelonia mydas",
        grupo: "Répteis",
        habitat: "Marinho",
        status: "EN",
        populacao: 850
    },

    {
        nome: "Tartaruga-de-pente",
        cientifico: "Eretmochelys imbricata",
        grupo: "Répteis",
        habitat: "Marinho",
        status: "CR",
        populacao: 230
    },

    {
        nome: "Peixe-boi-africano",
        cientifico: "Trichechus senegalensis",
        grupo: "Mamíferos",
        habitat: "Manguezal",
        status: "VU",
        populacao: 420
    },

    {
        nome: "Hipopótamo",
        cientifico: "Hippopotamus amphibius",
        grupo: "Mamíferos",
        habitat: "Água doce",
        status: "VU",
        populacao: 350
    },

    {
        nome: "Pelicano-cinzento",
        cientifico: "Pelecanus rufescens",
        grupo: "Aves",
        habitat: "Zonas húmidas",
        status: "LC",
        populacao: 1200
    },

    {
        nome: "Abutre-do-Cabo",
        cientifico: "Gyps coprotheres",
        grupo: "Aves",
        habitat: "Savana",
        status: "EN",
        populacao: 410
    },

    {
        nome: "Crocodilo-do-Nilo",
        cientifico: "Crocodylus niloticus",
        grupo: "Répteis",
        habitat: "Água doce",
        status: "LC",
        populacao: 900
    },

    {
        nome: "Tubarão-martelo",
        cientifico: "Sphyrna lewini",
        grupo: "Peixes",
        habitat: "Marinho",
        status: "CR",
        populacao: 180
    },

    {
        nome: "Raia-gigante",
        cientifico: "Mobula birostris",
        grupo: "Peixes",
        habitat: "Marinho",
        status: "EN",
        populacao: 280
    },

    {
        nome: "Mangue-vermelho",
        cientifico: "Rhizophora mangle",
        grupo: "Flora",
        habitat: "Manguezal",
        status: "VU",
        populacao: 700
    },

    {
        nome: "Macaco-verde",
        cientifico: "Chlorocebus sabaeus",
        grupo: "Mamíferos",
        habitat: "Floresta",
        status: "NT",
        populacao: 630
    },

    {
        nome: "Rã-d'água",
        cientifico: "Amietophrynus regularis",
        grupo: "Anfíbios",
        habitat: "Zonas húmidas",
        status: "DD",
        populacao: 190
    }

];


/* =========================================================
   CONFIGURAÇÃO DOS STATUS
========================================================= */

const statusLabels = {

    CR: "Criticamente em Perigo",

    EN: "Em Perigo",

    VU: "Vulnerável",

    NT: "Quase Ameaçada",

    LC: "Pouco Preocupante",

    DD: "Dados Insuficientes"

};


/* =========================================================
   ELEMENTOS
========================================================= */

const tableBody =
    document.getElementById("speciesTable");

const totalSpecies =
    document.getElementById("totalSpecies");

const criticalSpecies =
    document.getElementById("criticalSpecies");

const endangeredSpecies =
    document.getElementById("endangeredSpecies");

const vulnerableSpecies =
    document.getElementById("vulnerableSpecies");

const resultsCount =
    document.getElementById("resultsCount");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchSpecies");

const statusFilter =
    document.getElementById("statusFilter");

const groupFilter =
    document.getElementById("groupFilter");

const clearFilters =
    document.getElementById("clearFilters");


/* =========================================================
   CORES DOS GRÁFICOS
========================================================= */

const chartColors = {

    CR: "#d93636",

    EN: "#f28c28",

    VU: "#e7a91a",

    NT: "#1976d2",

    LC: "#4caf50",

    DD: "#7c8780"

};


/* =========================================================
   CONTAGEM
========================================================= */

function countStatus(data, status) {

    return data.filter(
        species => species.status === status
    ).length;

}


/* =========================================================
   RENDERIZAR TABELA
========================================================= */

function renderTable(data) {

    tableBody.innerHTML = "";

    resultsCount.textContent =
        `${data.length} ${data.length === 1 ? "espécie" : "espécies"}`;


    if (data.length === 0) {

        emptyState.hidden = false;

        return;

    }

    emptyState.hidden = true;


    data.forEach(species => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="species-name">
                    ${species.nome}
                </span>

            </td>

            <td>

                <span class="scientific-name">
                    ${species.cientifico}
                </span>

            </td>

            <td>
                ${species.grupo}
            </td>

            <td>
                ${species.habitat}
            </td>

            <td>

                <span class="status-badge status-${species.status}">
                    ${statusLabels[species.status]}
                </span>

            </td>

            <td>
                ${species.populacao.toLocaleString("pt-BR")}
            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =========================================================
   ATUALIZAR KPIs
========================================================= */

function updateStats(data) {

    totalSpecies.textContent =
        data.length;

    criticalSpecies.textContent =
        countStatus(data, "CR");

    endangeredSpecies.textContent =
        countStatus(data, "EN");

    vulnerableSpecies.textContent =
        countStatus(data, "VU");

}


/* =========================================================
   FILTRAR
========================================================= */

function filterSpecies() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const status =
        statusFilter.value;

    const group =
        groupFilter.value;


    const filtered =
        speciesData.filter(species => {

            const matchesSearch =

                species.nome
                    .toLowerCase()
                    .includes(search)

                ||

                species.cientifico
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =
                status === "todos"
                ||
                species.status === status;


            const matchesGroup =
                group === "todos"
                ||
                species.grupo === group;


            return (
                matchesSearch
                &&
                matchesStatus
                &&
                matchesGroup
            );

        });


    renderTable(filtered);

    updateStats(filtered);

    updateCharts(filtered);

}


/* =========================================================
   GRÁFICO — ESTADO
========================================================= */

let statusChart;

function createStatusChart(data) {

    const context =
        document
            .getElementById("statusChart")
            .getContext("2d");


    statusChart =
        new Chart(context, {

            type: "bar",

            data: {

                labels: [
                    "Crítico",
                    "Em Perigo",
                    "Vulnerável",
                    "Quase Ameaçada",
                    "Pouco Preocupante",
                    "Dados Insuficientes"
                ],

                datasets: [

                    {
                        label: "Espécies",

                        data: [
                            countStatus(data, "CR"),
                            countStatus(data, "EN"),
                            countStatus(data, "VU"),
                            countStatus(data, "NT"),
                            countStatus(data, "LC"),
                            countStatus(data, "DD")
                        ],

                        backgroundColor: [
                            chartColors.CR,
                            chartColors.EN,
                            chartColors.VU,
                            chartColors.NT,
                            chartColors.LC,
                            chartColors.DD
                        ],

                        borderRadius: 8,

                        borderSkipped: false

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            precision: 0
                        }

                    },

                    x: {

                        grid: {
                            display: false
                        }

                    }

                }

            }

        });

}


/* =========================================================
   GRÁFICO — GRUPOS
========================================================= */

let groupChart;

function createGroupChart(data) {

    const groups = {};

    data.forEach(species => {

        groups[species.grupo] =
            (groups[species.grupo] || 0) + 1;

    });


    const context =
        document
            .getElementById("groupChart")
            .getContext("2d");


    groupChart =
        new Chart(context, {

            type: "doughnut",

            data: {

                labels:
                    Object.keys(groups),

                datasets: [

                    {

                        data:
                            Object.values(groups),

                        backgroundColor: [
                            "#2e7d32",
                            "#4caf50",
                            "#81c784",
                            "#f28c28",
                            "#1976d2",
                            "#7c4dff"
                        ],

                        borderWidth: 0

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "68%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            usePointStyle: true,

                            padding: 16

                        }

                    }

                }

            }

        });

}


/* =========================================================
   GRÁFICO — HABITAT
========================================================= */

let habitatChart;

function createHabitatChart(data) {

    const habitats = {};

    data.forEach(species => {

        habitats[species.habitat] =
            (habitats[species.habitat] || 0) + 1;

    });


    const context =
        document
            .getElementById("habitatChart")
            .getContext("2d");


    habitatChart =
        new Chart(context, {

            type: "polarArea",

            data: {

                labels:
                    Object.keys(habitats),

                datasets: [

                    {

                        data:
                            Object.values(habitats),

                        backgroundColor: [
                            "rgba(46,125,50,.75)",
                            "rgba(76,175,80,.75)",
                            "rgba(242,140,40,.75)",
                            "rgba(25,118,210,.75)",
                            "rgba(124,77,255,.75)"
                        ]

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {
                            usePointStyle: true
                        }

                    }

                }

            }

        });

}


/* =========================================================
   GRÁFICO — MONITORIZAÇÃO
========================================================= */

let monitoringChart;

function createMonitoringChart() {

    const context =
        document
            .getElementById("monitoringChart")
            .getContext("2d");


    monitoringChart =
        new Chart(context, {

            type: "line",

            data: {

                labels: [
                    "2021",
                    "2022",
                    "2023",
                    "2024",
                    "2025",
                    "2026"
                ],

                datasets: [

                    {

                        label:
                            "Observações registadas",

                        data: [
                            180,
                            230,
                            310,
                            390,
                            470,
                            560
                        ],

                        borderColor:
                            "#2e7d32",

                        backgroundColor:
                            "rgba(46,125,50,.10)",

                        fill: true,

                        tension: 0.4,

                        pointRadius: 4

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {
                        beginAtZero: true
                    },

                    x: {
                        grid: {
                            display: false
                        }
                    }

                }

            }

        });

}


/* =========================================================
   ATUALIZAR GRÁFICOS
========================================================= */

function updateCharts(data) {

    if (statusChart) {

        statusChart.data.datasets[0].data = [

            countStatus(data, "CR"),
            countStatus(data, "EN"),
            countStatus(data, "VU"),
            countStatus(data, "NT"),
            countStatus(data, "LC"),
            countStatus(data, "DD")

        ];

        statusChart.update();

    }


    if (groupChart) {

        const groups = {};

        data.forEach(species => {

            groups[species.grupo] =
                (groups[species.grupo] || 0) + 1;

        });


        groupChart.data.labels =
            Object.keys(groups);

        groupChart.data.datasets[0].data =
            Object.values(groups);

        groupChart.update();

    }


    if (habitatChart) {

        const habitats = {};

        data.forEach(species => {

            habitats[species.habitat] =
                (habitats[species.habitat] || 0) + 1;

        });


        habitatChart.data.labels =
            Object.keys(habitats);

        habitatChart.data.datasets[0].data =
            Object.values(habitats);

        habitatChart.update();

    }

}


/* =========================================================
   LIMPAR FILTROS
========================================================= */

clearFilters.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        statusFilter.value =
            "todos";

        groupFilter.value =
            "todos";

        filterSpecies();

    }
);


/* =========================================================
   EVENTOS
========================================================= */

searchInput.addEventListener(
    "input",
    filterSpecies
);

statusFilter.addEventListener(
    "change",
    filterSpecies
);

groupFilter.addEventListener(
    "change",
    filterSpecies
);


/* =========================================================
   MENU MOBILE
========================================================= */

const mobileMenu =
    document.getElementById("mobileMenu");

const dashboardNav =
    document.getElementById("dashboardNav");


mobileMenu.addEventListener(
    "click",
    () => {

        const isOpen =
            dashboardNav.classList.toggle("open");

        mobileMenu.setAttribute(
            "aria-expanded",
            isOpen
        );


        mobileMenu.innerHTML =
            isOpen

                ? `<i class="fa-solid fa-xmark"></i>`

                : `<i class="fa-solid fa-bars"></i>`;

    }
);


/* =========================================================
   EXPORTAR PDF
========================================================= */

const downloadPdf =
    document.getElementById("downloadPdf");


downloadPdf.addEventListener(
    "click",
    async () => {

        const buttonOriginal =
            downloadPdf.innerHTML;


        downloadPdf.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            A preparar PDF...
        `;

        downloadPdf.disabled = true;


        try {

            const dashboard =
                document.getElementById(
                    "dashboardContent"
                );


            const canvas =
                await html2canvas(
                    dashboard,
                    {
                        scale: 1.5,
                        useCORS: true,
                        backgroundColor: "#f5f8f6"
                    }
                );


            const image =
                canvas.toDataURL(
                    "image/png",
                    1.0
                );


            const {
                jsPDF
            } = window.jspdf;


            const pdf =
                new jsPDF(
                    "p",
                    "mm",
                    "a4"
                );


            const pageWidth =
                pdf.internal.pageSize.getWidth();

            const pageHeight =
                pdf.internal.pageSize.getHeight();


            const imageWidth =
                pageWidth - 20;


            const imageHeight =
                (
                    canvas.height *
                    imageWidth
                ) /
                canvas.width;


            let heightLeft =
                imageHeight;


            let position = 10;


            pdf.addImage(
                image,
                "PNG",
                10,
                position,
                imageWidth,
                imageHeight
            );


            heightLeft -=
                pageHeight - 20;


            while (heightLeft > 0) {

                position =
                    heightLeft -
                    imageHeight +
                    10;


                pdf.addPage();


                pdf.addImage(
                    image,
                    "PNG",
                    10,
                    position,
                    imageWidth,
                    imageHeight
                );


                heightLeft -=
                    pageHeight - 20;

            }


            pdf.save(
                "bioma-guine-dashboard-especies.pdf"
            );


        } catch (error) {

            console.error(
                "Erro ao gerar PDF:",
                error
            );

            alert(
                "Não foi possível gerar o PDF."
            );

        } finally {

            downloadPdf.innerHTML =
                buttonOriginal;

            downloadPdf.disabled =
                false;

        }

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeDashboard() {

    renderTable(speciesData);

    updateStats(speciesData);

    createStatusChart(speciesData);

    createGroupChart(speciesData);

    createHabitatChart(speciesData);

    createMonitoringChart();

}


document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);