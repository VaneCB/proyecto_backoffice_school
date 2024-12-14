<?php

namespace App\Http\Livewire\Teachers;

use App\Models\Language;
use App\Models\Teacher;
use Livewire\Component;

class TeacherShow extends Component
{
    public $teacher;
    public $isOpen = false;

    public function mount($id)
    {
        $this->teacher = Teacher::findOrFail($id);

    }

    protected function show($id)
    {
        $this->teacher = Teacher::find($id);
        $this->open();
    }

    public function render()
    {
        return view('livewire.teacher.teacher-show', [
            'teacher' => $this->teacher, 'open' => $this->isOpen,
        ]);
    }
}
