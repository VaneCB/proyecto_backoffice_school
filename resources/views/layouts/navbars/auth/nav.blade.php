<main class="main-content border-radius-lg">
    <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur">
        <div class="container-fluid p-5">
            <nav aria-label="breadcrumb">
                <div class="row  mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h4 class="mb-1 text-uppercase">
                                {{ __('routes.' . Route::currentRouteName()) }}
                                {{--   {{$addRoute}}--}}
                            </h4>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4 d-flex justify-content-end" id="navbar">
                <ul class="navbar-nav justify-content-end">
                    <li class="nav-item d-flex align-items-center">
                        <a href="javascript:;" class="nav-link text-body font-weight-bold px-0">
                            <livewire:auth.logout />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</main>


