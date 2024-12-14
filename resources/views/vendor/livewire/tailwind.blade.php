<div>
    @if ($paginator->hasPages())
         <nav aria-label="...">
             <ul class="pagination justify-content-center">
                @if ($paginator->onFirstPage())
                    <li class="page-item disabled">
                        <a class="page-link" tabindex="-1">
                            <i class="fa fa-angle-left"></i>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
                @else
                    <li class="page-item">
                        <button type="button"
                                dusk="previousPage{{ $paginator->getPageName() == 'page' ? '' : '.' . $paginator->getPageName() }}"
                                class="page-link fa fa-angle-left"
                                wire:click="previousPage('{{ $paginator->getPageName() }}')"
                                wire:loading.attr="disabled" rel="prev"
                                aria-label="@lang('pagination.previous')"></button>
                    </li>
                @endif

                {{-- Pagination Elements --}}
                @foreach ($elements as $element)
                    {{-- "Three Dots" Separator --}}
                    @if (is_string($element))
                        <li class="page-item active"><a class="page-link" href="javascript:;">{{$element}}</a></li>
                    @endif

                    {{-- Array Of Links --}}
                    @if (is_array($element))
                        @foreach ($element as $page => $url)
                            @if ($page == $paginator->currentPage())
                                <li class="page-item active disabled"><a
                                        class="page-link bg-gradient-dark text-white">{{$page}}</a></li>
                            @else
                                <li class="page-item">
                                    <button class="page-link" wire:click="gotoPage({{ $page }})"
                                            aria-label="{{ __('pagination.goto_page', ['page' => $page]) }}">
                                        {{ $page }}
                                    </button>
                                </li>
                            @endif
                        @endforeach
                    @endif
                @endforeach

                {{-- Next Page Link --}}
                @if ($paginator->hasMorePages())
                    <li class="page-item">
                        <button type="button"
                                dusk="nextPage{{ $paginator->getPageName() == 'page' ? '' : '.' . $paginator->getPageName() }}"
                                class="page-link fa fa-angle-right" wire:click="nextPage('{{ $paginator->getPageName() }}')"
                                wire:loading.attr="disabled" rel="next" aria-label="@lang('pagination.next')">
                        </button>
                    </li>
                @else
                    <li class="page-item disabled">
                        <a class="page-link">
                            <i class="fa fa-angle-right"></i>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                @endif
            </ul>
        </nav>
        @endif
</div>
