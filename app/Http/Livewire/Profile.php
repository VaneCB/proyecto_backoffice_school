<?php

namespace App\Http\Livewire;

use Livewire\Component;

use App\Models\User;
use Livewire\WithFileUploads;

class Profile extends Component
{

    use WithFileUploads;

    public $user;
    public $confirm_password;
    public $new_password;
    public $error = '';
    public $photo;

    protected $rules = [
        'user.name' => ['required', 'string', 'max:255'],
        'user.email' => ['required', 'string', 'email', 'max:255'],
        'photo' => ['nullable', 'image', 'max:1024'],
    ];

    protected $listeners = ['profilePhotoUpdated']; // Escuchar el evento

    public function profilePhotoUpdated()
    {
        $this->user = User::find($this->user->id);
    }

    protected function messages()
    {
        return [
            'user.name' => 'El nombre es un campo obligatorio',
            'user.email' => 'El email es un campo obligatorio',
        ];
    }
    public function mount()
    {
        $data = request()->all();
        $this->user = User::find($data['id']);
    }

    public function render()
    {
        return view('livewire.profile');
    }
}
