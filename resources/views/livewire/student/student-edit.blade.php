<div>
    <div class="container-fluid">
        <!-- Banner con imagen de fondo y efecto de opacidad -->
        <div class="page-header min-height-100 border-radius-xl mt-4"
             style="background-image: url('../assets/img/curved-images/curved0.jpg'); background-position-y: 50%;">
            <span class="mask bg-gradient-primary opacity-1"></span>
        </div>

        <!-- Card con título dinámico basado en el estado de edición o creación -->
        <div class="card card-body blur shadow-blur mx-3 mt-n6">
            <div class="col-md-6 my-auto">
                <div class="h-100">
                    <h5 class="mb-1">
                        @if($student->id)
                            Editar Alumno {{ $this->student->name . ' ' . $this->student->surname1 . ' ' . $this->student->surname2 }}
                        @else
                            Crear Alumno
                        @endif
                    </h5>
                </div>
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
                                           placeholder="Correo electrónico" value="{{$this->student->email}}"
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
                                <label for="student-parent_name" class="form-control-label">Nombre padre/madre</label>
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
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div x-data="{ opened_tab: null }" class="flex flex-col">
                                <div class="flex flex-col border rounded shadow mb-2">
                                    <div @click="opened_tab = opened_tab == 0 ? null : 0 "
                                         class="p-3 cursor-pointer ">
                                        <h6>- Extraescolares</h6></div>
                                    <div x-show="opened_tab==0" class="px-4 pb-4">
                                        <div class="card-body px-0 pt-0 pb-2">
                                            <div>
                                                <main class="main-content">
                                                    <div class="container-fluid py-4">
                                                        {{-- Tables --}}

                                                    </div>
                                                </main>
                                            </div>
                                            {{-- //////////////////////////////////////////////--}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <a type="button" href="{{ route('student.index') }}"
                           class="btn bg-gradient-secondary btn-md mt-4 mb-4"
                        >Cancelar
                        </a>
                        <button type="submit" id="student-button"
                                class="btn bg-gradient-dark btn-md mt-4 mb-4">{{ $student->id ? 'Guardar cambios' : 'Crear Alumno' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


