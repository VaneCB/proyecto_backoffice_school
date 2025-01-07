<?php

namespace App\Http\Livewire;

use App\Models\Language;
use App\Models\Teacher;
use App\Table\Column;
use Livewire\WithPagination;

class TeachersTable extends Table
{
    use WithPagination;
    public function __construct()
    {
        $this->addRoute = 'teachers.create';
        $this->actionCol[] = ['Ver', 'fas fa-eye', 'teachers.show'];
        $this->actionCol[] = ['Editar', 'fas fa-edit', 'teachers.edit'];
        $this->actionColDelete[] = ['Borrar', 'far fa-trash-alt', 'teachers.delete'];
        $this->showFilters = true;
        $this->showOrders = true;
        $this->filters = [
            'name' => '',
            'surname1' => '',
            'surname2' => '',
            'email' => '',
        ];
        $this->showAddButton = false;
    }

    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        // TODO: Implement query() method.
        //return Teacher::query()->orderBy('name', 'asc');
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            // Si es administrador, devuelve todos los profesores
            return Teacher::query()->orderBy('name', 'asc');
        }

        if ($user->hasRole('teacher')) {
            // Si es profesor, devuelve solo su propio registro
            return Teacher::query()
                ->where('email', $user->email)
                ->orderBy('name', 'asc');
        }

        // Por defecto, devuelve un conjunto vacío
        return Teacher::query()->whereRaw('1 = 0');
    }

    public function columns(): array
    {
        return [
            Column::make('name', 'Nombre', 'text'),
            Column::make('surname1', 'Primer apellido', 'text'),
            Column::make('surname2', 'Segundo apellido', 'text'),
            Column::make('email', 'Email', 'text'),
        ];
    }

    public function deleteRecord($recordId)
    {
        if (auth()->user()->hasRole('teacher')) {
            session()->flash('error', 'No tienes permisos para eliminar profesores.');
            return;
        }

        Teacher::destroy($recordId);
        session()->flash('message', 'Profesor eliminado correctamente.');
    }
}
