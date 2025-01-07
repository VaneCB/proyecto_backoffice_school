<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExtracurricularActivity extends Model
{
    use HasFactory;

    protected $table = 'extracurricular_activities';
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
        'name',
        'description',
        'course',
        'classes',
        'teacher_id',
        'material_id',
        'rate_id'
    ];

    protected $casts = [
        'created_at' => 'datetime:d/m/Y H:i:s',
        'updated_at' => 'datetime:d/m/Y H:i:s',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'id');
    }

    public function material()
    {
        return $this->belongsTo(Material::class, 'material_id', 'id');
    }

    public function rate()
    {
        return $this->belongsTo(Rate::class, 'rate_id', 'id');
    }

    public function registrations()
    {
        return $this->hasMany(StudentRegistration::class, 'extracurricular_activity_id', 'id');
    }

}
