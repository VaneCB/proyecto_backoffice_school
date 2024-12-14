<div class>
    <br>
    <button wire:click="clearTransactionLine" type="button" class="btn bg-gradient-dark"
            data-bs-toggle="modal" data-bs-target="#transactionLinesModal">
        + Crear nueva linea
    </button>
    <button type="button" class="btn bg-gradient-dark"
            data-bs-toggle="modal" data-bs-target="#transactionLinesGroupsModal">
        + Crear nuevo grupo de lineas
    </button>
</div>
<!-- Modal -->
<div wire:ignore.self class="modal fade" id="transactionLinesModal" tabindex="-1"
     role="dialog" aria-labelledby="transactionLinesModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered"
         role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="transactionLinesModalLabel">
                    Añadir Linea</h5>
                <button type="button" class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label for="transactionLines-line_group" class="form-control-label">Grupo de linea</label>
                            <select wire:model.defer="lineGroup" class="form-control"
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
                            <select wire:model="selectedProductVariation" class="form-control"
                                    id="transactionLines-product_id">
                                <option value="">Selecciona el producto</option>
                                @foreach($productVariations as $productVariation)
                                    <option value="{{ $productVariation->id }}">{{ $productVariation->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="transactionLines-quantity"
                                   class="form-control-label">Cantidad</label>
                            <input wire:model="transactionLine.quantity" class="form-control" type="text"
                                   placeholder="cantidad" id="transactionLines-quantity">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="transactionLines-new_contracts" class="form-control-label">Nuevos
                                contratos</label>
                            <input wire:model="transactionLine.new_contracts" class="form-control" type="text"
                                   placeholder="Contratos"
                                   id="transactionLines-new_contracts">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="transactionLines-new_contracts_price" class="form-control-label">€/contrato</label>
                            <input value="{{$this->getPriceContracts() ?? 0}}" class="form-control" type="text"
                                   placeholder="Contratos"
                                   id="transactionLines-new_contracts_price" disabled>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label for="transactionLines-description"
                                   class="form-control-label">Descripción</label>
                            <input wire:model.defer="transactionLine.description" class="form-control" type="text"
                                   placeholder="descripción" id="transaction-description">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="transactionLines-start_time" class="form-control-label">Hora de
                                inicio</label>
                            <input wire:model="transactionLine.start_time" class="form-control" type="time"
                                   placeholder="hora de inicio"
                                   id="transactionLines-start_time">
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="transactionLines-end_time" class="form-control-label">Hora de
                                fin</label>
                            <input wire:model="transactionLine.end_time" class="form-control" type="time"
                                   placeholder="hora de fin"
                                   id="transactionLines-end_time">
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="transactionLines-total" class="form-control-label">Total hora</label>
                            <input value="{{ $this->calculateTotalHours() }}" class="form-control" type="text"
                                   placeholder="Horas" id="transactionLines-total_time" readonly>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="transactionLines-price" class="form-control-label">€/H</label>
                            <input value="{{ $this->getPriceForSelectedProductVariation() }}" class="form-control"
                                   type="text"
                                   placeholder="Precio por hora"
                                   id="transactionLines-price" readonly>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="transactionLines-total" class="form-control-label">Total</label>
                            <input value="{{ $this->totalLines() }}" class="form-control" type="text"
                                   placeholder="Total" id="transactionLines-total" readonly>
                        </div>
                    </div>

                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn bg-gradient-secondary"
                        data-bs-dismiss="modal"
                        wire:click="$refresh">Cancelar
                </button>
                <button wire:click="createLines" type="button"
                        class="btn bg-gradient-dark"
                        data-bs-dismiss="modal">Guardar
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Modal transactionLinesGroupsModal -->
<div class="modal fade" id="transactionLinesGroupsModal" tabindex="-1"
     role="dialog" aria-labelledby="transactionLinesGroupsModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered"
         role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="transactionLinesGroupsModalLabel">
                    Añadir grupo de lineas</h5>
                <button type="button" class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label for="transactionLinesGroups-title"
                                   class="form-control-label">Titulo</label>
                            <input wire:model.defer="lineGroup.title" class="form-control" type="text"
                                   placeholder="titulo" id="transactionLinesGroups-title">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label for="transactionLinesGroups-subtitle"
                                   class="form-control-label">Subtitulo</label>
                            <input wire:model.defer="lineGroup.subtitle" class="form-control" type="text"
                                   placeholder="subtitulo" id="transactionLinesGroups-subtitle">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn bg-gradient-secondary"
                        data-bs-dismiss="modal">Cerrar
                </button>
                <button wire:click="createLinesGroups" type="button"
                        class="btn bg-gradient-dark"
                        data-bs-dismiss="modal">Guardar
                </button>
            </div>
        </div>
    </div>
</div>


@if($this->order->id)
    @include('components.lineOrder')
@endif
