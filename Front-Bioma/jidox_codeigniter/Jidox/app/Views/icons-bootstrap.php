 <?= $this->include('partials/main') ?>

    <head>
        <?php echo view('partials/title-meta', array('title' => 'Bootstrap Icons')) ?>

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

                        <?php echo view('partials/page-title', array('subtitle' => 'Icons', 'title' => 'Bootstrap Icons')) ?>

                        <div class="row">
                            <div class="col">
                                 <div class="card">
                                      <div class="card-body">
                                           <h5 class="card-title">Icons</h5>
                                           <p class="text-muted mb-2">Use class <code>&lt;i class=&quot;bi bi-123&quot;&gt;&lt;/i&gt;</code></p>
                                           <div class="row icons-list-demo" id="bootstrap-icons"></div>
                                      </div> <!-- end card body -->
                                 </div> <!-- end card -->
                            </div> <!-- end col -->
                       </div> <!-- end row -->
                        
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
        <script src="/assets/js/pages/demo.bootstrapicons.js"></script>    
        
        <!-- App js -->
        <script src="/assets/js/app.min.js"></script>

    </body>
</html>
