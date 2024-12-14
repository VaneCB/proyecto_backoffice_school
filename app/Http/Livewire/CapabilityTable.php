<?php

namespace App\Http\Livewire;

use App\Models\Capability;
use App\Table\Column;
use Livewire\WithPagination;

class CapabilityTable extends Table
{
    use WithPagination;
    public function __construct()
    {
        $this->addRoute = 'capabilities.create';
        $this->actionCol[] = ['Ver', 'fas fa-eye', 'capabilities.show'];
        $this->actionCol[] = ['Editar', 'fas fa-edit', 'capabilities.edit'];
        $this->actionColDelete[] = ['Borrar', 'far fa-trash-alt', 'capabilities.delete'];
        $this->idCheckbox = false;
        $this->showFilters = true;
        $this->showOrders = true;
        $this->filters = [
            'name' => '',
            'capability_type_id' => '',
        ];
    }

    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        // TODO: Implement query() method.
        return Capability::query()
            ->with(['capabilityType', 'capabilityLevels'])
            ->orderBy('name', 'asc');
    }

    public function columns(): array
    {
        return [
            Column::make('name', 'Nombre', 'text'),
            Column::make('capabilityType.name', 'Tipo', 'text'),
        ];
    }

    public function deleteRecord($recordId)
    {
        Capability::destroy($recordId);
    }
}
