<?php

namespace App\Http\Livewire;

use App\Models\Student;
use App\Table\Column;
use Livewire\WithPagination;

class StudentTable extends Table
{
    use WithPagination;
    public function __construct()
    {
        $this->addRoute = 'student.create';
        $this->actionCol[] = ['Ver', 'fas fa-eye', 'student.show'];
        $this->actionCol[] = ['Editar', 'fas fa-edit', 'student.edit'];
        $this->actionColDelete[] = ['Borrar', 'far fa-trash-alt', 'student.delete'];
        $this->idCheckbox = false;
        $this->showFilters = true;
        $this->showOrders = true;
        $this->sortBy ='surname1';
        $this->filters = [
            'name' => '',
            'surname1' => '',
            'surname2' => '',
            'course' => ''
        ];
    }
    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        // TODO: Implement query() method.
        return Student::query()->orderBy('surname1', 'asc', 'surname2', 'asc', 'name', 'asc');
    }

    public function columns(): array
    {
        return [
            Column::make('name', 'Nombre', 'text'),
            Column::make('surname1', 'Primer apellido', 'text'),
            Column::make('surname2', 'Segundo apellido', 'text'),
            Column::make('email', 'Email', 'text'),
            Column::make('course', 'Curso', 'text'),
        ];
    }
    public function deleteRecord($recordId)
    {
        Student::destroy($recordId);
    }
}
