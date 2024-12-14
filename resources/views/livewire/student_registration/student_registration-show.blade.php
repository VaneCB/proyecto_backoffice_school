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
                            Detalles del almacen

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
                    <div class="col-md-12">
                        <div class="form-group">
                            <label for="uniform-name" class="form-control-label">Nombre del almacen</label>
                            <div>{{ $this->warehouse->name }}</div>
                        </div>
                        <div class="form-group">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Talla</th>
                                    <th>Color</th>
                                    <th>Stock</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($this->warehouse->warehouseLines as $line)
                                    @if($line->warehouse_id == $this->warehouse->id && $line->warehouseable_type == 'App\Models\MaterialItem')
                                        <tr>
                                            <td>{{ $line->warehouseable->material->name }}</td>
                                            <td>{{ $line->warehouseable->size }}</td>
                                            <td>{{ $line->warehouseable->color }}</td>
                                            <td>{{ $line->stock }} unidades</td>
                                        </tr>
                                    @endif
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <a type="button" href="{{ route('warehouses.index') }}"
                           class="btn bg-gradient-secondary btn-md mt-4 mb-4">
                            Volver
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
