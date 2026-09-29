 <?= $this->include('partials/main') ?>

    <head>
        <?php echo view('partials/title-meta', array('title' => 'Apex Sparklines Charts')) ?>

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

                        <?php echo view('partials/page-title', array('subtitle' => 'Apex', 'title' => 'Sparklines Charts')) ?>

                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        
                                        <div class="row" dir="ltr">
                                            <div class="col-md-4">
                                                <div id="spark1" class="apex-charts" data-colors="#DCE6EC"></div>
                                            </div>
                                            <div class="col-md-4">
                                                <div id="spark2" class="apex-charts" data-colors="#DCE6EC"></div>
                                            </div>
                                            <div class="col-md-4">
                                                <div id="spark3" class="apex-charts" data-colors="#17a497"></div>
                                            </div>
                                        </div>
                                        <!-- end row -->

                                        <div class="row mt-3">
                                            <div class="col-12">
                                                <div class="table-responsive">
                                                    <table class="table table-centered mb-0">
                                                        <thead class="table-light">
                                                            <tr>
                                                                <th>Total Value</th>
                                                                <th>Percentage of Portfolio</th>
                                                                <th>Last 10 days</th>
                                                                <th>Volume</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>$32,554</td>
                                                                <td>15%</td>
                                                                <td>
                                                                    <div id="chart1" data-colors="#4254ba"></div>
                                                                </td>
                                                                <td>
                                                                    <div id="chart5" data-colors="#4254ba"></div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>$23,533</td>
                                                                <td>7%</td>
                                                                <td>
                                                                    <div id="chart2" data-colors="#17a497"></div>
                                                                </td>
                                                                <td>
                                                                    <div id="chart6" data-colors="#17a497"></div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>$54,276</td>
                                                                <td>9%</td>
                                                                <td>
                                                                    <div id="chart3" data-colors="#ffbc00"></div>
                                                                </td>
                                                                <td>
                                                                    <div id="chart7" data-colors="#ffbc00"></div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>$11,533</td>
                                                                <td>2%</td>
                                                                <td>
                                                                    <div id="chart4" data-colors="#fa5c7c"></div>
                                                                </td>
                                                                <td>
                                                                    <div id="chart8" data-colors="#fa5c7c"></div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div> <!-- end table-responsive -->
                                            </div> <!-- end col -->
                                        </div> <!-- end row-->
                                    </div><!-- end card body-->
                                </div><!-- end card -->
                            </div> <!-- end col-->
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

        <!-- Apex Chart Sparkline Demo js -->
        <script src="/assets/js/pages/demo.apex-sparklines.js"></script>

        <!-- App js -->
        <script src="/assets/js/app.min.js"></script>

    </body>
</html>