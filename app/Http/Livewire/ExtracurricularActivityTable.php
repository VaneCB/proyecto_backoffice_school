<?php

namespace App\Http\Livewire;

use App\Models\ExtracurricularActivity;
use App\Table\Column;

class ExtracurricularActivityTable extends Table
{
    public function __construct()
    {
        $this->addRoute = 'extracurricular_activities.create';
        $this->actionCol[] = ['Ver', 'fas fa-eye', 'extracurricular_activities.show'];
        $this->actionCol[] = ['Editar', 'fas fa-edit', 'extracurricular_activities.edit'];
        $this->actionColDelete[] = ['Borrar', 'far fa-trash-alt', 'extracurricular_activities.delete'];
        $this->idCheckbox = false;
        $this->showFilters = true;
        $this->showOrders = true;
        $this->filters = [
            'name' => '',
            'description' => '',
            'course' => '',
            'teacher_id' => '',
        ];
    }


    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        return ExtracurricularActivity::query()->with('teacher')->orderBy('name', 'asc');
    }

    public function columns(): array
    {
        return [
            Column::make('name', 'Nombre', 'text'),
            Column::make('description', 'Descripcion', 'text'),
            Column::make('course', 'Curso', 'text'),
        ];
    }

    public function deleteRecord($recordId)
    {
        ExtracurricularActivity::destroy($recordId);
    }

}
