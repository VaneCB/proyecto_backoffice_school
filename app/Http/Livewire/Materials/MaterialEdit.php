<?php

namespace App\Http\Livewire\Materials;

use App\Models\ExtracurricularActivity;
use App\Models\Student;
use App\Models\PersonalGoods;
use App\Models\Material;
use App\Models\MaterialItem;
use App\Models\Language;
use App\Models\Study;
use Livewire\Component;

class MaterialEdit extends Component
{
    public $material;
    public $activities;
    public $error = '';

    protected $rules = [
        'material.name' => ['required'],
        'material.stock' => ['required'],
    ];

    protected function messages()
    {
        return [
            'material.name' => 'El nombre es un campo obligatorio',
            'material.stock' => 'El stock es un campo obligatorio'
        ];
    }

    public function mount()
    {

        if (request()->id != null) {
            $this->material = Material::find(request()->id);
            $this->activities = ExtracurricularActivity::all();
        } else {
            $this->material = new Material();

        }
    }

    public function save()
    {
        $this->validate();

        if ($this->material->id) {
            $this->material->update();
        } else {
            $this->material->save();
        }

        return redirect()->route('materials.index');
    }

    public function render()
    {
        return view('livewire.material.material-edit');
    }
}
