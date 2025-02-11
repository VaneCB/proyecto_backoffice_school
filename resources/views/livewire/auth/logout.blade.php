<div>
    <div class="column ">
        <ul class="navbar-nav justify-content-end">
            <li>
                <div class="avatar avatar-xl position-relative">
                    <a class="align-items-center d-flex m-0 navbar-brand text-wrap"
                       href="{{ route('profile', ['id' => $user->id]) }}">
                        @if(Auth::check() && Auth::user()->photo)
                            <img src="{{ asset('storage/' . Auth::user()->photo) }}" alt="User Photo"
                                 class="w-150 border-radius-lg shadow-sm nav-link text-body p-0">
                        @else
                            <img src="../assets/img/bruce-mars.jpg" alt="Default User Photo"
                                 class="w-150 border-radius-lg shadow-sm nav-link text-body p-0">
                        @endif
                    </a>
                </div>

            </li>
            <li class="nav-item px-3 d-flex align-items-center">
                <a class=" nav-link text-body p-0
                        {{ in_array(request()->route()->getName(),['profile', 'my-profile']) ? 'text-white' : '' }}"
                   wire:click="logout">
                    <i class="fa fa-sign-out text-dark  fixed-plugin-button-nav cursor-pointer"
                       style="font-size:24px"></i>
                </a>
            </li>
        </ul>
    </div>
    <div class="position-relative p-2 d-flex align-items-center">
        <!-- User Name -->
        <span class="d-sm-inline d-none {{ in_array(request()->route()->getName(),['profile', 'my-profile']) ? 'text-white' : '' }}">
            {{$user->name}}
        </span>
        <!-- SVG Icon (Right of user name) -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 20px; height: 20px; margin-left: 8px; cursor: pointer;" wire:click="logout">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
        </svg>
    </div>
</div>
{{--</div>
    <div class="column">
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
        <span class="d-sm-inline d-none {{ in_array(request()->route()->getName(),['profile', 'my-profile']) ? 'text-white' : '' }}">
        {{$user->name}}</span>
      --}}{{--  <i class="fa fa-user me-sm-1 {{ in_array(request()->route()->getName(),['profile', 'my-profile']) ? 'text-white' : '' }}"></i>--}}{{--
    </div>
    </div>--}}
{{-- <span class="d-sm-inline d-none {{ in_array(request()->route()->getName(),['profile', 'my-profile']) ? 'text-white' : '' }}" wire:click="logout">Desconectar</span>--}}

