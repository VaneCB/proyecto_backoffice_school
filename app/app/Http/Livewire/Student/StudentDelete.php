<?php

namespace App\Http\Livewire\Student;

use App\Models\Student;
use Livewire\Component;

class StudentDelete extends Component
{

    public function mount($id) {
        if (auth()->user()->hasRole('teacher')) {
            // Redirigir a la página de estudiantes con un mensaje de error
            return redirect()->route('student.index')->with('error', 'No tienes permisos para borrar estudiantes.');
        }
        Student::find($id)->delete();
        return redirect()
            ->route('student-table')
            ->with('success', 'El alumno se ha eliminado correctamente.');

    }



}
