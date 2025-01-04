<?php

namespace Tests\Feature;

use App\Http\Livewire\Teachers\TeacherEdit;
use App\Models\Capability;
use App\Models\CapabilityLevel;
use App\Models\Teacher;
use App\Models\TeacherCapabilities;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class TeacherEditTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_teacher_creation_and_user_creation_with_livewire()
    {
        // Semilla los roles y permisos necesarios
        $this->seed(RoleAndPermissionSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $user = User::first();

        $this->actingAs($user);

        // Datos del profesor a crear
        $teacherData = [
            'name' => 'John',
            'surname1' => 'Doe',
            'surname2' => 'Smith',
            'email' => 'john.doe@example.com',
            'phone' => '123456789',
            'address' => '456 Main St.',
        ];

        // Ejecuta el componente Livewire y simula la interacción
        Livewire::test(TeacherEdit::class)
            ->set('teacher.name', $teacherData['name'])
            ->set('teacher.surname1', $teacherData['surname1'])
            ->set('teacher.surname2', $teacherData['surname2'])
            ->set('teacher.email', $teacherData['email'])
            ->set('teacher.phone', $teacherData['phone'])
            ->set('teacher.address', $teacherData['address'])
            ->call('save'); // Llama al método de guardado del componente Livewire

        // Verifica que el profesor ha sido creado correctamente en la base de datos
        $this->assertDatabaseHas('teachers', [
            'name' => 'John',
            'email' => 'john.doe@example.com',
        ]);

        // Verifica que el usuario ha sido creado en la base de datos
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
        ]);

        // Verifica que el rol de 'teacher' ha sido asignado al usuario
        $user = User::where('email', 'john.doe@example.com')->first(); // Recupera el usuario por email
        $this->assertTrue($user->hasRole('teacher')); // Verifica que el usuario tiene el rol 'teacher'


    }

    public function test_teacher_deletion_with_livewire()
    {
        $this->seed(RoleAndPermissionSeeder::class);
        $this->seed(DatabaseSeeder::class);
        $user = User::first();

        $teacher = Teacher::factory()->create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
        ]);

        $this->actingAs($user);

        Livewire::test(TeacherEdit::class, ['teacher' => $teacher])
            ->call('destroy'); // Llama al método de eliminación del componente Livewire

        // Verifica que el profesor ha sido eliminado de la base de datos
        $this->assertDatabaseMissing('teachers', [
            'id' => $teacher->id,
            'name' => 'John',
            'email' => 'john.doe@example.com',
        ]);
    }

    public function test_can_edit_teacher()
    {
        // Sembrar roles y permisos necesarios
        $this->seed(RoleAndPermissionSeeder::class);
        $this->seed(DatabaseSeeder::class);

        // Crear un usuario autenticado
        $user = User::factory()->create();
        $this->actingAs($user);

        $teacher = Teacher::factory()->create([
            'name' => 'John',
            'surname1' => 'Doe',
            'email' => 'john.doe@example.com',
        ]);

        $updatedData = [
            'name' => 'Jane',
            'surname1' => 'Smith',
            'email' => 'jane.smith@example.com',
        ];

        $teacher->update($updatedData);

        $teacher->refresh();

        $this->assertEquals($updatedData['name'], $teacher->name);
        $this->assertEquals($updatedData['surname1'], $teacher->surname1);
        $this->assertEquals($updatedData['email'], $teacher->email);
    }


    public function test_get_level_for_selected_capability()
    {
        $this->seed(RoleAndPermissionSeeder::class);
        $this->seed(DatabaseSeeder::class);
        $user = User::first();

        $this->actingAs($user);
        $capability = Capability::create([
            'name' => 'Programming',
            'capability_type_id' => 1,
        ]);

        $levels = [
            CapabilityLevel::create(['name' => 'Beginner', 'capability_id' => $capability->id]),
            CapabilityLevel::create(['name' => 'Intermediate', 'capability_id' => $capability->id]),
            CapabilityLevel::create(['name' => 'Advanced', 'capability_id' => $capability->id]),
        ];

        // Simula el componente y selecciona una capacidad
        Livewire::test(TeacherEdit::class)
            ->set('selectedCapability', $capability->id)
            ->call('getLevelForSelectedCapability')
            ->assertSet('selectedCapability', $capability->id);
    }

    public function test_add_capability_creates_new_capability_and_level()
    {
        $this->seed(RoleAndPermissionSeeder::class);
        $this->seed(DatabaseSeeder::class);
        $user = User::first();
        $this->actingAs($user);

        // Datos iniciales
        $capabilityData = [
            'name' => 'Art',
            'capability_type_id' => 2,
        ];
        $levelData = [
            'name' => 'Expert',
        ];

        // Simula el componente
        Livewire::test(TeacherEdit::class)
            ->set('capability', $capabilityData) // Pasar los datos del capability
            ->set('levelCapability', $levelData) // Pasar los datos del nivel
            ->call('addCapability');

        // Verifica que la capacidad y el nivel se crearon
        $this->assertDatabaseHas('capabilities', ['name' => 'Art']);
        $this->assertDatabaseHas('capability_levels', ['name' => 'Expert']);
    }

    public function test_new_capability_is_added_correctly_to_teacher()
    {
        $this->seed(RoleAndPermissionSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $user = User::first();
        $this->actingAs($user);

        // Crear un profesor
        $teacher = Teacher::factory()->create();

        // Crear una habilidad y un nivel de habilidad
        $capability = Capability::create(['name' => 'Mathematics', 'capability_type_id' => 1]);
        $level = CapabilityLevel::create(['name' => 'Advanced', 'capability_id' => $capability->id]);

        // Probar el componente Livewire
        Livewire::test(TeacherEdit::class)
            ->set('teacher', $teacher)
            ->assertSet('teacher.id', $teacher->id)
            ->set('selectedCapability', $capability->id)
            ->set('selectedCapabilityId', $level->id)
            ->call('newCapability');

    }

    public function test_delete_capability_removes_it_correctly()
    {
        // Sembrar roles y datos necesarios
        $this->seed(RoleAndPermissionSeeder::class);
        $this->seed(DatabaseSeeder::class);

        // Crear un usuario y autenticarlo
        $user = User::first();
        $this->actingAs($user);

        // Crear un profesor
        $teacher = Teacher::factory()->create();

        // Crear una habilidad y un nivel de habilidad
        $capability = Capability::create(['name' => 'Mathematics', 'capability_type_id' => 1]);
        $level = CapabilityLevel::create(['name' => 'Advanced', 'capability_id' => $capability->id]);

        // Asociar una capacidad al profesor
        $teacherCapability = TeacherCapabilities::create([
            'teacher_id' => $teacher->id,
            'capability_level_id' => $level->id,
        ]);

        // Asegurarse de que la capacidad fue creada
        $this->assertDatabaseHas('teacher_capabilities', [
            'id' => $teacherCapability->id,
            'teacher_id' => $teacher->id,
            'capability_level_id' => $level->id,
        ]);

        // Probar el componente Livewire
        Livewire::test(TeacherEdit::class, ['teacher' => $teacher])
            ->call('deleteCapability', $teacherCapability->id)
            ->assertSet('isOpen', false)
            ->assertEmitted('capabilitiesDeleted');

        // Asegurarse de que la capacidad fue eliminada de la base de datos
        $this->assertDatabaseMissing('teacher_capabilities', [
            'id' => $teacherCapability->id,
        ]);
    }

}
