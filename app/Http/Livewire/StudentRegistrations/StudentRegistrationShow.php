<?php

namespace App\Http\Livewire\StudentRegistrations;

use App\Models\ExtracurricularActivity;
use App\Models\Rate;
use App\Models\Student;
use App\Models\StudentRegistration;
use Livewire\Component;

class StudentRegistrationShow extends Component
{
    public $registration;
    public $student;

    protected $listeners = ['redirectToIndex'];

    public function redirectToIndex()
    {
        return redirect()->route('student_registrations.index');
    }
    public function mount($id)
    {
        $this->registration = StudentRegistration::with('student')->find($id);

        if ($this->registration) {
            $this->student = $this->registration->student;
        } else {
            abort(404, 'Registro no encontrado');
        }
    }

    public function accept()
    {
        $this->registration->update(['status' => 1]);
        $this->emit('successMessage', 'Se ha aceptado la inscripción.');
        return redirect()->route('student_registrations.index');
    }

    public function cancel()
    {
        $this->registration->update(['status' => 2]);
        $this->emit('successMessage', 'Inscripción cancelada.');
        return redirect()->route('student_registrations.index');
    }

    public function render()
    {
        return view('livewire.student_registration.student_registration-show', [
            'registration' => $this->registration,
        ]);
    }
}
