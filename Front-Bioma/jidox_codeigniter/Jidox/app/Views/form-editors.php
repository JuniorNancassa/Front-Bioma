 <?= $this->include('partials/main') ?>

    <head>
        <?php echo view('partials/title-meta', array('title' => 'Editors')) ?>

        <!-- Quill css -->
        <link href="/assets/libs/quill/quill.core.css" rel="stylesheet" type="text/css" />
        <link href="/assets/libs/quill/quill.snow.css" rel="stylesheet" type="text/css" />
        <link href="/assets/libs/quill/quill.bubble.css" rel="stylesheet" type="text/css" />

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

                        <?php echo view('partials/page-title', array('subtitle' => 'Forms', 'title' => 'Editors')) ?>

                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">
                                            <div class="mb-2">
                                                <h4 class="header-title mt-2">Quill Editor</h4>
                                                <p class="text-muted fs-14">Snow is a clean, flat toolbar theme.</p>

                                                <div id="snow-editor" style="height: 300px;">
                                                    <h3><span class="ql-size-large">Hello World!</span></h3>
                                                    <p><br></p>
                                                    <h3>This is an simple editable area.</h3>
                                                    <p><br></p>
                                                    <ul>
                                                        <li>
                                                            Select a text to reveal the toolbar.
                                                        </li>
                                                        <li>
                                                            Edit rich document on-the-fly, so elastic!
                                                        </li>
                                                    </ul>
                                                    <p><br></p>
                                                    <p>
                                                        End of simple area
                                                    </p>
                                                </div><!-- end Snow-editor-->
                                            </div>
                                        </li>

                                        <li class="list-group-item">
                                            <div class="mb-2">
                                                <h5 class="mb-1">Bubble Editor</h5>
                                                <p class="text-muted fs-14">Bubble is a simple tooltip based theme.</p>

                                                <div id="bubble-editor" style="height: 300px;">
                                                    <h3><span class="ql-size-large">Hello World!</span></h3>
                                                    <p><br></p>
                                                    <h3>This is an simple editable area.</h3>
                                                    <p><br></p>
                                                    <ul>
                                                        <li>
                                                            Select a text to reveal the toolbar.
                                                        </li>
                                                        <li>
                                                            Edit rich document on-the-fly, so elastic!
                                                        </li>
                                                    </ul>
                                                    <p><br></p>
                                                    <p>
                                                        End of simple area
                                                    </p>
                                                </div> <!-- end Snow-editor-->

                                            </div>
                                        </li>
                                    </ul> <!-- end list-->
                                </div> <!-- end card-->
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

        <!-- Quill Editor js -->
        <script src="/assets/libs/quill/quill.min.js"></script>

        <!-- Quill Demo js -->
        <script src="/assets/js/pages/demo.quilljs.js"></script>

        <!-- App js -->
        <script src="/assets/js/app.min.js"></script>

    </body>

</html>