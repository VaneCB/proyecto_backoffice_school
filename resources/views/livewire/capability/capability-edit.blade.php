<div>
    <div class="container-fluid">
        <div class="page-header min-height-100 border-radius-xl mt-4"
             style="background-image: url('../assets/img/curved-images/curved0.jpg'); background-position-y: 50%;">
            <span class="mask bg-gradient-primary opacity-1"></span>
        </div>
        <div class="card card-body blur shadow-blur mx-4 mt-n6">
            <div class="row gx-4">
                <div class="col-auto">
                    <div class="avatar avatar-xl position-relative">

                    </div>
                </div>
                @if($this->capability->id)
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Editar Habilidad
                            </h5>
                        </div>
                    </div>
                @else
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Crear Habilidad
                            </h5>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
    <div class="container-fluid py-4 ">
        <div class="col-xl-5 col-lg-6 col-md-8 mx-auto ">
            <div class="card z-index-0">
                <div class="card-body pt-2 p-3">
                    <form wire:submit.prevent="save" action="#" method="POST" role="form text-left">
                        <div class="row row justify-content-center">
                            <div class="col-md-10">
                                <div class="form-group">
                                    <label for="capability-name" class="form-control-label">Nombre</label>
                                    <div class="@error('capability.name')border border-danger rounded-3 @enderror">
                                        <input wire:model="capability.name" class="form-control" type="text"
                                               placeholder="Nombre"
                                               id="capability.name">
                                    </div>
                                    @error('capability.name')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                            <div class="col-md-10">
                                <div class="form-group">
                                    <label for="capability-capability_type_id" class="form-control-label">Tipo</label>
                                    <select class="form-control" wire:model="capability.capability_type_id">
                                        <option value="0">Selecciona el tipo</option>
                                        @foreach($this->capabilityTypes as $types)
                                            <option value="{{ $types->id }}">{{ $types->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            @if(!$this->capability->id)
                                <div class="col-md-10">
                                    <div class="form-group">
                                        <label for="capability_levels-name" class="form-control-label">Nivel</label>
                                        <input wire:model="levelCapability.name" class="form-control" type="text"
                                               placeholder="Nivel"
                                               id="capability_levels-name">
                                    </div>
                                </div>
                            @endif
                        </div>

                        <div class="d-flex justify-content-center align-items-center">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead>
                                    <tr>
                                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                            Nivel
                                        </th>
                                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                                            Acciones
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($this->capability->capabilityLevels as $level)
                                        <tr>
                                            <td>
                                                <p class="text-xs font-weight-bold mb-0">{{ $level->name }}</p>
                                            </td>
                                            <td>
                                                <button type="button"
                                                        class="btn btn-link text-dark text-gradient px-3 mb-0"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editCapabilityLevelsModal_{{$level->id}}">
                                                    <i class="far fa-edit"></i>
                                                </button>
                                                <button type="button"
                                                        class="btn btn-link text-dark text-gradient px-3 mb-0"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#deleteCapabilityLevelsModal_{{$level->id}}">
                                                    <i class="far fa-trash-alt me"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <a type="button" href="{{ route('capabilities.index') }}"
                               class="btn bg-gradient-secondary btn-md mt-4 mb-4"
                            >Cancelar
                            </a>
                            <button type="submit"
                                    class="btn bg-gradient-dark btn-md mt-4 mb-4">{{ $capability->id ? 'Guardar cambios' : 'Crear habilidad' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Modal deleteCapabilityLevelsModal -->
        @foreach($this->capability->capabilityLevels as $level)
            <div class="modal fade" id="deleteCapabilityLevelsModal_{{$level->id}}"
                 tabindex="-1" role="dialog"
                 aria-labelledby="deleteCapabilityLevelModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered"
                     role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"
                                id="capabilityLevelModalLabel">
                                Eliminar nivel</h5>
                            <button type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>¿Seguro que quieres borrar el nivel?</p>
                            <br>
                            <h4 class="subh4">{{$level->name}}
                            </h4>
                        </div>
                        <div class="modal-footer">
                            <button type="button"
                                    class="btn bg-gradient-secondary"
                                    data-bs-dismiss="modal"
                                    wire:click="$refresh">
                                Cancelar
                            </button>
                            <a type="button"
                               wire:click="deleteCapabilityLevel({{$level->id}})"
                               class="btn bg-gradient-dark"
                               data-bs-dismiss="modal">Eliminar</a>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach

        <!-- Modal editCapabilityLevelsModal -->
        @foreach($this->capability->capabilityLevels as $level)
            <div class="modal fade" id="editCapabilityLevelsModal_{{$level->id}}" tabindex="-1"
                 aria-labelledby="editCapabilityLevelsModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-center" id="editCapabilityLevelsModalLabel">
                                Editar Habilidad {{$this->capability->name}}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group ">
                                <label for="capability_levels-name" class="form-control-label">Nivel</label>
                                <input wire:model.defer="currentLevel.{{$level->id}}.name" class="form-control" type="text"
                                       placeholder="Nivel"
                                       id="capability_levels-name">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button"
                                    class="btn bg-gradient-secondary"
                                    data-bs-dismiss="modal"
                                    >
                                Cancelar
                            </button>
                            <button type="button"
                                    class="btn bg-gradient-dark"
                                    wire:click="editCapabilityLevel({{ $level->id}})"
                                    data-bs-dismiss="modal">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
