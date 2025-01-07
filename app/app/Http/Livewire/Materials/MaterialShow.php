<?php

namespace App\Http\Livewire\Materials;

use App\Models\Material;
use App\Models\MaterialItem;
use App\Models\Language;
use App\Models\Study;
use Illuminate\Support\Facades\Log;
use Livewire\Component;

class MaterialShow extends Component
{
    public $material;
    public $isOpen = false;

    public function mount($id)
    {
        $this->material = Material::find($id);

    }

    protected function show($id)
    {
        $this->material = Material::find($id);

    }
    public function render()
    {
        return view('livewire.material.material-show', [
            'material' => $this->material, 'open' => $this->isOpen,
        ]);
    }
}
