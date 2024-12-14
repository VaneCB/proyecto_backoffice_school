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
                @if($this->material->id)
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Editar Material
                            </h5>
                        </div>
                    </div>
                @else
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Crear Material
                            </h5>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
    <div class="container-fluid py-4 ">
        <div class="col-xl-5 col-lg-6 col-md-8 mx-auto ">
            <div class="card z-index-0">
                <div class="card-body pt-2 p-3">
                    <form wire:submit.prevent="save" action="#" method="POST" role="form text-left">
                        <div class="row row justify-content-center">
                            <div class="col-md-10">
                                <div class="form-group">
                                    <label for="material-name" class="form-control-label">Nombre</label>
                                    <div class="@error('material.name')border border-danger rounded-3 @enderror">
                                        <input wire:model="material.name" class="form-control" type="text"
                                               placeholder="Nombre"
                                               id="material-name">
                                    </div>
                                    @error('material.name')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                                <div class="form-group">
                                    <label for="material-stock" class="form-control-label">Stock</label>
                                    <input wire:model="material.stock" class="form-control" type="text"
                                           placeholder="Stock"
                                           id="material-stock">
                                </div>
                                <div class="modal-footer">
                                    <a type="button" href="{{ route('materials.index') }}"
                                       class="btn bg-gradient-secondary btn-md mt-4 mb-4"
                                    >Cancelar
                                    </a>
                                    <button type="submit"
                                            class="btn bg-gradient-dark btn-md mt-4 mb-4">{{ $material->id ? 'Guardar cambios' : 'Crear Material' }}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
