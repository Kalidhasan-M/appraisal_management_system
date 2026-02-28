<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KpiTemplate extends Model
{
    protected $fillable = ['name', 'description', 'weight'];

    public function kpiRatings(): HasMany
    {
        return $this->hasMany(KpiRating::class);
    }
}
