<?php

namespace App\Http\Livewire\Teachers;

use App\Models\Capability;
use App\Models\CapabilityLevel;
use App\Models\CapabilityType;
use App\Models\Teacher;
use App\Models\TeacherCapabilities;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Livewire\Component;

class TeacherEdit extends Component
{
    public $teacher;
    public $error = '';
    public $teacherCapability;
    public $isOpen = false;

    public $capabilities;
    public $capability;
    public $capabilityLevel;
    public $capabilityTypes;
    public $selectedCapability;

    public $selectedCapabilityId;
    public $levelCapability;

    protected $listeners = ['showModal' => 'open', 'capabilitiesAdded', 'capabilitiesDeleted'];

    public function capabilitiesAdded()
    {
        $this->teacherCapability = TeacherCapabilities::where('teacher_id', $this->teacher->id)->get();
        $this->capabilities = Capability::all();
    }

    public function capabilitiesDeleted()
    {
        $this->teacherCapability = TeacherCapabilities::where('teacher_id', $this->teacher->id)->get();
        $this->capabilities = Capability::all();
    }

    public function open()
    {
        return redirect()->route('modal-idioma');
    }

    protected $rules = [
        'teacher.name' => ['required'],
        'teacher.surname1' => ['required'],
        'teacher.surname2' => ['nullable'],
        'teacher.phone' => ['required'],
        'teacher.email' => ['required'],
        'teacher.address' => ['required'],
        'teacher.observations' => ['nullable'],
    ];

    protected function messages()
    {
        return [
            'teacher.name' => 'El nombre es un campo obligatorio',
            'teacher.surname1' => 'El apellido es un campo obligatorio',
            'teacher.phone' => 'El telefono es un campo obligatorio',
            'teacher.email' => 'El email es un campo obligatorio',
            'teacher.address' => 'La dirección es un campo obligatorio',
        ];
    }

    public function getLevelForSelectedCapability()
    {
        if ($this->selectedCapability) {
            // Obtener las capabilities según el idioma seleccionado
            $currentCapability = CapabilityLevel::where('capability_id', $this->selectedCapability)->get();
            return $currentCapability ?? [];
        }
        return [];
    }

    public function mount()
    {
        $this->teacherCapability = TeacherCapabilities::all();
        $this->capabilities = Capability::all();
        $this->capabilityTypes = CapabilityType::all();
        $this->capabilityLevel = CapabilityLevel::all();

        if (request()->id != null) {
            $this->teacher = Teacher::find(request()->id);
        } else {
            if (auth()->user()->hasRole('teacher')) {
                session()->flash('error', 'No tienes permisos para crear profesores.');
                return redirect()->route('teachers.index');
            }
            $this->teacher = new Teacher();
        }
    }

    public function addCapability()
    {
        $existingCapability = Capability::where('name', $this->capability['name'])->first();

        if ($existingCapability) {
            $currentCapability = $existingCapability;
        } else {
            $currentCapability = Capability::create([
                'name' => $this->capability['name'],
                'capability_type_id' => $this->capability['capability_type_id'],
            ]);
        }

        // Verificar la existencia de $this->levelCapability
        if ($this->levelCapability) {
            // Buscar un nivel existente con el mismo nombre y capacidad_id
            $existLevel = CapabilityLevel::where([
                'name' => $this->levelCapability['name'],
                'capability_id' => $currentCapability->id,
            ])->first();

            if ($existLevel) {
                // Si ya existe un nivel, mostrar un error
                $this->addError('levelCapability.name', 'Ya existe un nivel con este nombre para esta capacidad.');
            } else {
                // Si no existe un nivel, crear uno nuevo
                $capabilityLevel = CapabilityLevel::create([
                    'name' => $this->levelCapability['name'],
                    'capability_id' => $currentCapability->id,
                ]);
            }
        } else {
            $this->addError('levelCapability.name', 'El nivel es obligatorio.');
        }
        $this->capabilities = Capability::all();
        $this->isOpen = false;
    }


    public function newCapability()
    {
        $id = $this->teacher->id;
        $currentCapability = Capability::where('id', $this->selectedCapability)->first();
        $currentLevelCapability = CapabilityLevel::where('id', $this->selectedCapabilityId)
            ->first();

        if (!$this->teacher->teacherCapabilities->where('capability_id', $currentCapability->id)->first()) {
            TeacherCapabilities::create([
                'teacher_id' => $this->teacher->id,
                'capability_level_id' => $currentLevelCapability->id,
            ]);
        } else {
            $this->addError('capability', 'Ya has añadido esta habilidad.');
        }
        $this->capability = null;
        $this->emit('capabilitiesAdded');

    }

    public function deleteCapability($id)
    {
        TeacherCapabilities::find($id)->delete();
        $this->isOpen = false;
        $this->emit('capabilitiesDeleted');
    }


    public function save()
    {

        $this->validate();

        if ($this->teacher->id) {
            $this->teacher->update();
        } else {
            $this->teacher->save();

            // Crear el usuario automáticamente para el nuevo profesor
            $user = User::firstOrCreate(
                ['email' => $this->teacher->email],
                [
                    'name' => $this->teacher->name . ' ' . $this->teacher->surname1,
                    'password' => Hash::make('teacher'),
                ]
            );

            // Asignar el rol de profesor
            $user->assignRole('teacher');
        }

        return redirect()->route('teachers.index');
    }

    public function destroy(){

        $this->teacher->delete();
        return redirect()->route('teachers.index');
    }

    public function render()
    {
        return view('livewire.teacher.teacher-edit')->with('success', 'El profesor se ha eliminado correctamente.');;
    }
}
