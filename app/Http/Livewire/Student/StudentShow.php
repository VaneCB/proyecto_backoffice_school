<?php

namespace App\Http\Livewire\Student;

use App\Models\Student;
use App\Models\StudentRegistration;
use Livewire\Component;

class StudentShow extends Component
{
    public $student;

    public $isOpen = false;
    public $registrations;


    public function mount($id)
    {
        $this->student = Student::find($id);

        if (!$this->student) {
            abort(404, 'El estudiante no existe.');
        }
        $this->registrations = StudentRegistration::where('student_id', $id)->with('extracurricular_activity')->get();
    }

    protected function show($id)
    {
        $this->student = Student::find($id);
        $this->open();
    }


    public function render()
    {
        return view('livewire.student.student-show', [
            'student' => $this->student, 'open' => $this->isOpen,'registrations' => $this->registrations
        ]);
    }
}
