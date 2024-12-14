<?php

namespace App\Http\Livewire\Student;

use App\Models\Student;
use Illuminate\Support\Facades\Log;
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\WithPagination;


class StudentEdit extends Component
{
    use WithPagination;
    use WithFileUploads;

    public $student;
    public $error = '';
    public $isOpen = false;

    public $message = '';

    protected $rules = [
        'student.name' => ['required'],
        'student.surname1' => ['required'],
        'student.surname2' => ['nullable'],
        'student.email' => ['required'],
        'student.phone' => ['required'],
        'student.address' => ['required'],
        'student.parent_name' => ['required'],
        'student.nif_parent' => ['required', 'regex:/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i'],
        'student.course' => ['required'],
    ];

    protected function messages()
    {
        return [
            'student.name' => 'El nombre es un campo obligatorio',
            'student.email' => 'El email es un campo obligatorio',
            'student.surname1' => ['El primer apellido es obligatorio'],
            'student.address' => ['La dirección es un campo obligatorio'],
            'student.nif_parent' => ['El dni es un campo obligatorio'],
            'student.course' => ['El curso es un campo obligatorio'],
        ];
    }

    public function mount()
    {
        if (request()->id != null) {
            $this->student = Student::find(request()->id);
        } else {
            $this->student = new Student();
        }
    }

    public function save()
    {
        $this->validate();

        if ($this->student->id) {
            Log::info('entro al if');
            $this->student->update();
            Log::info($this->student->id);
        } else {
            Log::info('entro al else');
            $this->create();
        }

        session()->flash('message', $this->message);

        return redirect()->route('student.index');
    }

    protected function create()
    {
        Student::create($this->getStudentData());
        $this->message = 'El alumno ha sido creado correctamente';
    }

    protected function update()
    {
        if ($this->personal->id) {
            $this->personal->update($this->getStudentData());
            $this->message = 'El alumno ha sido actualizado correctamente';
        }
    }

    protected function getStudentData()
    {
        return [
            'name' => $this->student->name,
            'surname1' => $this->student->surname1,
            'surname2' => $this->student->surname2,
            'email' => $this->student->email,
            'phone' => $this->student->phone,
            'address' => $this->student->address,
            'parent_name' => $this->student->parent_name,
            'nif_parent' => $this->student->nif_parent,
            'course' => $this->student->course,
        ];
    }

    public function render()
    {
        return view('livewire.student.student-edit', ['isOpen' => $this->isOpen]);
    }
}
