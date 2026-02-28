<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Appraisal extends Model
{
    protected $fillable = [
        'user_id', 'year', 'status', 'self_assessment',
        'manager_comments', 'manager_rating', 'reviewed_by', 'reviewed_at'
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function kpiRatings(): HasMany
    {
        return $this->hasMany(KpiRating::class);
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(AppraisalDocument::class, 'appraisal_id');
    }

    public function canEdit(): bool
    {
        return $this->status === 'draft';
    }

    public function canSubmit(): bool
    {
        return $this->status === 'draft';
    }

    public function canReview(): bool
    {
        return in_array($this->status, ['submitted', 'under_review']);
    }

    public function isCompleted(): bool
    {
        return in_array($this->status, ['approved', 'rejected']);
    }
}
