<?php

namespace Tests\Feature;

use App\Http\Livewire\RatesTable;
use App\Http\Livewire\Teachers\TeacherEdit;
use App\Models\Teacher;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Livewire\Livewire;
use Tests\TestCase;

class RateTableTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_it_sets_up_the_table_correctly()
    {
        $table = new RatesTable();

        // Verifica la configuración inicial
        $this->assertEquals('rates.create', $table->addRoute);
        $this->assertContains(['Ver', 'fas fa-eye', 'rates.show'], $table->actionCol);
        $this->assertContains(['Editar', 'fas fa-edit', 'rates.edit'], $table->actionCol);
        $this->assertContains(['Borrar', 'far fa-trash-alt', 'rates.delete'], $table->actionColDelete);
        $this->assertFalse($table->idCheckbox);
        $this->assertTrue($table->showFilters);
        $this->assertTrue($table->showOrders);
        $this->assertEquals(['name' => '', 'price'], $table->filters);
    }

    /** @test */
    public function test_it_returns_the_correct_columns()
    {
        $table = new RatesTable();

        $columns = $table->columns();

        $this->assertCount(2, $columns);
        $this->assertEquals('name', $columns[0]->key);
        $this->assertEquals('Nombre', $columns[0]->label);
        $this->assertEquals('price', $columns[1]->key);
        $this->assertEquals('Precio', $columns[1]->label);
    }
}
