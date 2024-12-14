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
                @if($this->rate->id)
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Editar Tarifa
                            </h5>
                        </div>
                    </div>
                @else
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                Crear Tarifa
                            </h5>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
    <div class="container-fluid py-4 ">
        <div class="col-xl-7 col-lg-8 col-md-10 mx-auto ">
            <div class="card z-index-0">
                <div class="card-body pt-2 p-3">
                    <form wire:submit.prevent="save" action="#" method="POST" role="form text-left">
                        <div class="row row justify-content-center">
                            <div class="col-md-10">
                                <div class="form-group">
                                    <label for="rate-name" class="form-control-label">Nombre</label>
                                    <div class="@error('rate.name')border border-danger rounded-3 @enderror">
                                        <input wire:model="rate.name" class="form-control" type="text"
                                               placeholder="Nombre"
                                               id="rate-name">
                                    </div>
                                    @error('rate.name')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-10">
                                <div class="form-group">
                                    <label for="rate-price" class="form-control-label">Precio</label>
                                    <div class="@error('rate.price')border border-danger rounded-3 @enderror">
                                        <input wire:model="rate.price" class="form-control" type="text"
                                               placeholder="Precio" id="rate-discount">
                                    </div>
                                    @error('rate.price')
                                    <div class="text-danger">{{ $message }}</div> @enderror
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <a type="button" href="{{ route('rates.index') }}"
                               class="btn bg-gradient-secondary btn-md mt-4 mb-4"
                            >Cancelar
                            </a>
                            <button type="submit"
                                    class="btn bg-gradient-dark btn-md mt-4 mb-4">{{ $rate->id ? 'Guardar cambios' : 'Crear Tarifa' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
