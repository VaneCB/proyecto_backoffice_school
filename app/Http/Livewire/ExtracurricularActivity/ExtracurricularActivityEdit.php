<?php

namespace App\Http\Livewire\ExtracurricularActivity;

use App\Models\Material;
use App\Models\Rate;
use App\Models\Teacher;
use App\Models\ExtracurricularActivity;
use Livewire\Component;

class ExtracurricularActivityEdit extends Component
{
    public $activity;
    public $error = '';
    public $teachers;
    public $materials;
    public $rates;

    protected $rules = [
        'activity.name' => ['required'],
        'activity.description' => ['required'],
        'activity.classes' => ['required'],
        'activity.course' => ['required'],
        'activity.teacher_id' => ['nullable'],
        'activity.material_id' => ['nullable'],
        'activity.rate_id' => ['nullable']
    ];

    protected function messages()
    {
        return [
            'activity.name' => 'El nombre es un campo obligatorio',
            'activity.description' => 'La descripción es un campo obligatorio',
            'activity.course' => 'El curso es un campo obligatorio',
            'activity.classes' => 'El número de clases es un campo obligatorio',

        ];
    }

    public function mount()
    {
        if (auth()->user()->hasRole('teacher')) {
            // Redirigir a la página de estudiantes con un mensaje de error
            return redirect()->route('extracurricular_activities.index')->with('error', 'No tienes permisos para crear/editar extraescolares.');
        }
        $this->teachers = Teacher::all();
        $this->materials = Material::all();
        $this->rates = Rate::all();
        if (request()->id != null) {
            $this->activity = ExtracurricularActivity::find(request()->id);
        } else {
            $this->activity = new ExtracurricularActivity();
        }
    }

    public function save()
    {
        $this->validate();

        if ($this->activity->material_id) {
            $material = Material::find($this->activity->material_id);

            // Verifica si el material tiene suficiente stock
            if (!$material || $material->stock <= 0) {
                // Si no hay stock suficiente, mostrar error
                return redirect()
                    ->route('extracurricular_activities.index')
                    ->with('error', 'No hay suficiente stock de este material para asignarlo.');
            }

            // Descontar 1 del stock disponible (o la cantidad asignada)
            $material->stock -= 1;
            $material->save();
        }

        // Guardar la actividad solo si el stock es suficiente
        if ($this->activity->id) {
            $this->activity->update();
        } else {
            $this->activity->save();
        }

        return redirect()->route('extracurricular_activities.index');
    }


    public function destroy(){

        $this->activity->delete();
        return redirect()->route('extracurricular_activities.index')->with('success', 'La extraescolar se ha eliminado correctamente.');;
    }
    public function render()
    {
        return view('livewire.extracurricular_activity.extracurricular_activity-edit');
    }
}
