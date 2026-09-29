 <?= $this->include('partials/main') ?>

    <head>
        <?php echo view('partials/title-meta', array('title' => 'Error 404')) ?>

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

                        <?php echo view('partials/page-title', array('subtitle' => 'Pages', 'title' => '404 Error')) ?>

                        <div class="row justify-content-center">
                            <div class="col-lg-4">
                                <div class="text-center">

                                    <h1 class="text-error mt-4">404</h1>
                                    <h4 class="text-uppercase text-danger mt-3">Page Not Found</h4>
                                    <p class="text-muted mt-3">It's looking like you may have taken a wrong turn. Don't worry... it
                                        happens to the best of us. Here's a
                                        little tip that might help you get back on track.</p>

                                    <a class="btn btn-info mt-3" href="/"><i class="ri-home-4-line me-1"></i> Back to Home</a>
                                </div> <!-- end /.text-center-->
                            </div> <!-- end col-->
                        </div>
                        <!-- end row -->
                        
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
        
        <!-- App js -->
        <script src="/assets/js/app.min.js"></script>

    </body>
</html>
