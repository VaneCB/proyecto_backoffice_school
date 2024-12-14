<div>
    <div class="container-fluid">
        <div class="page-header min-height-300 border-radius-xl mt-4"
             style="background-image: url('../assets/img/curved-images/curved0.jpg'); background-position-y: 50%;">
            <span class="mask bg-gradient-primary opacity-6"></span>
        </div>
        <div class="card card-body blur shadow-blur mx-4 mt-n6">
            <div class="row gx-4">
                <div class="col-auto">
                    <div class="avatar avatar-xl position-relative">
                        <img src="../assets/img/bruce-mars.jpg" alt="..." class="w-100 border-radius-lg shadow-sm">
                        <a href="javascript:;"
                           class="btn btn-sm btn-icon-only bg-gradient-light position-absolute bottom-0 end-0 mb-n2 me-n2">
                            <i class="fa fa-pen top-0" data-bs-toggle="tooltip" data-bs-placement="top"
                               title="Edit Image"></i>
                        </a>
                    </div>
                </div>
                <div class="col-auto my-auto">
                    <div class="h-100">
                        <h5 class="mb-1">
                            Crear nuevo usuario
                        </h5>
                        {{--  <p class="mb-0 font-weight-bold text-sm">
                              {{ __(' CEO / Co-Founder') }}
                          </p>--}}
                    </div>
                </div>
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
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="user-name" class="form-control-label"></label>
                                <div class="@error('name')border border-danger rounded-3 @enderror">
                                    <input wire:model="name" class="form-control" type="text" placeholder="Nombre"
                                           id="user-name">
                                </div>
                                @error('name') <div class="text-danger">{{ $message }}</div> @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="user-email" class="form-control-label"></label>
                                <div class="@error('email')border border-danger rounded-3 @enderror">
                                    <input wire:model="email" class="form-control" type="email"
                                           placeholder="@ejemplo.com" id="user-email">
                                </div>
                                @error('email') <div class="text-danger">{{ $message }}</div> @enderror
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
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn bg-gradient-dark btn-md mt-4 mb-4">{{ 'Guardar cambios' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
