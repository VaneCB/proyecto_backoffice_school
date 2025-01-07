<?php

namespace App\Http\Livewire;


use App\Models\StudentRegistration;
use App\Table\Column;
use Livewire\WithPagination;

class StudentRegistrationsTable extends Table
{
    use WithPagination;

    public $selected = [];

        public function __construct()
    {
        $this->addRoute = 'student_registrations.index';
        $this->actionCol[] = ['Ver', 'fas fa-eye', 'student_registrations.show'];
        $this->showFilters = true;
        $this->showOrders = true;
        $this->filters = [
            'student_id' => '',
            'extracurricular_activity_id' => '',
            ];
        $this->showAddButton = true;
    }

    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        return StudentRegistration::query()->with(['extracurricular_activity', 'student']);

    }

    public function columns(): array
    {
        return [
            Column::make('student.name', 'Nombre alumno', 'text'),
            Column::make('student.surname1', 'Apellido alumno', 'text'), // Corregido el campo apellido
            Column::make('extracurricular_activity.name', 'Extraescolar', 'text'),
            Column::make('status_text', 'Estado', 'text')
        ];
    }

    public function deleteRecord($recordId)
    {
        $student_registrations = StudentRegistration::find($recordId);
        $student_registrations->delete();

    }
}
