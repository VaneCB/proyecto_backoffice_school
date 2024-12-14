<?php

namespace App\Http\Livewire\Users;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Livewire\Component;

class UserCreate extends Component
{
    public $name;
    public $email;
    public $confirm_password;
    public $new_password;
    public $error = '';

    protected $rules = [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'max:255'],
        'photo' => ['nullable', 'image', 'max:1024'],
       // 'user.password' => ['required'],

    ];

    protected function messages()
    {
        return [
            'name' => 'El nombre es un campo obligatorio',
            'email' => 'El email es un campo obligatorio',
        ];
    }

    public function mount() {

    }

    public function save() {

        $this->validate();

        if ($this->new_password != $this->confirm_password) {
            $this->error = 'Las contraseñas no coinciden';
        } else {
         User::create([
                'name' => $this->name,
                'email' => $this->email,
                'password' => Hash::make($this->new_password),
                'remember_token' => Str::random(60),
            ]);
        }

        return redirect()->route('user-table');
    }
    public function render()
    {

        return view('livewire.users.user-create');
    }
}
