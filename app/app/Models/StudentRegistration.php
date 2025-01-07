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
        'extracurricular_activity_id',
        'status'
    ];

    // Constantes para los estados
    public const STATUS_PENDING = 0;
    public const STATUS_ACCEPTED = 1;
    public const STATUS_REJECTED = 2;

    public static function getStatusOptions()
    {
        return [
            self::STATUS_PENDING => 'Pendiente',
            self::STATUS_ACCEPTED => 'Aceptado',
            self::STATUS_REJECTED => 'Rechazado',
        ];
    }

    public function getStatusTextAttribute()
    {
        return self::getStatusOptions()[$this->status] ?? 'Desconocido';
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');

    }

    public function extracurricular_activity()
    {
        return $this->belongsTo(ExtracurricularActivity::class, 'extracurricular_activity_id', 'id');
    }

}
