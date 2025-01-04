<?php

namespace Tests\Feature;

use App\Http\Livewire\RatesTable;
use App\Http\Livewire\Teachers\TeacherEdit;
use App\Models\Teacher;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Livewire\Livewire;
use Tests\TestCase;

class TeacherShowTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_it_displays_the_teacher_details_correctly()
    {

        $this->seed(RoleAndPermissionSeeder::class);
        $this->seed(DatabaseSeeder::class);
        $user = User::first(); // Obtén el primer usuario de la base de datos

        // Crea un profesor usando el factory
        $teacher = Teacher::factory()->create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
        ]);

        // Autentica al usuario antes de hacer la solicitud
        $response = $this->actingAs($user) // Simula la autenticación
        ->get(route('teachers.show', ['id' => $teacher->id]));
        // Verifica que la vista cargada contiene el nombre y correo del profesor
        $response->assertStatus(200); // Asegura que la respuesta sea exitosa
        $response->assertSee('John Doe'); // Verifica que el nombre aparece en la vista
        $response->assertSee('john.doe@example.com'); // Verifica que el correo aparece en la vista
    }
}
