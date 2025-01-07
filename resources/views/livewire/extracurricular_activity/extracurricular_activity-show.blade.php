<div>
    <div class="container-fluid">
        <div class="page-header min-height-100 border-radius-xl mt-4"
             style="background-image: url('../assets/img/curved-images/curved0.jpg'); background-position-y: 50%;">
            <span class="mask bg-gradient-primary opacity-1"></span>
        </div>
        <div class="card card-body blur shadow-blur mx-3 mt-n6">
            <div class="col-md-6 my-auto">
                <div class="h-100">
                    <h5 class="mb-1">
                        Ficha {{ $this->activity->name }}
                    </h5>
                </div>
            </div>
        </div>
    </div>

    <div class="container-fluid py-4">
        <div class="card">
            <div class="card-body pt-4 p-3 mx-6">
                <!-- Fila 1: Nombre, Clases, Profesor -->
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-name" class="form-control-label">Nombre</label>
                            <div>{{ $this->activity->name }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-surname1" class="form-control-label">Clases</label>
                            <div>{{ $this->activity->classes }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-surname2" class="form-control-label">Profesor</label>
                            <div>{{ $this->activity->teacher->name ?? 'Sin profesor asignado' }}</div>
                        </div>
                    </div>
                </div>

                <!-- Fila 2: Descripción, Curso, Material -->
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-surname1" class="form-control-label">Descripción</label>
                            <div>{{ $this->activity->description }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-email" class="form-control-label">Curso</label>
                            <div>{{ $this->activity->course }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-phone" class="form-control-label">Material</label>
                            <div>
                                {{ $this->activity->material->name ?? 'No hay materiales asignados' }}
                                @if($this->activity->material)
                                    <!-- Icono para devolver el material -->
                                    <button wire:click="returnMaterial" class="btn btn-link" title="Devolver material">
                                        <i class="fas fa-undo"></i>
                                    </button>
                                @endif
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-phone" class="form-control-label">Tarifa</label>
                            <div>{{ $this->activity->rate->name ?? 'No hay tarifa asignada' }}</div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div x-data="{ opened_tab: null }" class="flex flex-col">
                            <div class="flex flex-col border rounded shadow mb-2">
                                <div @click="opened_tab = opened_tab == 0 ? null : 0"
                                     class="p-3 cursor-pointer">
                                    <h6>- Alumnos</h6>
                                </div>
                                <div x-show="opened_tab==0" class="px-4 pb-4">
                                    <div class="card-body px-0 pt-0 pb-2">
                                        <div>
                                            <main class="main-content">
                                                <div class="container-fluid py-4">
                                                    <!-- Include Students Table -->
                                                    @include('components.students')
                                                </div>
                                            </main>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <a href="{{ route('extracurricular_activities.index') }}"
                   class="btn bg-gradient-secondary btn-md mt-4 mb-4">
                    Volver
                </a>
            </div>
        </div>
    </div>
</div>




