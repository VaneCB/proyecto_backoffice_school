<?php

use App\Models\Capability;
use App\Models\CapabilityType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('capability_types', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
        });

        //insertamos los tipos de capacidades
        CapabilityType::upsert([
            ['id' => 1, 'name' => 'Idiomas'],
            ['id' => 2, 'name' => 'Estudios'],
        ], ['id']);

        //creamos la tabla capabilities
        Schema::create('capabilities', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->foreignId('capability_type_id')->constrained('capability_types');
        });


        Schema::create('capability_levels', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->foreignId('capability_id')->constrained('capabilities');
        });

        Schema::create('teacher_capabilities', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->bigInteger('teacher_id')->unsigned();
            $table->foreignId('capability_level_id')->constrained('capability_levels');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capability_types');
        Schema::dropIfExists('capability_levels');
        Schema::dropIfExists('capabilities');
    }
};
