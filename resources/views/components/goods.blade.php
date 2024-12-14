<div class="row">
    @foreach($this->personal->personalGoods as $personalGood)
        <div class="col-md-3">
            <div class="form-group">
                <label for="personal-uniform" class="form-control-label">Material</label>
                <div>{{ $personalGood->items->material->name }}</div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="form-group">
                <label for="personal-size" class="form-control-label">Talla</label>
                <div>{{ $personalGood->items->size }}</div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="form-group">
                <label for="personal-stock" class="form-control-label">Stock</label>
                <div>{{ $personalGood->stock }}</div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-group">
                <label for="personal-stock" class="form-control-label">Evento</label>
                <div>{{ $personalGood->event->name ?? '' }}</div>
            </div>
        </div>
        <div class="col-md-2">
            <button type="button"
                    class="btn btn-link text-dark text-gradient px-3 mb-0"
                    data-bs-toggle="modal"
                    title="Devolver al almacen"
                    wire:click="returnGood({{ $personalGood->id }})">
                <i class="fa fa-building-o"></i>
            </button>
        </div>
    @endforeach
</div>



