<?php

namespace App\Http\Livewire\Rates;

use App\Models\Teacher;
use App\Models\ExtracurricularActivity;
use App\Models\ProductVariation;
use App\Models\Rate;
use App\Models\RateLine;
use Livewire\Component;

class RateEdit extends Component
{
    public $rate;
    public $error = '';
    protected $rules = [
        'rate.name' => ['required'],
        'rate.price' => ['required'],
    ];

    protected function messages()
    {
        return [
            'rate.name' => 'El nombre es un campo obligatorio',
            'rate.price' => 'El precio es un campo obligatorio',
        ];
    }

    public function mount()
    {
        $this->rates = Rate::all();
        if (request()->id != null) {
            $this->rate = Rate::find(request()->id);
        } else {
            $this->rate = new Rate();
        }
    }

    public function save()
    {

        $this->validate();

        if($this->rate->id){
            $this->rate->update();
        }
        else{
            $this->rate->save();
        }

        return redirect()->route('rates.index');
    }

    public function destroy(){

        $this->rate->delete();
        return redirect()->route('rates.index');
    }
    public function render()
    {
        return view('livewire.rate.rate-edit');
    }
}
