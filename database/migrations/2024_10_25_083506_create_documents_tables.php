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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('teacher_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->nullable();
            $table->foreignId('document_id')->nullable();
            $table->string('name');
            $table->string('url');
            $table->string('doc_url')->nullable();
            $table->string('doc_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
        Schema::dropIfExists('teacher_documents');
    }
};
