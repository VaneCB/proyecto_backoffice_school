<?php

namespace App\Http\Livewire\Student;

use App\Models\Student;
use Livewire\Component;

class StudentDelete extends Component
{

    public function mount($id) {

        Student::find($id)->delete();
        return redirect()->route('student-table');

    }



}
