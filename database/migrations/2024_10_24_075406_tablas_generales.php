<?php

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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname1');
            $table->string('surname2')->nullable();
            $table->string('phone');
            $table->string('email');
            $table->string('address');
            $table->string('parent_name');
            $table->string('nif_parent')->unique();
            $table->string('course');
            $table->timestamps();
        });

        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname1');
            $table->string('surname2')->nullable();
            $table->string('phone');
            $table->string('email');
            $table->string('address');
            $table->string('photo')->nullable();
            $table->string('observations')->nullable();
            $table->timestamps();
        });

        Schema::create('extracurricular_activities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->string('course');
            $table->integer('classes');
            $table->integer('teacher_id')->nullable();
            $table->integer('material_id')->nullable();
            $table->integer('rate_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('extracurricular_activities');
    }
};
