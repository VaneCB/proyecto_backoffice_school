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
                            Ficha del
                            profesor {{ $this->teacher->name . ' ' . $this->teacher->surname1 . ' ' . $this->teacher->surname2 }}
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container-fluid py-4">
        <div class="card">
            <div class="card-body pt-4 p-3 mx-6">
                <div class="row">
                    <!-- Columna izquierda -->
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="teacher-name" class="form-control-label">Nombre</label>
                            <div>{{ $this->teacher->name }}</div>
                        </div>

                        <div class="form-group">
                            <label for="teacher-surname2" class="form-control-label">Segundo apellido</label>
                            <div>{{ $this->teacher->surname2 }}</div>
                        </div>

                        <div class="form-group">
                            <label for="teacher-email" class="form-control-label">Email</label>
                            <div>{{ $this->teacher->email }}</div>
                        </div>
                    </div>

                    <!-- Columna derecha -->
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="teacher-surname1" class="form-control-label">Primer apellido</label>
                            <div>{{ $this->teacher->surname1 }}</div>
                        </div>

                        <div class="form-group">
                            <label for="teacher-address" class="form-control-label">Dirección</label>
                            <div>{{ $this->teacher->address }}</div>
                        </div>

                        <div class="form-group">
                            <label for="teacher-phone" class="form-control-label">Teléfono</label>
                            <div>{{ $this->teacher->phone }}</div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="teacher-capabilities" class="form-control-label">Habilidades</label>
                            @foreach($this->teacher->teacherCapabilities as $capability)
                                <div>{{ $capability->capabilityLevel->capability->name }}
                                    - {{ $capability->capabilityLevel->name }}</div>
                            @endforeach
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="personal-files" class="form-control-label">Extraescolares a impartir</label>
                            @foreach($this->teacher->extracurricularActivities as $activity)
                                <div>{{ $activity->name }}</div>
                            @endforeach
                        </div>
                    </div>
                </div>

                <!-- Observaciones (Debajo de ambas columnas) -->
                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label for="teacher-observations" class="form-control-label">Observaciones</label>
                            <div>{{ $this->teacher->observations }}</div>
                        </div>
                    </div>
                </div>

                <!-- Botón de Volver -->
                <div class="modal-footer">
                    <a type="button" href="{{ route('teachers.index') }}"
                       class="btn bg-gradient-secondary btn-md mt-4 mb-4">
                        Volver
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

