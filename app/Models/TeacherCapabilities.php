<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherCapabilities extends Model
{
    use HasFactory;

    protected $table = 'teacher_capabilities';
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'teacher_id',
        'capability_level_id'
    ];

    protected $casts = [
        'created_at' => 'datetime:d/m/Y H:i:s',
        'updated_at' => 'datetime:d/m/Y H:i:s',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function capabilityLevel()
    {
        return $this->belongsTo(CapabilityLevel::class);
    }
}
