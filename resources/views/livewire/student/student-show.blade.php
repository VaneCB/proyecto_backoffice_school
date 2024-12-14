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
                            Ficha del alumno
                             {{ $this->student->name . ' ' . $this->student->surname1 . ' ' . $this->student->surname2 }}
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
                    <!-- Primera línea: nombre, primer apellido, segundo apellido -->
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-name" class="form-control-label">Nombre</label>
                            <div>{{ $this->student->name }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-surname1" class="form-control-label">Primer apellido</label>
                            <div>{{ $this->student->surname1 }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-surname2" class="form-control-label">Segundo apellido</label>
                            <div>{{ $this->student->surname2 }}</div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <!-- Segunda línea: email, teléfono, curso -->
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-email" class="form-control-label">Email</label>
                            <div>{{ $this->student->email }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-phone" class="form-control-label">Teléfono</label>
                            <div>{{ $this->student->phone }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-course" class="form-control-label">Curso</label>
                            <div>{{ $this->student->course }}</div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <!-- Tercera línea: nombre del padre/madre, DNI progenitor, dirección -->
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-parent_name" class="form-control-label">Nombre del padre/madre</label>
                            <div>{{ $this->student->parent_name }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-nif_parent" class="form-control-label">DNI Progenitor</label>
                            <div>{{ $this->student->nif_parent }}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="student-address" class="form-control-label">Dirección</label>
                            <div>{{ $this->student->address }}</div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div x-data="{ opened_tab: null }" class="flex flex-col">
                            <div class="flex flex-col border rounded shadow mb-2">
                                <div @click="opened_tab = opened_tab == 0 ? null : 0 "
                                     class="p-3 cursor-pointer ">
                                    <h6>-Extraescolares</h6></div>
                                <div x-show="opened_tab==0" class="px-4 pb-4">
                                    <div>
                                        <main class="main-content">
                                            <div class="container-fluid py-4">
                                                {{-- Tables --}}

                                            </div>
                                        </main>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a type="button" href="{{ route('student.index') }}"
                   class="btn bg-gradient-secondary btn-md mt-4 mb-4">
                    Volver
                </a>
            </div>
        </div>
    </div>
</div>


