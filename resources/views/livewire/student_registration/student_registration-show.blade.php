<div>
    <div class="container-fluid">
        <div class="page-header min-height-100 border-radius-xl mt-4"
             style="background-image: url('../assets/img/curved-images/curved0.jpg'); background-position-y: 50%;">
            <span class="mask bg-gradient-primary opacity-1"></span>
        </div>
        <div class="card card-body blur shadow-blur mx-3 mt-n6">
            <div class="row gx-4">
                <div class="col-md-6 my-auto">
                    <div class="h-100">
                        <h5 class="mb-1">
                            Inscripción de {{ $this->student->name }} {{ $this->student->surname1 }} {{ $this->student->surname2 ? $this->student->surname2 : '' }}
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid py-4">
        <div class="card">
            <div class="card-body pt-4 p-3">
                <form wire:submit.prevent="updateStatus">
                    <div class="row">
                        <!-- Nombre -->
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="student-name" class="form-control-label">Nombre</label>
                                <input class="form-control" type="text" id="student-name"
                                       value="{{ $registration->student->name ?? 'No disponible' }}" disabled>
                            </div>
                        </div>
                        <!-- Primer apellido -->
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="student-surname1" class="form-control-label">Primer apellido</label>
                                <input class="form-control" type="text" id="student-surname1"
                                       value="{{ $registration->student->surname1 ?? 'No disponible' }}" disabled>
                            </div>
                        </div>
                        <!-- Segundo apellido -->
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="student-surname2" class="form-control-label">Segundo apellido</label>
                                <input class="form-control" type="text" id="student-surname2"
                                       value="{{ $registration->student->surname2 ?? 'No disponible' }}" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="student-email" class="form-control-label">Email</label>
                                <input class="form-control" type="email" id="student-email"
                                       value="{{ $registration->student->email ?? 'No disponible' }}" disabled>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="student-phone" class="form-control-label">Teléfono</label>
                                <input class="form-control" type="text" id="student-phone"
                                       value="{{ $registration->student->phone ?? 'No disponible' }}" disabled>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="student-course" class="form-control-label">Curso</label>
                                <input class="form-control" type="text" id="student-course"
                                       value="{{ $registration->student->course ?? 'No disponible' }}" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="student-parent_name" class="form-control-label">Nombre padre/madre</label>
                                <input class="form-control" type="text" id="student-parent_name"
                                       value="{{ $registration->student->parent_name ?? 'No disponible' }}" disabled>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="student-nif_parent" class="form-control-label">DNI progenitor</label>
                                <input class="form-control" type="text" id="student-nif_parent"
                                       value="{{ $registration->student->nif_parent ?? 'No disponible' }}" disabled>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="student-address" class="form-control-label">Dirección</label>
                                <input class="form-control" type="text" id="student-address"
                                       value="{{ $registration->student->address ?? 'No disponible' }}" disabled>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <label class="form-control-label">Extraescolar</label>
                                <input class="form-control" type="text" id="student-address"
                                       value="{{ $registration->extracurricular_activity->name ?? 'No disponible' }}" disabled>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>


    <div class="text-center mt-4">
        @if ($registration->status == 0)
            <!-- Botones para aceptar o cancelar si el estado es 0 -->
            <button type="button" wire:click="accept" class="btn bg-gradient-dark">
                Aceptar
            </button>
            <button type="button" wire:click="cancel" class="btn bg-gradient-secondary">
                Cancelar
            </button>
        @else
            <!-- Botón para regresar al índice si el estado no es 0 -->
            <button type="button" wire:click="$emit('redirectToIndex')" class="btn bg-gradient-secondary">
                Volver
            </button>
        @endif
    </div>
</div>
