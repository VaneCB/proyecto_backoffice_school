<?php

namespace App\Http\Livewire\Student;

use App\Models\Student;
use Livewire\Component;

class StudentShow extends Component
{
    public $student;

    public $isOpen = false;


    public function mount($id)
    {
        $this->student = Student::find($id);

        if (!$this->student) {
            abort(404, 'El estudiante no existe.');
        }
    }

    protected function show($id)
    {
        $this->student = Student::find($id);
        $this->open();
    }


    public function render()
    {
        return view('livewire.student.student-show', [
            'student' => $this->student, 'open' => $this->isOpen,
        ]);
    }
}
