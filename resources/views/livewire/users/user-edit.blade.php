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
                        <img src="{{ $this->user->photo ? asset('storage/' . $this->user->photo) : asset('assets/img/bruce-mars.jpg') }}"
                             alt="User Photo" class="w-150 border-radius-lg shadow-sm">
                        <div class="@error('photo') border border-danger rounded-3 @enderror">
                            <label for="photo" class="btn btn-sm btn-icon-only bg-gradient-light position-absolute bottom-0 end-0 mb-n2 me-n2 fa fa-pen">
                            </label>
                            <input type="file" id="photo" style="display: none;" wire:model="photo">
                        </div>
                    </div>
                </div>
                @if($this->user->id)
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Editar usuario
                            </h5>
                        </div>
                    </div>
                @else
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Crear usuario
                            </h5>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
    <div class="container-fluid py-4">
        <div class="card">
            <div class="card-header pb-0 px-3">
                <h6 class="mb-0">{{ __('Información del usuario') }}</h6>
            </div>
            <div class="card-body pt-4 p-3">
                <form wire:submit.prevent="save" action="#" method="POST" role="form text-left">
                    @method('PUT')
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="user-name" class="form-control-label">Nombre de usuario</label>
                                <div class="@error('user.name')border border-danger rounded-3 @enderror">
                                    <input wire:model="user.name" class="form-control" type="text" placeholder="Name"
                                        id="user-name">
                                </div>
                                @error('user.name') <div class="text-danger">{{ $message }}</div> @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="user-email" class="form-control-label">Email</label>
                                <div class="@error('user.email')border border-danger rounded-3 @enderror">
                                    <input wire:model="user.email" class="form-control" type="email"
                                        placeholder="@example.com" id="user-email">
                                </div>
                                @error('user.email') <div class="text-danger">{{ $message }}</div> @enderror
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="user.phone" class="form-control-label">{{ __('Cambio de contraseña') }}</label>
                                <div class="@error('user.password')border border-danger rounded-3 @enderror">
                                    <input wire:model.defer="new_password" class="form-control" placeholder="***************"
                                           type="password" name="password"
                                           autocomplete="new-password">
                                </div>
                                <strong class="error">{{ $this->error }}</strong>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="user.phone" class="form-control-label">{{ __('Confirma contraseña') }}</label>
                                <div >
                                    <input wire:model.defer="confirm_password" class="form-control"
                                           placeholder="***************" type="password" name="confirm_password">
                                </div>
                            </div>
                        </div>

                    </div>
                     <div class="modal-footer">
                        <a type="button" href="{{ route('users.index') }}"
                           class="btn bg-gradient-secondary btn-md mt-4 mb-4"
                        >Cancelar
                        </a>
                         <button type="submit" class="btn bg-gradient-dark btn-md mt-4 mb-4">{{ $user->id ? 'Guardar cambios' : 'Crear Usuario' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
