<div class="row">
    <div class="col-5">
        <label for="capability.name" class="form-control-label">Selecciona Habilidad</label>
        <select class="form-control" wire:model="selectedCapability">
            <option value="0">Selecciona una habilidad</option>
            @foreach($this->capabilities as $capabilityOption)
                    <option value="{{ $capabilityOption->id }}">{{ $capabilityOption->name }}</option>
            @endforeach
        </select>
        @error('selectedCapability')
        <div class="text-danger">{{ $message }}</div>
        @enderror
    </div>
    <div class="col-5">
        <label for="selectedCapabilityLevel" class="form-control-label">Nivel</label>
        <select class="form-control" wire:model="selectedCapabilityLevel">
            <option value="0">Selecciona un nivel</option>
            @foreach($this->getLevelForSelectedCapability() as $capability)
                <option value="{{ $capability->id }}">{{ $capability->name }}</option>
            @endforeach
        </select>
    </div>
    <div class="col-2 p-2 align-content-lg-end">
        <br>
        <button type="button" class="btn bg-gradient-secondary"
                data-bs-toggle="tooltip" data-bs-placement="right" id="addCapabilityButton"
                wire:click="addCapability">
            + Añadir habilidad
        </button>
    </div>
</div>
