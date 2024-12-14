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
                            Detalles de la tarifa {{ $this->rate->name }}
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
                    <div class="col-md-6">
                        <label for="rate-price" class="form-control-label">Precio</label>
                        <div>{{ $this->rate->price}}</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a type="button" href="{{ route('rates.index') }}"
                       class="btn bg-gradient-secondary btn-md mt-4 mb-4">
                        Volver
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

