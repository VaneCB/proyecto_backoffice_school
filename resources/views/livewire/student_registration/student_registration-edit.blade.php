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
                <div class="col-auto my-auto">
                    <div class="h-100">
                        <h5 class="mb-1">
                            Inscripción Extraescolares
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid py-4 ">
        <div class="col-xl-5 col-lg-6 col-md-8 mx-auto ">
            <div class="card z-index-0">
                <div class="card-body pt-2 p-3">
                    <form wire:submit.prevent="save" action="#" method="POST" role="form text-left">
                        <div class="row row justify-content-center">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="student-name" class="form-control-label">Nombre</label>
                                    <div class="@error('student.name') border border-danger rounded-3 @enderror">
                                        <input wire:model="student.name" class="form-control" type="text"
                                               placeholder="Nombre" id="student-name" required>
                                    </div>
                                    @error('personal.name')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="student-surname1" class="form-control-label">Primer apellido</label>
                                    <div class="@error('student.surname1') border border-danger rounded-3 @enderror">
                                        <input wire:model="student.surname1" class="form-control" type="text"
                                               placeholder="Primer Apellido" id="student-surname1" required>
                                    </div>
                                    @error('student.surname1')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="student-surname2" class="form-control-label">Segundo apellido</label>
                                    <div class="@error('student.surname2') border border-danger rounded-3 @enderror">
                                        <input wire:model="student.surname2" class="form-control" type="text"
                                               placeholder="Segundo Apellido" id="student-surname2">
                                    </div>
                                    @error('student.surname2')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="student-email" class="form-control-label">Email</label>
                                    <div class="@error('student.email') border border-danger rounded-3 @enderror">
                                        <input wire:model.defer="student.email" class="form-control" type="email"
                                               placeholder="Correo electrónico"
                                               id="student-email" required>
                                    </div>
                                    @error('student.email')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="student-phone" class="form-control-label">Teléfono</label>
                                    <div class="@error('student.phone') border border-danger rounded-3 @enderror">
                                        <input wire:model="student.phone" class="form-control" type="text"
                                               placeholder="Telefono" id="student-phone" required>
                                    </div>
                                    @error('student.phone')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="student-course" class="form-control-label">Curso</label>
                                    <div class="@error('student.course') border border-danger rounded-3 @enderror">
                                        <input wire:model="student.course" class="form-control" type="text"
                                               placeholder="curso escolar" id="student-course" required>
                                    </div>
                                    @error('student.course')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="student-parent_name" class="form-control-label">Nombre
                                        padre/madre</label>
                                    <div class="@error('student.parent_name') border border-danger rounded-3 @enderror">
                                        <input wire:model="student.parent_name" class="form-control" type="text"
                                               placeholder="Nombre progenitor" id="student-parent_name" required>
                                    </div>
                                    @error('student.parent_name')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="student-nif_parent" class="form-control-label">Dni progenitor</label>
                                    <div class="@error('student.nif_parent') border border-danger rounded-3 @enderror">
                                        <input wire:model="student.nif_parent" class="form-control" type="text"
                                               placeholder="Dni" id="student-nif_parent" required>
                                    </div>
                                    @error('student.nif_parent')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="student-address" class="form-control-label">Dirección</label>
                                    <div class="@error('student.address') border border-danger rounded-3 @enderror">
                                        <input wire:model="student.address" class="form-control" type="text"
                                               placeholder="Direccion" id="student-address" required>
                                    </div>
                                    @error('student.address')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                            <!-- Selección de actividades extraescolares -->
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="activity-select" class="form-control-label">Actividades Extraescolares</label>
                                        <div class="d-flex">
                                            <select wire:model="selectedActivity" id="activity-select"
                                                    class="form-control me-2">
                                                <option value="">Seleccione una actividad</option>
                                                @foreach($activities as $activity)
                                                    <option value="{{ $activity->id }}">{{ $activity->name }}</option>
                                                @endforeach
                                            </select>
                                            <button type="button" wire:click="addActivity" class="btn btn-primary">Añadir</button>
                                        </div>
                                        @error('selectedActivity')
                                        <div class="text-danger">{{ $message }}</div>
                                        @enderror
                                    </div>
                                </div>
                            </div>

                            <!-- Lista de actividades seleccionadas -->
                            <div class="row">
                                <div class="col-md-12">
                                    <ul class="list-group">
                                        @foreach($selectedActivities as $activityId)
                                            @php
                                                $activity = $activities->firstWhere('id', $activityId);
                                            @endphp
                                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                                {{ $activity ? $activity->name : 'Actividad no encontrada' }}
                                                <button type="button" wire:click="removeActivity({{ $activityId }})"
                                                        class="btn btn-danger btn-sm">Eliminar</button>
                                            </li>
                                        @endforeach
                                    </ul>
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <button type="submit" class="btn btn-success">Guardar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
