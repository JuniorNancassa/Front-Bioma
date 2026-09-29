 <?= $this->include('partials/main') ?>

    <head>
        <?php echo view('partials/title-meta', array('title' => 'Apex RadialBar Charts')) ?>
        
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

                        <?php echo view('partials/page-title', array('subtitle' => 'Apex', 'title' => 'RadialBar Charts')) ?>

                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Basic RadialBar Chart</h4>
                                        <div dir="ltr">
                                            <div id="basic-radialbar" class="apex-charts" data-colors="#39afd1"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>
                                <!-- end card -->
                            </div>
                            <!-- end col-->
    
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Multiple RadialBars</h4>
                                        <div dir="ltr">
                                            <div id="multiple-radialbar" class="apex-charts" data-colors="#6c757d,#ffbc00,#4254ba,#17a497"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>
                                <!-- end card -->
                            </div>
                            <!-- end col-->
                        </div>
                        <!-- end row-->
                        
                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Circle Chart - Custom Angle</h4>
                                        <div class="text-center" dir="ltr">
                                            <div id="circle-angle-radial" class="apex-charts" data-colors="#17a497,#4254ba,#fa5c7c,#ffbc00"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>
                                <!-- end card -->
                            </div>
                            <!-- end col-->
    
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Circle Chart with Image</h4>
                                        <div dir="ltr">
                                            <div id="image-radial" class="apex-charts"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>
                                <!-- end card -->
                            </div>
                            <!-- end col-->
                        </div>
                        <!-- end row-->

                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Stroked Circular Guage</h4>
                                        <div dir="ltr">
                                            <div id="stroked-guage-radial" class="apex-charts" data-colors="#4254ba"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>
                                <!-- end card -->
                            </div>
                            <!-- end col-->

                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Gradient Circular Chart</h4>
                                        <div dir="ltr">
                                            <div id="gradient-chart" class="apex-charts" data-colors="#8f75da,#4254ba"></div>    
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>
                                <!-- end card -->
                            </div>
                            <!-- end col-->
                        </div>
                        <!-- end row-->

                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Semi Circle Gauge</h4>
                                        <div dir="ltr">
                                            <div id="semi-circle-gauge" class="apex-charts" data-colors="#4254ba"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>
                                <!-- end card -->
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

        <!-- Apex Chart js -->
        <script src="/assets/libs/apexcharts/apexcharts.min.js"></script>

        <!-- Apex Chart RadialBar Demo js -->
        <script src="/assets/js/pages/demo.apex-radialbar.js"></script>        

        <!-- App js -->
        <script src="/assets/js/app.min.js"></script>

    </body>
</html>
