<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KpiRating extends Model
{
    protected $fillable = [
        'appraisal_id', 'kpi_template_id', 'rating', 'comments',
        'manager_rating', 'manager_comments'
    ];

    public function appraisal(): BelongsTo
    {
        return $this->belongsTo(Appraisal::class);
    }

    public function kpiTemplate(): BelongsTo
    {
        return $this->belongsTo(KpiTemplate::class);
    }
}
