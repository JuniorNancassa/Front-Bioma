 <?= $this->include('partials/main') ?>

    <head>
        <?php echo view('partials/title-meta', array('title' => 'Chartjs')) ?>

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

                        <?php echo view('partials/page-title', array('subtitle' => 'Charts', 'title' => 'Chartjs')) ?>


                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Interpolation</h4>

                                        <div dir="ltr">
                                            <div class="mt-3 chartjs-chart" style="height: 320px;">
                                                <canvas id="interpolation-example" data-colors="#4254ba,#17a497"></canvas>
                                            </div>
                                        </div>
                                    </div> <!-- end card body-->
                                </div> <!-- end card -->
                            </div><!-- end col-->

                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Line</h4>

                                        <div dir="ltr">
                                            <div class="mt-3 chartjs-chart" style="height: 320px;">
                                                <canvas id="line-example" data-colors="#4254ba,#17a497"></canvas>
                                            </div>
                                        </div>
                                    </div> <!-- end card body-->
                                </div> <!-- end card -->
                            </div><!-- end col-->
                        </div>
                        <!-- end row-->


                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Multi-Axes</h4>

                                        <div dir="ltr">
                                            <div class="mt-3 chartjs-chart" style="height: 320px;">
                                                <canvas id="multi-axes-example" data-colors="#4254ba,#17a497"></canvas>
                                            </div>
                                        </div>
                                    </div> <!-- end card body-->
                                </div> <!-- end card -->
                            </div><!-- end col-->

                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Point Styling</h4>

                                        <div dir="ltr">
                                            <div class="mt-3 chartjs-chart" style="height: 320px;">
                                                <canvas id="point-styling-example" data-colors="#4254ba,#17a497"></canvas>
                                            </div>
                                        </div>
                                    </div> <!-- end card body-->
                                </div> <!-- end card -->
                            </div><!-- end col-->
                        </div>
                        <!-- end row-->

                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Line Segment</h4>

                                        <div dir="ltr">
                                            <div class="mt-3 chartjs-chart" style="height: 320px;">
                                                <canvas id="line-segment-example" data-colors="#4254ba,#17a497"></canvas>
                                            </div>
                                        </div>
                                    </div> <!-- end card body-->
                                </div> <!-- end card -->
                            </div><!-- end col-->

                            <div class="col-xl-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">Stepped</h4>

                                        <div dir="ltr">
                                            <div class="mt-3 chartjs-chart" style="height: 320px;">
                                                <canvas id="stepped-example" data-colors="#4254ba,#17a497"></canvas>
                                            </div>
                                        </div>
                                    </div> <!-- end card body-->
                                </div> <!-- end card -->
                            </div><!-- end col-->
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

        <!-- Chart.js-->
        <script src="/assets/libs/chart.js/chart.min.js"></script>

        <!-- Chart.js Line Demo js -->
        <script src="/assets/js/pages/demo.chartjs-line.js"></script>

        <!-- App js -->
        <script src="/assets/js/app.min.js"></script>

    </body>
</html>
