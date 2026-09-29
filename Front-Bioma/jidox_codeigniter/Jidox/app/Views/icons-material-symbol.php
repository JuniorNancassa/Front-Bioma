 <?= $this->include('partials/main') ?>

<head>
    <?php echo view('partials/title-meta', array('title' => 'Material Symbols Icons (Google Icon)')) ?>

     <?= $this->include('partials/head-css') ?>
</head>

<body>
    <!-- Begin page -->
    <div class="wrapper">

         <?= $this->include('partials/menu') ?>

        <!-- ============================================================== -->
        <!-- Start Page Content here -->
        <!-- ============================================================== -->

        <div class="content-page">
            <div class="content">

                <!-- Start Content-->
                <div class="container-fluid">

                    <?php echo view('partials/page-title', array('subtitle' => 'Icons', 'title' => 'Material Symbols')) ?>

                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <h4 class="header-title mb-4">All Icons<a class="badge badge-soft-primary ms-2" href="https://fonts.google.com/icons" target="_blank">Google Icon</a></h4>
                                    <div class="d-flex align-items-center gap-3 mb-4">
                                        <i class="material-symbols-outlined">home</i>
                                        <span>home</span>
                                        <code> .material-symbols-outlined </code>
                                    </div>

                                    <div class="d-flex align-items-center gap-3 mb-4">
                                        <i class="material-symbols-outlined fill-1">home</i>
                                        <span>home</span>
                                        <code> .material-symbols-outlined .fill-1</code>
                                    </div>
                                    <div class="row icons-list-demo" id="icons"> </div>
                                </div> <!-- end card-body -->
                            </div> <!-- end card -->
                        </div>
                    </div>

                </div> <!-- container -->

            </div> <!-- content -->

             <?= $this->include('partials/footer') ?>

        </div>

        <!-- ============================================================== -->
        <!-- End Page content -->
        <!-- ============================================================== -->

    </div>
    <!-- END wrapper -->

     <?= $this->include('partials/right-sidebar') ?>

     <?= $this->include('partials/footer-scripts') ?>

    <!-- Remixicons Icons Demo js -->
    <script src="/assets/js/pages/demo.material-symbol.js"></script>

    <!-- App js -->
    <script src="/assets/js/app.min.js"></script>

</body>

</html>