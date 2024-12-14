<?php

namespace App\Http\Livewire\ExtracurricularActivity;

use App\Models\ExtracurricularActivity;
use App\Models\Material;
use App\Models\Rate;
use App\Models\Teacher;
use Livewire\Component;

class ExtracurricularActivityShow extends Component
{
    public $activity;
    public $isOpen = false;

    public function mount($id)
    {
        $this->activity = ExtracurricularActivity::find($id);
        $this->teacher = Teacher::all();
        $this->material = Material::all();
        $this->rate = Rate::all();
    }

    protected function show($id)
    {
        $this->activity = ExtracurricularActivity::find($id);

    }
    public function render()
    {
        return view('livewire.extracurricular_activity.extracurricular_activity-show', [
            'activity' => $this->activity, 'open' => $this->isOpen,
        ]);
    }
}
