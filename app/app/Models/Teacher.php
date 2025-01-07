<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $table = 'teachers';
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'surname1',
        'surname2',
        'phone',
        'email',
        'address',
        'photo',
        'observations',
    ];

    protected $casts = [
        'created_at' => 'datetime:d/m/Y H:i:s',
        'updated_at' => 'datetime:d/m/Y H:i:s',
    ];

    public function teacherCapabilities()
    {
        return $this->hasMany(TeacherCapabilities::class, 'teacher_id', 'id');
    }

    public function extracurricularActivities()
    {
        return $this->hasMany(ExtracurricularActivity::class, 'teacher_id', 'id');
    }
}
