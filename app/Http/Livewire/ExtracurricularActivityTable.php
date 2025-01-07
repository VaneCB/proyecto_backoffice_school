<?php

namespace App\Http\Livewire;

use App\Models\ExtracurricularActivity;
use App\Models\Teacher;
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
        $this->showAddButton = false;
    }


    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        //return ExtracurricularActivity::query()->with('teacher')->orderBy('name', 'asc');
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            // Devuelve todas las actividades si es un administrador
            return ExtracurricularActivity::query()->with('teacher')->orderBy('name', 'asc');
        }

        if ($user->hasRole('teacher')) {
            $teacher = Teacher::where('email', $user->email)->first();

            if (!$teacher) {
                return ExtracurricularActivity::query()->whereRaw('1 = 0');
            }

            return ExtracurricularActivity::query()
                ->with('teacher')
                ->where('teacher_id', $teacher->id)
                ->orderBy('name', 'asc');
        }

        return ExtracurricularActivity::query()->whereRaw('1 = 0');
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
        if (auth()->user()->hasRole('teacher')) {
            session()->flash('error', 'No tienes permisos para eliminar extraescolares');
            return;
        }
        ExtracurricularActivity::destroy($recordId);
        session()->flash('message', 'Extraescolar eliminada correctamente.');
    }

}
