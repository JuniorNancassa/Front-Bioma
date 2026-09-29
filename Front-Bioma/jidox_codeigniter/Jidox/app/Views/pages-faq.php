 <?= $this->include('partials/main') ?>

<head>
    <?php echo view('partials/title-meta', array('title' => 'FAQ')) ?>

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

                    <?php echo view('partials/page-title', array('subtitle' => 'Pages', 'title' => 'FAQ')) ?>


                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row justify-content-center">
                                        <div class="col-md-6 ">
                                            <div class="text-center">
                                                <h3 class="mt-3">Frequently Asked Questions</h3>
                                                <p class="text-muted mt-3"> Do you have a question about your subscription, a recent order, products, shipping or you want to suggest a new magazine? Here you can find some helpful answers to frequently asked questions (FAQ).</p>

                                                <button type="button" class="btn btn-success mt-2"><i class="ri-mail-line me-1"></i> Email us your question</button>
                                                <button type="button" class="btn btn-info mt-2 ms-1"><i class="ri-twitter-line me-1"></i> Send us a tweet</button>
                                            </div>
                                        </div><!-- end col -->
                                    </div><!-- end row -->


                                    <div class="row mt-4 justify-content-center">
                                        <div class="col-xl-5">
                                            <div class="p-2">
                                                <div class="accordion" id="accordionExample">
                                                    <div class="accordion-item border rounded mb-2">
                                                        <div class="accordion-header">
                                                            <a href="#" class="accordion-button bg-light fw-medium text-dark" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                                What is Lorem Ipsum?
                                                            </a>
                                                        </div>

                                                        <div id="collapseOne" class="collapse show" data-bs-parent="#accordionExample">
                                                            <div class="p-3">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                                                <p class="mb-0">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion-item border rounded mb-2">
                                                        <div class="accordion-header">
                                                            <a href="#" class="accordion-button bg-light fw-medium text-dark" class="collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                Is safe use Lorem Ipsum?
                                                            </a>
                                                        </div>
                                                        <div id="collapseTwo" class="collapse" data-bs-parent="#accordionExample">
                                                            <div class="p-3">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                                                <p class="mb-0">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion-item border rounded mb-2">
                                                        <div class="accordion-header">
                                                            <a href="#" class="accordion-button bg-light fw-medium text-dark" class="collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                                Why use Lorem Ipsum?
                                                            </a>
                                                        </div>
                                                        <div id="collapseThree" class="collapse" data-bs-parent="#accordionExample">
                                                            <div class="p-3">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                                                <p class="mb-0">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- accordian end -->

                                            </div>
                                        </div>
                                        <!-- end col -->

                                        <div class="col-xl-5">
                                            <div class="p-2">
                                                <div class="accordion custom-accordion" id="accordionExample1">
                                                    <div class="accordion-item border rounded mb-2">
                                                        <div class="accordion-header">
                                                            <a href="#" class="accordion-button bg-light fw-medium text-dark" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                                                                License & Copyright
                                                            </a>
                                                        </div>

                                                        <div id="collapseFour" class="collapse show" data-bs-parent="#accordionExample1">
                                                            <div class="p-3">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                                                <p class="mb-0">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion-item border rounded mb-2">
                                                        <div class="accordion-header">
                                                            <a href="#" class="accordion-button bg-light fw-medium text-dark" class="collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                                                How many variations exist?
                                                            </a>
                                                        </div>
                                                        <div id="collapseFive" class="collapse" data-bs-parent="#accordionExample1">
                                                            <div class="p-3">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                                                <p class="mb-0">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion-item border rounded mb-2">
                                                        <div class="accordion-header">
                                                            <a href="#" class="accordion-button bg-light fw-medium text-dark" class="collapsed" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                                                Why use Lorem Ipsum?
                                                            </a>
                                                        </div>
                                                        <div id="collapseSix" class="collapse" data-bs-parent="#accordionExample1">
                                                            <div class="p-3">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                                                <p class="mb-0">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- accordian end -->
                                            </div>
                                        </div>
                                        <!-- end col -->
                                    </div>
                                    <!-- end row -->
                                </div>
                            </div>
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

    <!-- App js -->
    <script src="/assets/js/app.min.js"></script>

</body>

</html>