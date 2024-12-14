<?php

namespace App\Http\Livewire\Users;

use App\Models\User;
use Livewire\Component;

class UserDelete extends Component
{

    public function mount($id) {

      User::find($id)->delete();

    }

    public function render()
    {
        return view('livewire.user-table');
    }

}
