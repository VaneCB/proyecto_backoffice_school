<?php

namespace App\Http\Livewire;

use App\Models\User;
use App\Table\Column;

class UserTable extends Table
{
    public function __construct()
    {
        $this->addRoute = 'users.create';
        $this->actionCol[] = ['Editar', 'fas fa-edit', 'users.edit'];
        $this->actionColDelete[] = ['Borrar', 'far fa-trash-alt', 'users.delete'];
        $this->idCheckbox = false;
        $this->showFilters = true;
        $this->showOrders = true;
        $this->sortBy ='created_at';
        $this->filters = [
            'name' => '',
            'email' => '',

        ];
        $this->showAddButton = false;
    }


    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        // TODO: Implement query() method.
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            // Si es administrador, devuelve todos los usuarios
            return User::query()->orderBy('name', 'asc');
        }

        if ($user->hasRole('teacher')) {
            // Si es profesor, devuelve solo su propio registro
            return User::query()
                ->where('email', $user->email)
                ->orderBy('name', 'asc');
        }

        // Por defecto, devuelve un conjunto vacío
        return User::query()->whereRaw('1 = 0');

    }

    public function columns(): array
    {
        return [
            Column::make('name', 'Nombre', 'text'),
            Column::make('email', 'Email', 'text'),
            Column::make('created_at', 'Fecha', 'date'),
            //  Column::make('estado', 'Estado')->component('columns.common.status'),
        ];
    }

    public function deleteRecord($recordId)
    {
        User::destroy($recordId);
    }
}
