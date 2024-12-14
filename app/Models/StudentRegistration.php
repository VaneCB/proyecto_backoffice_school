<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentRegistration extends Model
{
    use HasFactory;

    protected $table = 'student_registrations';
    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
        'student_id',
        'extracurricular_activity_id'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');

    }

    public function extracurricular_activity()
    {
        return $this->belongsTo(ExtracurricularActivity::class, 'extracurricular_actvity_id', 'id');
    }

}
