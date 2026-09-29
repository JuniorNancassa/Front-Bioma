 <?= $this->include('partials/main') ?>

    <head>
        <?php echo view('partials/title-meta', array('title' => 'Apex Candlestick Charts')) ?>

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

                        <?php echo view('partials/page-title', array('subtitle' => 'Apex', 'title' => 'Candlestick Charts')) ?>

                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title">Simple Candlestick Chart</h4>
                                        <div dir="ltr">
                                            <div id="simple-candlestick" class="apex-charts" data-colors="#17a497,#fa5c7c"></div>
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
                                        <h4 class="header-title">Combo Candlestick Chart</h4>
                                        <div dir="ltr">
                                            <div id="combo-candlestick" class="apex-charts" data-colors="#17a497,#fa5c7c"></div>
                                            <div id="combo-bar-candlestick" class="apex-charts" data-colors="#4254ba,#ffbc00"></div>
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
                                        <h4 class="header-title mb-3">Category X-Axis</h4>
                                        <div dir="ltr">
                                            <div id="x-axis-candlestick" class="apex-charts" data-colors="#17a497,#fa5c7c,#4254ba"></div>
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
                                        <h4 class="header-title mb-3">Candlestick with Line</h4>
                                        <div dir="ltr">
                                            <div id="candlestick-with-line" class="apex-charts" data-colors="#4254ba,#17a497,#fa5c7c"></div>
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

        <!-- Apex Chart Candlestick Demo js -->
        <script src="https://apexcharts.com/samples/assets/ohlc.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.17/dayjs.min.js"></script>
        <script src="/assets/js/pages/demo.apex-candlestick.js"></script>

        <!-- App js -->
        <script src="/assets/js/app.min.js"></script>

    </body>
</html>
