<?php

namespace App\Http\Livewire\StudentRegistrations;

use App\Models\ExtracurricularActivity;
use App\Models\Student;
use Illuminate\Support\Facades\Log;
use Livewire\Component;

class StudentRegistrationEdit extends Component
{

    public $student = [];
    public $activities;
    public $selectedActivity;
    public $selectedActivities = [];
    public $error = '';
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
        $this->activities = ExtracurricularActivity::all();
    }

    public function addActivity()
    {
        if (!$this->selectedActivity || in_array($this->selectedActivity, $this->selectedActivities)) {
            $this->addError('selectedActivity', 'Debe seleccionar una actividad válida.');
            return;
        }

        $this->selectedActivities[] = $this->selectedActivity;
        $this->reset('selectedActivity'); // Limpiar el select
    }

    public function removeActivity($activityId)
    {
        $this->selectedActivities = array_filter($this->selectedActivities, fn($id) => $id != $activityId);
    }

    public function save()
    {
        $this->validate();

        // Crear o buscar el estudiante
        $student = Student::updateOrCreate(
            ['email' => $this->student['email'] ?? null],
            $this->student
        );

        // Asociar actividades
        $student->registrations()->sync($this->selectedActivities);

        // Redirigir o mostrar mensaje de éxito
        session()->flash('message', 'Estudiante y actividades guardados con éxito.');
        return redirect()->route('login');

    }

    public function render()
    {
        return view('livewire.student_registration.student_registration-edit');
    }

}
