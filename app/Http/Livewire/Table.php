<?php

namespace App\Http\Livewire;

use Illuminate\Database\Eloquent\Builder;
use Livewire\Component;
use Livewire\WithPagination;

abstract class Table extends Component
{
    use WithPagination;
    public $perPage = 5;
    public $page = 1;

    //protected $paginationTheme = "custom";

    public abstract function query(): Builder;

    public abstract function columns(): array;

    public array $actionCol = [];
    public array $actionColDelete = [];
    public string $addRoute = '';
    public array $actionColFile = [];
    public bool $idCheckbox = false;

    public $showActionButton = false;

    public $showActionInvoice = false;

    public array $filters = [];

    public $sortBy = '';
    public $sortDirection = 'asc';

    public bool $showFilters = false;
    public bool $showOrders = false;

    public function updatedFilters()
    {
        $this->page = 1;
    }
    public function data()
    {
        $query = $this->query()
            ->when($this->sortBy !== '', function ($query) {
                $query->orderBy($this->sortBy, $this->sortDirection);
            });

        foreach ($this->columns() as $column) {
            $keys = explode('.', $column->key);
            $search = $this->filters;

            foreach ($keys as $key) {
                if(array_key_exists($key, $search)) {
                    $search = $search[$key];
                } else {
                    $search = '';
                    break;
                }
            }
            if($search != '') {
                $operator = '=';
                $val = $search;
                if ($column->filterType == 'text') {
                    $operator = 'like';
                    $val = '%' . $search . '%';
                }

                if(str_contains($column->key, '.')) {
                    $keys = explode('.', $column->key);
                    $last = array_pop($keys);
                    $key = implode('.', $keys);
                    $query->whereRelation($key, $last, $operator, $val);
                } else {
                    $query->where($column->key,  $operator, $val);
                }
            }
        }

        return $query->paginate($this->perPage)->onEachSide(2);
    }
    public function sort($key) {

       $this->resetPage();

        if ($this->sortBy === $key) {
            $direction = $this->sortDirection === 'asc' ? 'desc' : 'asc';
            $this->sortDirection = $direction;
            return;
        }

        $this->sortBy = $key;
        $this->sortDirection = 'asc';
    }
    public static function getValue($row, $attribute)
    {
        if(str_contains($attribute, '.')) {
            $attributes = explode('.', $attribute);
            foreach ($attributes as $attribute) {
                $row = $row->$attribute;
            }
            return $row;
        }
        return $row[$attribute];
    }

    public abstract function deleteRecord($recordId);
    public function render()
    {
        return view('livewire.table');
    }
}
