<?php

namespace App\Http\Livewire;

use App\Models\ExtracurricularGroups;
use App\Models\StudentRegistration;
use App\Models\Transaction;
use App\Table\Column;
use Livewire\WithPagination;

class StudentRegistrationsTable extends Table
{
    use WithPagination;

    public $selected = [];
    public $student_registrations;
        public function __construct()
    {
        $this->actionCol[] = ['Ver', 'fas fa-eye', 'student_registrations.show'];
        $this->actionCol[] = ['Editar', 'fas fa-edit', 'student_registrations.edit'];
        $this->actionColDelete[] = ['Borrar', 'far fa-trash-alt', 'student_registrations.delete'];
        $this->showActionInvoice = true;
        $this->idCheckbox = true;
        $this->showFilters = true;
        $this->showOrders = true;
        $this->filters = [
            'student_id' => '',
            'extracurricular_activity_id' => '',
            ];
    }

    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        return StudentRegistration::query()->with('extracurricular_activities');
    }

    public function columns(): array
    {
        return [
            Column::make('', '', '', true),
            Column::make('transaction.number', 'Numero de pedido', 'text'),
            Column::make('transaction.date', 'Fecha', 'date'),
            Column::make('status_text', 'Estado', 'text'),
            Column::make('transaction.customer.name', 'Cliente', 'text'),
            Column::make('estimation_id', 'Presupuesto', 'text'),
        ];
    }

    public function deleteRecord($recordId)
    {
        $student_registrations = StudentRegistration::find($recordId);
        $student_registrations->delete();

    }
}
