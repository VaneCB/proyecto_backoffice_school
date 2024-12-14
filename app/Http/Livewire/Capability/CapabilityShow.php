<?php

namespace App\Http\Livewire\Capability;


use App\Models\Capability;
use Livewire\Component;

class CapabilityShow extends Component
{
    public $capability;
    public $isOpen = false;

    public function mount($id)
    {
        $this->capability = Capability::find($id);

    }

    protected function show($id)
    {
        $this->capability = Capability::find($id);

    }
    public function render()
    {
        return view('livewire.capability.capability-show', [
            'capability' => $this->capability, 'open' => $this->isOpen,
        ]);
    }
}
