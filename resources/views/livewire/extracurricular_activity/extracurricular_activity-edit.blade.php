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
                @if($this->activity->id)
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Editar Actividad extraescolar
                            </h5>
                        </div>
                    </div>
                @else
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Crear Actividad extraescolar
                            </h5>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
    <div class="container-fluid py-4">
        <div class="card">
            <div class="card-body pt-4 p-3">
                <form wire:submit.prevent="save" action="#" method="POST" enctype="multipart/form-data">
                    <div>
                        @if (session()->has('message'))
                            <div class="alert alert-success">
                                {{ session('message') }}
                            </div>
                        @endif
                    </div>

                    <div class="row">
                        <!-- Columna izquierda -->
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="activity-name" class="form-control-label">Nombre</label>
                                <div class="@error('activity.name') border border-danger rounded-3 @enderror">
                                    <input wire:model="activity.name" class="form-control" type="text"
                                           placeholder="Nombre"
                                           id="activity-name">
                                </div>
                                @error('activity.name')
                                <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label for="activity-classes" class="form-control-label">Clases</label>
                                <div class="@error('activity.classes') border border-danger rounded-3 @enderror">
                                    <input wire:model="activity.classes" class="form-control" type="number"
                                           placeholder="Núm de clases"
                                           id="activity-classes">
                                </div>
                                @error('activity.classes')
                                <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label for="activity-teacher_id" class="form-control-label">Profesor</label>
                                <select wire:model="activity.teacher_id" class="form-control"
                                        id="activity-teacher_id">
                                    <option value="">Selecciona un profesor</option>
                                    @foreach($teachers as $teacher)
                                        <option value="{{ $teacher->id }}">{{ $teacher->name }} {{ $teacher->surname1 }} {{ $teacher->surname2 }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="activity-rate_id" class="form-control-label">Tarifa</label>
                                <select wire:model="activity.rate_id" class="form-control"
                                        id="activity-rate_id">
                                    <option value="">Selecciona una tarifa</option>
                                    @foreach($rates as $rate)
                                        <option value="{{ $rate->id }}">{{ $rate->name }} {{ $rate->price }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <!-- Columna derecha -->
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="activity-description" class="form-control-label">Descripción</label>
                                <div class="@error('activity.description') border border-danger rounded-3 @enderror">
                                    <input wire:model="activity.description" class="form-control" type="text"
                                           placeholder="Descripción"
                                           id="activity-description">
                                </div>
                                @error('activity.description')
                                <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label for="activity-course" class="form-control-label">Curso</label>
                                <div class="@error('activity.course') border border-danger rounded-3 @enderror">
                                    <input wire:model="activity.course" class="form-control" type="text"
                                           placeholder="Curso"
                                           id="activity-course">
                                </div>
                                @error('activity.course')
                                <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label for="activity-material_id" class="form-control-label">Material</label>
                                <select wire:model="activity.material_id" class="form-control"
                                        id="activity-material_id">
                                    <option value="">Selecciona un material</option>
                                    @foreach($materials as $material)
                                        <option value="{{ $material->id }}">{{ $material->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <a type="button" href="{{ route('extracurricular_activities.index') }}"
                           class="btn bg-gradient-secondary btn-md mt-4 mb-4">Cancelar</a>
                        <button type="submit" class="btn bg-gradient-dark btn-md mt-4 mb-4">
                            {{ $activity->id ? 'Guardar cambios' : 'Crear Extraescolar' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
