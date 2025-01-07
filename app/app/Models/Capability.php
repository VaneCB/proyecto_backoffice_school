<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Capability extends Model
{
    use HasFactory;

    protected $table = 'capabilities';
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
        'name',
        'capability_type_id',
    ];

    protected $casts = [
        'created_at' => 'datetime:d/m/Y H:i:s',
        'updated_at' => 'datetime:d/m/Y H:i:s',
    ];

    public function capabilityType()
    {
        return $this->belongsTo(CapabilityType::class, 'capability_type_id');
    }

    public function capabilityLevels()
    {
        return $this->hasMany(CapabilityLevel::class, 'capability_id');
    }


}
