<?php

namespace App\Http\Livewire;

use App\Models\ExtracurricularActivity;
use App\Models\Rate;
use App\Table\Column;

class RatesTable extends Table
{
    public function __construct()
    {
        $this->addRoute = 'rates.create';
        $this->actionCol[] = ['Ver', 'fas fa-eye', 'rates.show'];
        $this->actionCol[] = ['Editar', 'fas fa-edit', 'rates.edit'];
        $this->actionColDelete[] = ['Borrar', 'far fa-trash-alt', 'rates.delete'];
        $this->idCheckbox = false;
        $this->showFilters = true;
        $this->showOrders = true;
        $this->filters = [
            'name' => '',
            'price'
        ];
    }


    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        return Rate::query()->orderBy('name', 'asc');
    }


    public function columns(): array
    {
        return [
            Column::make('name', 'Nombre', 'text'),
            Column::make('price', 'Precio', 'text'),
        ];
    }

    public function deleteRecord($recordId)
    {
        Rate::destroy($recordId);
    }

}
