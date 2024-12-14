<?php

namespace App\Http\Livewire\Capability;

use App\Models\Capability;
use App\Models\CapabilityType;
use App\Models\CapabilityLevel;
use Livewire\Component;
use stdClass;

class CapabilityEdit extends Component
{
    public $error = '';
    public $capabilities;

    public $capability;
    public $capabilityTypes;
    public $levelCapability;

    public $currentLevel;

    protected $listeners = ['updateLevels'];

    protected $rules = [
        'capability.name' => 'required',
        'capability.capability_type_id' => 'required',

    ];

    protected function messages()
    {
        return [
            'capability.name.required' => 'El nombre de la habilidad es requerido',
            'capability.capability_type_id.required' => 'El tipo de habilidad es requerido',
        ];
    }

    public function updateLevels()
    {
        $this->capability = Capability::find($this->capability->id);
    }
    public function mount()
    {
        $this->capabilities = Capability::all();
        $this->capabilityTypes = CapabilityType::all();
        $this->capability = Capability::find(request()->id);
        if (request()->id != null) {
            $this->capability = Capability::find(request()->id);
            if ($this->capability) {
                $this->currentLevel = [];
                foreach ($this->capability->capabilityLevels as $level) {
                    $this->currentLevel[$level->id]['name'] = $level->name;
                }
            }

        } else {
            $this->capability = new Capability();
        }
    }

    public function save()
    {
        $this->validate();

        if ($this->capability->id) {
            $this->capability->update();
        } else {
            $existingCapability = Capability::where([
                'name' => $this->capability->name,
                'capability_type_id' => $this->capability->capability_type_id,
            ])->first();
            if ($existingCapability) {
                $this->capability = $existingCapability;
                $this->error = 'Ya existe esa habilidad';
            } else {
                $this->capability = Capability::create([
                    'name' => $this->capability['name'],
                    'capability_type_id' => $this->capability->capability_type_id,
                ]);
                $this->capability->save();

            }

            if ($this->capability->id) {
                $this->capability = Capability::find($this->capability->id);
                $this->addCapabilityLevel();
            }

        }
        return redirect()->route('capabilities.index');
    }

    public function addCapabilityLevel()
    {
        // Comprobamos que el capability_id y el name no existen ya en la tabla capability_levels
        $existingCapabilityLevel = CapabilityLevel::where([
            'capability_id' => $this->capability->id,
            'name' => $this->levelCapability['name'],
        ])->first();

        if ($existingCapabilityLevel) {
            $this->error = 'Ya existe ese nivel para esa habilidad';
        } else {
            // Ajusta esto según la relación correcta entre Capability y CapabilityLevel
            $capabilityLevels = CapabilityLevel::create([
                'name' => $this->levelCapability['name'],
                'capability_id' => $this->capability->id,
            ]);

        }
    }

    public function editCapabilityLevel($id)
    {
        $capabilityLevel = CapabilityLevel::find($id);

        if ($capabilityLevel) {
            $existingCapability = Capability::where([
                'name' => $this->currentLevel['name'],
            ])->where('id', '!=', $capabilityLevel->id)->first();

            if ($existingCapability) {
                $this->addError('currentLevel.name', 'Ya existe un nivel con este nombre para esta habilidad.');
            } else {
                $capabilityLevel->update([
                    'name' => $this->currentLevel['name'],
                ]);
            }
            $this->emit('updateLevels');
        }
    }

    public function deleteCapabilityLevel($id)
    {
        $capabilityLevel = CapabilityLevel::find($id);
        $capabilityLevel->delete();
        $this->emit('updateLevels');
    }

    public function destroy()
    {
        $this->capability->delete();
        return redirect()->route('capabilities.index');
    }

    public function render()
    {
        return view('livewire.capability.capability-edit');
    }
}
