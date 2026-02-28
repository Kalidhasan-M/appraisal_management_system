<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppraisalDocument extends Model
{
    protected $fillable = ['appraisal_id', 'name', 'path', 'original_name', 'mime_type', 'size'];

    public function appraisal(): BelongsTo
    {
        return $this->belongsTo(Appraisal::class);
    }
}
