@if($this->lineGroups)
    @foreach($this->lineGroups as $group)
        <label>{{ $group->title . ' - ' . $group->subtitle }}</label>
        @if($this->isShow ==false)
            <button type="button"
                    class="btn btn-link text-dark text-gradient px-1 mb-0"
                    data-bs-toggle="modal"
                    data-bs-target="#editTransactionLineGroupModal_{{$group->id}}">
                <i class="far fa-edit"></i>
            </button>
            <button type="button"
                    class="btn btn-link text-dark text-gradient px-1 mb-0"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteTransactionLineGroupModal_{{$group->id}}">
                <i class="far fa-trash-alt"></i>
            </button>
        @endif
        <div class="table-responsive p-0">
            <table class="table align-items-center mb-0">
                <thead>
                <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Producto
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Descripcion
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Precio
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        H. inicio
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        H. fin
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Horas
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Contratos
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Precio/Contratos
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Cantidad
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Total
                    </th>
                    @if($this->isShow == false)
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                            Acciones
                        </th>
                    @endif
                </tr>
                </thead>
                @foreach($group->transactionLines as $l)
                    <tbody>
                    <tr>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">
                                {{ $l->productVariation->name }}
                            </p>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">{{ $l->description }}</p>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">{{ $l->price }}€</p>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">{{ $l->start_time }}</p>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">{{ $l->end_time }}</p>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">{{ $l->total_time }}</p>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">{{ $l->new_contracts }}</p>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">{{ $l->new_contracts *  config('newContracts.invoice.price_contract') }}</p>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">{{ $l->quantity }}</p>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">{{ $l->total }}€</p>
                        </td>

                        @if($this->isShow == false)
                            <td>
                                <button type="button"
                                        class="btn btn-link text-dark text-gradient px-1 mb-0"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editTransactionLineModal_{{$l->id}}">
                                    <i class="far fa-edit"></i>
                                </button>
                                <button type="button"
                                        class="btn btn-link text-dark text-gradient px-1 mb-0"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteTransactionLineModal_{{$l->id}}">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </td>
                        @endif
                    </tr>
                    </tbody>
                @endforeach
            </table>
        </div>
    @endforeach
@endif

@if($this->linesWithoutGroup)
    <label>Lineas sin grupo</label>
    <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
            <thead>
            <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    Producto
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    Descripcion
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    Precio
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    H. inicio
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    H. fin
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    Horas
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    Contratos
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    Precio/Contratos
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    Cantidad
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                    Total
                </th>
                @if($this->isShow == false)
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Acciones
                    </th>
                @endif
            </tr>
            </thead>
            @foreach($this->linesWithoutGroup as $l)
                <tbody>
                <tr>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->productVariation->name }}</p>
                    </td>

                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->description }}</p>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->price }}€</p>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->start_time }}</p>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->end_time }}</p>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->total_time }}</p>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->new_contracts }}</p>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->new_contracts * config('newContracts.invoice.price_contract')}}</p>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->quantity }}</p>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->total }}€</p>
                    </td>
                    @if($this->isShow == false)
                        <td>
                            <button type="button"
                                    class="btn btn-link text-dark text-gradient px-1 mb-0"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editTransactionLineModal_{{$l->id}}">
                                <i class="far fa-edit"></i>
                            </button>
                            <button type="button"
                                    class="btn btn-link text-dark text-gradient px-1 mb-0"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteTransactionLineModal_{{$l->id}}">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </td>
                    @endif
                </tr>
                </tbody>
            @endforeach
        </table>
    </div>
@endif

@if($this->isShow ==false)
<!-- Modal -->
@foreach($this->transactionLines as $l)
    <div class="modal fade" id="deleteTransactionLineModal_{{$l->id}}"
         tabindex="-1" role="dialog"
         aria-labelledby="deleteTransactionLineModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered"
             role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"
                        id="transactionLineModalLabel">
                        Eliminar linea</h5>
                    <button type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>¿Está seguro que quiere
                        eliminar la linea?</p>
                    <br>
                    <h4 class="subh4">{{$l->productVariation->name}}</h4>
                </div>
                <div class="modal-footer">
                    <button type="button"
                            class="btn bg-gradient-secondary"
                            data-bs-dismiss="modal"
                            wire:click="$refresh">
                        Cancelar
                    </button>
                    <a type="button"
                       wire:click="deleteTransactionLine({{$l->id}})"
                       class="btn bg-gradient-dark" data-bs-dismiss="modal">Eliminar</a>
                </div>
            </div>
        </div>
    </div>
@endforeach

