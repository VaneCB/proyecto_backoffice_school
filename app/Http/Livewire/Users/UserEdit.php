<?php

namespace App\Http\Livewire\Users;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Livewire\Component;
use Livewire\WithFileUploads;

class UserEdit extends Component
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

    protected function messages()
    {
        return [
            'user.name' => 'El nombre es un campo obligatorio',
            'user.email' => 'El email es un campo obligatorio',
            'user.photo' => 'No pudo subir la imagen'

        ];
    }

    public function mount()
    {

        if (request()->id != null) {
            $this->user = User::find(request()->id);
        }

        if (request()->id == 'create') {
            $this->user = new User();
        }
    }

    public function save()
    {

        $this->validate();

        if ($this->user->id) {
            if ($this->new_password != $this->confirm_password) {
                $this->error = 'Las contraseñas no coinciden';
            } else {
                $this->user->password = bcrypt($this->new_password);
                $this->user->remember_token = Str::random(60);
                $this->user->update();
            }
            if ($this->photo) {
                $path = $this->photo->store('documents/ProfilePhoto', 'public');
                $this->user->photo = $path;
            }
            $this->user->update();
        } else {
            if ($this->new_password != $this->confirm_password) {
                $this->error = 'Las contraseñas no coinciden';
            } else {
                $newUser = User::create([
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'password' => Hash::make($this->new_password),
                    'remember_token' => Str::random(60),
                ]);
                if ($this->photo) {
                    $path = $this->photo->store('documents/ProfilePhoto', 'public');
                    $newUser->photo = $path;
                    $newUser->save();
                }
            }
        }

        return redirect()->route('users.index');
    }

    public function updatedPhoto()
    {
        $this->validateOnly('photo');

        if ($this->photo) {
            $this->user->photo = $this->photo->store('documents/ProfilePhoto', 'public');
            $this->emit('profilePhotoUpdated');
        }
    }

    public function render()
    {
        return view('livewire.users.user-edit');
    }
}
