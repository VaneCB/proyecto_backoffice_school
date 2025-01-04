@php use App\Http\Livewire\Table; @endphp
<div>
    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-2" style="padding: 0 0 0 40px">
                    <a href="{{ route($addRoute) }}"
                       class="btn bg-gradient-dark btn-sm ">{{ 'Añadir +' }}</a>
                </div>
                @if (session()->has('error'))
                    <div class="alert">
                        {{ session('error') }}
                    </div>
                @endif
            </div>
            <table class="table">
                <thead>
                <tr>
                    @foreach($this->columns() as $column)
                        @if($this->showOrders)
                            <strong>
                                <th wire:click="sort('{{ $column->key }}')"
                                    class="text-uppercase font-weight-bold"
                                    style="text-align: left; font-size: 15px">
                                    <div>
                                        @if($column->key != 'date')
                                            {{ $column->label }}
                                        @endif
                                    </div>
                                    @if($column->key == 'date')
                                        <div class="py-3 px-6 flex items-left cursor-pointer strong">
                                            {{ $column->label}}
                                            @if($sortBy === $column->key)
                                                @if ($sortDirection === 'asc')
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                         viewBox="0 0 20 20"
                                                         fill="currentColor">
                                                        <path fill-rule="evenodd"
                                                              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                                              clip-rule="evenodd"/>
                                                    </svg>
                                                @else
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                         viewBox="0 0 20 20"
                                                         fill="currentColor">
                                                        <path fill-rule="evenodd"
                                                              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                              clip-rule="evenodd"/>
                                                    </svg>
                                                @endif
                                            @endif
                                            @endif
                                        </div>
                                </th>
                            </strong>
                        @else
                            <strong>
                                <th class="text-uppercase text-primary font-weight-bold"
                                    style="text-align: left">
                                    {{ $column->label }}
                                </th>
                            </strong>
                        @endif
                    @endforeach
                    @if(count($this->actionColFile) > 0)
                        <th>
                            <div class="py-0.5 px-3 flex items-left">
                                Ficha técnica
                            </div>
                        </th>
                    @endif
                    @if(count($this->actionCol) > 0)
                        <th class="text-uppercase text-xs text-primary font-weight-bold col"
                            style="text-align: left">
                        </th>
                    @endif
                </tr>
                @if($this->showFilters)
                    <tr>
                        @foreach($this->columns() as $column)
                            <th class="text-xs text-secondary" style="text-align: left">
                                @if($column->filterType != null)
                                    <div class="flex items-left ">
                                        @switch($column->filterType)
                                            @case('date')
                                                <input type="date" name="{{$column->key}}"
                                                       class="form-input"
                                                       wire:model="filters.{{$column->key}}"/>
                                                @break
                                            @case('text')
                                                <input type="text" name="{{ $column->key }}"
                                                       class="form-input"
                                                       wire:model="filters.{{$column->key}}"/>
                                                @break
                                        @endswitch
                                    </div>
                                @endif
                            </th>
                        @endforeach
                        @if(count($this->actionCol) > 0)
                            <th class="text-uppercase text-xxs font-weight-bold"
                                style="text-align: left"></th>
                        @endif
                    </tr>
                @endif
                </thead>
                <tbody>
                @foreach($this->data() as $row)
                    <tr>
                        @foreach($this->columns() as $column)
                            <td class="p-3 pt-4" style="text-align: left;  font-size: 14px">
                                <div class=" flex items-left">
                                    {{--<div class="py-0.5 px-0.5 flex items-left">--}}
                                    <x-dynamic-component
                                        :component="$column->component"
                                        :value="Table::getValue($row, $column->key)">
                                    </x-dynamic-component>
                                    @if($column->input)
                                        <input type="checkbox" wire:model="selected" value="{{ $row->id }}">
                                    @endif
                                </div>
                            </td>
                        @endforeach
                        @if(count($this->actionColFile) > 0)
                            <td class="text-uppercase text-xxs font-weight-bold" style="text-align: center">
                                <div class="flex items-center cursor-pointer">
                                    @foreach($this->actionColFile as $action)
                                        @if($row['ficha_tecnica_url'])
                                            <a href="{{ route($action[2], $row['id']) }}">
                                                <li class="{{ $action[1] }}"></li>
                                            </a>
                                        @endif
                                    @endforeach
                                </div>
                            </td>
                        @endif
                        @if(count($this->actionCol) > 0)
                            <td style="text-align: left">
                                <div class="py-0.5 px-0.5 flex items-left">
                                    @foreach($this->actionCol as $action)
                                        @if($action[0] === 'Editar')
                                            <a class="btn bg-gradient-dark" type="button"
                                               href="{{ route($action[2], $row['id']) }}">
                                                <li class="{{ $action[1] }}"></li>
                                            </a>
                                        @elseif($action[0] === 'Ver')
                                            <a class="btn bg-gradient-info" type="button"
                                               href="{{ route($action[2], $row['id']) }}">
                                                <li class="{{ $action[1] }}"></li>
                                            </a>
                                        @endif
                                    @endforeach
                                    @if(count($this->actionColDelete) > 0)
                                        @foreach($this->actionColDelete as $action)
                                            <button type="button" class="btn bg-gradient-danger"
                                                    data-bs-toggle="modal" data-bs-target="#deleteModal_{{$row->id}}">
                                                <li class="{{ $action[1] }}"></li>
                                            </button>
                                            <!-- Modal -->
                                            <div class="modal fade" id="deleteModal_{{$row->id}}" tabindex="-1"
                                                 role="dialog"
                                                 aria-labelledby="deleteModalLabel" aria-hidden="true">
                                                <div class="modal-dialog modal-dialog-centered" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="exampleModalLabel">
                                                                Eliminar {{ str_replace('-table', '', Route::currentRouteName()) }}</h5>
                                                            <button type="button" class="btn-close"
                                                                    data-bs-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <p>¿Está seguro que quiere eliminar?</p>
                                                            <br>
                                                            <h4 class="subh4">{{ $row['name'] }}</h4>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button"
                                                                    class="btn bg-gradient-secondary"
                                                                    data-bs-dismiss="modal">Cancelar
                                                            </button>
                                                            <a type="button"
                                                               wire:click="deleteRecord({{$row->id}})"
                                                               class="btn bg-gradient-dark" data-bs-dismiss="modal">Eliminar</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    @endif
                                </div>
                            </td>
                        @endif
                    </tr>
                @endforeach
                </tbody>
            </table>
            {{$this->data()->links()}}
        </div>
    </main>
</div>


