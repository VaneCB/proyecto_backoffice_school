<?php

namespace App\Http\Livewire\StudentRegistrations;

use App\Models\Estimation;
use App\Models\Products;
use App\Models\ProductVariation;
use App\Models\Rate;
use App\Models\Transaction;
use App\Models\TransactionLine;
use App\Models\TransactionLineGroup;
use Illuminate\Support\Facades\Config;
use Livewire\Component;

class StudentRegistrationShow extends Component
{
    public $estimation;
    public $transaction;
    public $transactionLines;
    public $lineGroups;
    public $linesWithoutGroup;

    public $productVariations;
    public $rate;
    public $rateName;

    public $isShow = true;

    public function mount($id)
    {
        $this->estimation = Estimation::with('transaction')->find($id);
        $this->transaction = Transaction::where('transactionable_id', $this->estimation->id)->first();
        $this->transactionLines = TransactionLine::where('transaction_id', $this->transaction->id)->get();
        $this->lineGroups = TransactionLineGroup::with('transactionLines')->where('transaction_id', $this->transaction->id)->get();
        $this->linesWithoutGroup = TransactionLine::where('transaction_id', $this->transaction->id)->where('transaction_line_group_id', null)->get();
        $this->rate = Rate::find($this->transaction->customer->rate_id);
        $this->rateName = $this->rate->name;
        $this->productVariations = ProductVariation::whereHas('rateLines', function ($query) {
            $query->where('rate_id', $this->rate->id);
        })->get();

    }

    public function show($id)
    {
        $this->estimation = Estimation::with('transaction')->find($id);
        $this->transaction = Transaction::where('transactionable_id', $this->estimation->id)->first();
        $this->transactionLines = TransactionLine::where('transaction_id', $this->transaction->id)->get();

    }
    public function render()
    {
        $estados = Config::get('estimation.status');
        return view('livewire.estimation.estimation-show', [
            'estimation' => $this->estimation,
            'estados' => $estados,

        ]);
    }
}
