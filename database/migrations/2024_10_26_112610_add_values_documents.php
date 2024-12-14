<?php

use App\Models\Document;
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
        Document::upsert([
            ['id' => 1, 'name' => 'PhotoPersonal'],
            ['id' => 2, 'name' => 'PhotoUser'],
            ['id' => 3, 'name' => 'ContractTeacher'],
        ], ['id']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
