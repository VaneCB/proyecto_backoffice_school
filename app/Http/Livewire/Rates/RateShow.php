<?php

namespace App\Http\Livewire\Rates;

use App\Models\Material;
use App\Models\MaterialItem;
use App\Models\Rate;
use App\Models\RateLine;
use App\Models\Language;
use App\Models\Study;
use Livewire\Component;

class RateShow extends Component
{
    public $rate;

    public function mount($id)
    {
        $this->rate = Rate::findOrFail($id);

    }

    protected function show($id)
    {
        $this->rate = Rate::find($id);
    }

    public function render()
    {
        return view('livewire.rate.rate-show');
    }
}
