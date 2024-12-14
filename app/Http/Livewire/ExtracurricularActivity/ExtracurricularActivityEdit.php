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

        if($this->activity->id){
            $this->activity->update();
        }
        else{
            $this->activity->save();
        }

        return redirect()->route('extracurricular_activities.index');
    }

    public function destroy(){

        $this->activity->delete();
        return redirect()->route('extracurricular_activities.index');
    }
    public function render()
    {
        return view('livewire.extracurricular_activity.extracurricular_activity-edit');
    }
}
