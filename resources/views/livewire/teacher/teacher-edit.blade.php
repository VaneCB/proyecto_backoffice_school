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
                @if($this->teacher->id)
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Editar profesor
                            </h5>
                        </div>
                    </div>
                @else
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Crear profesor
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
                    <div class="row">
                        <!-- Columna izquierda -->
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="teacher-name" class="form-control-label">Nombre</label>
                                <div class="@error('teacher.name') border border-danger rounded-3 @enderror">
                                    <input wire:model="teacher.name" class="form-control" type="text" placeholder="Nombre" id="teacher-name">
                                </div>
                                @error('teacher.name')
                                <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label for="teacher-surname2" class="form-control-label">Segundo apellido</label>
                                <div class="@error('teacher.surname2') border border-danger rounded-3 @enderror">
                                    <input wire:model="teacher.surname2" class="form-control" type="text" placeholder="Segundo apellido" id="teacher-surname2">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="teacher-email" class="form-control-label">Email</label>
                                <div class="@error('teacher.email') border border-danger rounded-3 @enderror">
                                    <input wire:model="teacher.email" class="form-control" type="text" placeholder="Correo electrónico" id="teacher-email">
                                </div>
                                @error('teacher.email')
                                <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <!-- Columna derecha -->
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="teacher-surname1" class="form-control-label">Primer apellido</label>
                                <div class="@error('teacher.surname1') border border-danger rounded-3 @enderror">
                                    <input wire:model="teacher.surname1" class="form-control" type="text" placeholder="Primer apellido" id="teacher-surname1">
                                </div>
                                @error('teacher.surname1')
                                <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label for="teacher-address" class="form-control-label">Dirección</label>
                                <div class="@error('teacher.address') border border-danger rounded-3 @enderror">
                                    <input wire:model="teacher.address" class="form-control" type="text" placeholder="Dirección" id="teacher-address">
                                </div>
                                @error('teacher.address')
                                <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="form-group">
                                <label for="teacher-phone" class="form-control-label">Teléfono</label>
                                <div class="@error('teacher.phone') border border-danger rounded-3 @enderror">
                                    <input wire:model="teacher.phone" class="form-control" type="text" placeholder="Teléfono" id="teacher-phone">
                                </div>
                                @error('teacher.phone')
                                <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                    <!-- Observaciones (Debajo de ambas columnas) -->
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="teacher-observations" class="form-control-label">Observaciones</label>
                                <div class="@error('teacher.observations') border border-danger rounded-3 @enderror">
                                    <textarea wire:model="teacher.observations" class="form-control" rows="3" placeholder="Observaciones" id="teacher-observations"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                        @if($this->teacher->id)
                    <div class="row">
                        <div class="col-md-12">
                            <div x-data="{ opened_tab: null }" class="flex flex-col">
                                <div class="flex flex-col border rounded shadow mb-2">
                                    <div @click="opened_tab = opened_tab == 0 ? null : 0 "
                                         class="p-3 cursor-pointer ">
                                        <h6>- Habilidades</h6></div>
                                    <div x-show="opened_tab==0" class="px-4 pb-4">
                                        <div class="card-body px-0 pt-0 pb-2">
                                            <div>
                                                <main class="main-content">
                                                    <div class="container-fluid py-4">
                                                        {{-- Tables --}}
                                                        @include('components.capabilities')
                                                    </div>
                                                </main>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        @endif
                    <!-- Botones -->
                    <div class="modal-footer">
                        <a type="button" href="{{ route('teachers.index') }}" class="btn bg-gradient-secondary btn-md mt-4 mb-4">Cancelar</a>
                        <button type="submit" class="btn bg-gradient-dark btn-md mt-4 mb-4">{{ $teacher->id ? 'Guardar cambios' : 'Crear profesor' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
