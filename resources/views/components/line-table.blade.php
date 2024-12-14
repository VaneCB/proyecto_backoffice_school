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
                Cantidad
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Precio
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Total
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Hora de inicio
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Hora de fin
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Horas
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Nuevos contratos
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Acciones
            </th>
        </tr>

        </thead>
        @foreach($this->transactionLines as $l)
            <tbody>
            <tr>
                <td>
                    <p class="text-xs font-weight-bold mb-0">{{ $l->product->name }}</p>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">{{ $l->description }}</p>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">{{ $l->quantity }}</p>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">{{ $l->price }}</p>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">{{ $l->total }}</p>
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
                    <button type="button"
                            class="btn btn-xs bg-gradient-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteCapabilityModal_{{$l->id}}">
                        <li class="far fa-trash-alt"></li>
                    </button>
                </td>
                <!-- Modal -->
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
                                <h4 class="subh4">{{$l->description}}</h4>
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
            </tr>
            </tbody>
        @endforeach
    </table>
</div>