<!-- Modal editTransactionLine-->
@foreach($this->transactionLines as $l)
    <div wire:ignore.self class="modal fade" id="editTransactionLineModal_{{$l->id}}" tabindex="-1"
         aria-labelledby="editTransactionLineModalLabel_{{$l->id}}"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-center" id="editTransactionLineModalLabel">Editar
                        {{$l->description}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="transactionLines-line_group" class="form-control-label">Grupo de
                                    linea</label>
                                <select wire:model.defer="lineData.{{$l->id}}.lineGroup" class="form-control"
                                        id="transactionLines-line_group">
                                    <option value="">Selecciona grupo de linea</option>
                                    @foreach($lineGroups as $group)
                                        <option
                                            value="{{ $group->id }}">{{ $group->title . ' - ' . $group->subtitle}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="transactionLines-product" class="form-control-label">Producto</label>
                                <select wire:model="lineData.{{ $l->id }}.product_variation" class="form-control"
                                        id="transactionLines-product_id">
                                    <option value="">Selecciona el producto</option>
                                    @foreach($productVariations as $product)
                                        <option value="{{ $product->id }}">{{ $product->name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="transactionLines-quantity" class="form-control-label">Cantidad</label>
                                <input wire:model="lineData.{{ $l->id }}.quantity" class="form-control"
                                       type="text"
                                       placeholder="cantidad" id="transactionLines-quantity">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="transactionLines-new_contracts" class="form-control-label">Nuevos
                                    contratos</label>
                                <input wire:model="lineData.{{ $l->id }}.new_contracts" class="form-control"
                                       type="text"
                                       placeholder="Contratos" id="transactionLines-new_contracts">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="transactionLines-new_contracts_price" class="form-control-label">€/contrato</label>
                                <input value="{{$this->getPriceContractsEdit($l->id) ?? 0}}" class="form-control"
                                       type="text"
                                       placeholder="Contratos" id="transactionLines-new_contracts_price" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="transactionLines-description" class="form-control-label">Descripción</label>
                                <input wire:model.defer="lineData.{{ $l->id }}.description" class="form-control"
                                       type="text"
                                       placeholder="descripción" id="transaction-description">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="transactionLines-start_time" class="form-control-label">Hora de
                                    inicio</label>
                                <input wire:model="lineData.{{ $l->id }}.start_time" class="form-control"
                                       type="time"
                                       placeholder="hora de inicio" id="transactionLines-start_time">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="transactionLines-end_time" class="form-control-label">Hora de fin</label>
                                <input wire:model="lineData.{{ $l->id }}.end_time" class="form-control"
                                       type="time"
                                       placeholder="hora de fin" id="transactionLines-end_time">
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="transactionLines-total" class="form-control-label">Total hora</label>
                                <input value="{{ $this->calculateTotalHoursEdit($l->id) }}" class="form-control" type="text"
                                       placeholder="Horas" id="transactionLines-total_time" readonly>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="transactionLines-price" class="form-control-label">€/H</label>
                                <input value="{{ $this->getPriceForSelectedProductVariationEdit($l->id) }}" class="form-control"
                                       type="text"
                                       placeholder="Precio por hora"
                                       id="transactionLines-price" readonly>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="transactionLines-total" class="form-control-label">Total </label>
                                <input value="{{ $this->totalLinesEdit($l->id) }}" class="form-control" type="text"
                                       placeholder="Total" id="transactionLines-total" readonly>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal"
                            wire:click="$refresh">
                        Cancelar
                    </button>
                    <button type="button" class="btn bg-gradient-dark" wire:click="updateTransactionLine({{$l->id}})"
                            data-bs-dismiss="modal">
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    </div>
@endforeach


<!-- Modal deleteTransactionLineGroupModal-->
@foreach($this->lineGroups as $group)
    <div class="modal fade" id="deleteTransactionLineGroupModal_{{$group->id}}"
         tabindex="-1" role="dialog"
         aria-labelledby="deleteTransactionLineGroupModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered"
             role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"
                        id="transactionLineGroupModalLabel">
                        Eliminar linea</h5>
                    <button type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>¿Está seguro que quiere
                        eliminar la linea?</p>
                    <br>
                    <h4 class="subh4">{{$group->title . ' - ' . $group->subtitle}}</h4>
                </div>
                <div class="modal-footer">
                    <button type="button"
                            class="btn bg-gradient-secondary"
                            data-bs-dismiss="modal"
                            wire:click="$refresh">
                        Cancelar
                    </button>
                    <a type="button"
                       wire:click="deleteTransactionLineGroup({{$group->id}})"
                       class="btn bg-gradient-dark" data-bs-dismiss="modal">Eliminar</a>
                </div>
            </div>
        </div>
    </div>
@endforeach

<!-- Modal editTransactionLineGroupModal -->
@foreach($this->lineGroups as $group)
    <div class="modal fade" id="editTransactionLineGroupModal_{{$group->id}}" tabindex="-1"
         aria-labelledby="editTransactionLineModalLabel"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-center" id="editTransactionLineModalLabel">Editar
                        {{$group->title . ' - ' . $group->subtitle}}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="transactionLinesGroups-title"
                                       class="form-control-label">Titulo</label>
                                <input wire:model.defer="groupTitle.{{$group->id}}" class="form-control" type="text"
                                       placeholder="{{$group->title}}" id="transactionLinesGroups-title">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="transactionLinesGroups-subtitle"
                                       class="form-control-label">Subtitulo</label>
                                <input wire:model.defer="groupSubtitle.{{$group->id}}" class="form-control" type="text"
                                       placeholder="{{$group->subtitle}}" id="transactionLinesGroups-subtitle">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal"
                            wire:click="$refresh">
                        Cancelar
                    </button>
                    <button type="button" class="btn bg-gradient-dark"
                            wire:click="updateTransactionLineGroup({{$group->id}})"
                            data-bs-dismiss="modal">
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    </div>
@endforeach
@endif
