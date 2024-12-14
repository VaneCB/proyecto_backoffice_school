<div class="row">
    <div class="col-2">
        <label for="capability.name" class="form-control-label">Habilidad</label>
        <select class="form-control" wire:model="selectedCapability">
            <option value="0">Selecciona una habilidad</option>
            @foreach($this->capabilities as $capabilityOption)
                    <option value="{{ $capabilityOption->id }}">{{ $capabilityOption->name }}</option>
            @endforeach
        </select>
        @error('selectedCapability')
        <div class="text-danger">{{ $message }}</div>
        @enderror
    </div>
    <div class="col-2">
        <label for="selectedCapabilityId" class="form-control-label">Nivel</label>
        <select class="form-control" wire:model="selectedCapabilityId">
            <option value="0">Selecciona un nivel</option>
            @foreach($this->getLevelForSelectedCapability() as $capability)
                <option value="{{ $capability->id }}">{{ $capability->name }}</option>
            @endforeach
        </select>
    </div>
    <div class="col-4 p-2 align-content-lg-end">
        <br>
        <button type="button" class="btn bg-gradient-secondary"
                data-bs-toggle="tooltip" data-bs-placement="right" id="newCapabilityButton"
                wire:click="newCapability">
            + Añadir habilidad
        </button>
    </div>
    {{-- EN CASO DE QUERER CREAR UN NUEVA HABILIDAD--}}
    <div class="col-4">
        <br>
        <button type="button" class="btn bg-gradient-dark"
                data-bs-toggle="modal" data-bs-target="#CapabilityModal">
            + Crear nueva habilidad
        </button>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="CapabilityModal" tabindex="-1"
         role="dialog" aria-labelledby="capabilityModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered"
             role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="capabilityModalLabel">
                        Añadir habilidad</h5>
                    <button type="button" class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="capability-name"
                                       class="form-control-label">Habilidad</label>
                                <div class="input-group mb-3"
                                     wire:ignore.self>
                                    <input type="text"
                                           class="form-control"
                                           wire:model.defer="capability.name"
                                           placeholder="Nombre"
                                           aria-label="Recipient's username"
                                           aria-describedby="button-addon2">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="capability-capability_type_id" class="form-control-label">Tipo</label>
                                <select class="form-control" wire:model.defer="capability.capability_type_id">
                                    <option value="0">Selecciona el tipo</option>
                                    @foreach($this->capabilityTypes as $types)
                                        <option value="{{ $types->id }}">{{ $types->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="levelCapability-name"
                                       class="form-control-label">Nivel</label>
                                <div class="input-group mb-3"
                                     wire:ignore.self>
                                    <input type="text"
                                           class="form-control"
                                           wire:model.defer="levelCapability.name"
                                           placeholder="Nombre"
                                           aria-label="Recipient's username"
                                           aria-describedby="button-addon2">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button"
                            class="btn bg-gradient-secondary"
                            data-bs-dismiss="modal">Cancelar
                    </button>
                    <button type="button"
                            class="btn bg-gradient-dark"
                            wire:click="addCapability"
                            data-bs-dismiss="modal">Añadir
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="table-responsive p-0">
    <table class="table align-items-center mb-0">
        <thead>
        <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                Habilidad
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Nivel
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Acción
            </th>
        </tr>

        </thead>
        @foreach($this->teacher->teacherCapabilities as $l)
                <tbody>
                <tr>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->capabilityLevel->capability->name }}</p>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">{{ $l->capabilityLevel->name }}</p>
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
                    <div class="modal fade" id="deleteCapabilityModal_{{$l->id}}"
                         tabindex="-1" role="dialog"
                         aria-labelledby="deleteCapabilityModalLabel"
                         aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered"
                             role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title"
                                        id="capabilityModalLabel">
                                        Eliminar Habilidad</h5>
                                    <button type="button"
                                            class="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <p>¿Está seguro que quiere
                                        eliminar?</p>
                                    <br>
                                    <h4 class="subh4">{{$l->capabilityLevel->capability->name}}
                                        - {{$l->capabilityLevel->name}}</h4>
                                </div>
                                <div class="modal-footer">
                                    <button type="button"
                                            class="btn bg-gradient-secondary"
                                            data-bs-dismiss="modal">
                                        Cancelar
                                    </button>
                                    <a type="button"
                                       wire:click="deleteCapability({{$l->id}})"
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
