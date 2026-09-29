 <?= $this->include('partials/main') ?>

    <head>
        <?php echo view('partials/title-meta', array('title' => 'Google Maps')) ?>

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

                        <?php echo view('partials/page-title', array('subtitle' => 'Maps', 'title' => 'Google Maps')) ?>

                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-3">Basic Google Map</h4>
                                        <div id="gmaps-basic" class="gmaps"></div>
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->
                            </div> <!-- end col-->
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-3">Markers Google Map</h4>
                                        <div id="gmaps-markers" class="gmaps"></div>
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->
                            </div> <!-- end col-->
                        </div>
                        <!-- end row-->

                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-3">Street View Panoramas Google Map</h4>
                                        <div id="panorama" class="gmaps"></div>
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->
                            </div> <!-- end col-->
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-3">Google Map Types</h4>
                                        <div id="gmaps-types" class="gmaps"></div>
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->
                            </div> <!-- end col-->
                        </div>
                        <!-- end row-->

                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-3">Ultra Light with Labels</h4>
                                        <div id="ultra-light" class="gmaps"></div>
                                    </div>
                                    <!-- end card-body-->
                                </div>
                                <!-- end card-->
                            </div>
                            <!-- end col-->
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                            <h4 class="header-title mb-3">Dark</h4>
                                        <div id="dark" class="gmaps"></div>
                                    </div>
                                    <!-- end card-body-->
                                </div>
                                <!-- end card-->
                            </div>
                            <!-- end col-->
                        </div>
                        <!-- end row-->
                        
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

        <!-- Google Maps API -->
        <script src="https://maps.google.com/maps/api/js"></script>
        <script src="/assets/libs/gmaps/gmaps.min.js"></script>

        <!-- Google Maps Demo js -->
        <script src="/assets/js/pages/demo.google-maps.js"></script>
    
        <!-- App js -->
        <script src="/assets/js/app.min.js"></script>

    </body>
</html>
