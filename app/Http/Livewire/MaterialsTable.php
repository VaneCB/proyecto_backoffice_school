<?php

namespace App\Http\Livewire;

use App\Models\Material;
use App\Models\Study;
use App\Table\Column;
use Livewire\WithPagination;

class MaterialsTable extends Table
{
    use WithPagination;
    public function __construct()
    {
        $this->addRoute = 'materials.create';
        $this->actionCol[] = ['Ver', 'fas fa-eye', 'materials.show'];
        $this->actionCol[] = ['Editar', 'fas fa-edit', 'materials.edit'];
        $this->actionColDelete[] = ['Borrar', 'far fa-trash-alt', 'materials.delete'];
        $this->idCheckbox = false;
        $this->showFilters = true;
        $this->showOrders = true;
        $this->filters = [
            'name' => '',
        ];
    }

    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        // TODO: Implement query() method.
        return Material::query()->orderBy('name', 'asc');
    }

    public function columns(): array
    {
        return [
            Column::make('name', 'Nombre', 'text'),
            Column::make('stock', 'Cantidad', 'text'),
        ];
    }

    public function deleteRecord($recordId)
    {
        $material = Material::find($recordId);
        $material->delete();
    }
}
