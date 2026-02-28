<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Appraisal Report - {{ $appraisal->user->name }} - {{ $appraisal->year }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.5; color: #333; }
        h1 { color: #1e40af; font-size: 22px; margin-bottom: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
        h2 { color: #374151; font-size: 16px; margin-top: 25px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
        th { background: #f3f4f6; font-weight: 600; }
        .header-info { margin-bottom: 30px; }
        .header-info p { margin: 5px 0; }
        .status { padding: 4px 12px; border-radius: 4px; font-weight: 600; }
        .status-approved { background: #d1fae5; color: #065f46; }
        .status-rejected { background: #fee2e2; color: #991b1b; }
        .section { margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280; }
    </style>
</head>
<body>
    <h1>Annual Appraisal Report</h1>
    
    <div class="header-info">
        <p><strong>Employee:</strong> {{ $appraisal->user->name }}</p>
        <p><strong>Email:</strong> {{ $appraisal->user->email }}</p>
        <p><strong>Department:</strong> {{ $appraisal->user->department?->name ?? 'N/A' }}</p>
        <p><strong>Appraisal Year:</strong> {{ $appraisal->year }}</p>
        <p><strong>Status:</strong> <span class="status status-{{ $appraisal->status }}">{{ ucfirst($appraisal->status) }}</span></p>
        @if($appraisal->reviewer)
        <p><strong>Reviewed by:</strong> {{ $appraisal->reviewer->name }} on {{ $appraisal->reviewed_at?->format('M d, Y') }}</p>
        @endif
    </div>

    <h2>Self Assessment</h2>
    <div class="section">
        {!! nl2br(e($appraisal->self_assessment ?? 'No self assessment provided.')) !!}
    </div>

    <h2>KPI Ratings</h2>
    <table>
        <thead>
            <tr>
                <th>KPI</th>
                <th>Weight</th>
                <th>Employee Rating (1-5)</th>
                <th>Manager Rating (1-5)</th>
                <th>Manager Comments</th>
            </tr>
        </thead>
        <tbody>
            @foreach($appraisal->kpiRatings as $kr)
            <tr>
                <td>{{ $kr->kpiTemplate->name }}</td>
                <td>{{ $kr->kpiTemplate->weight }}%</td>
                <td>{{ $kr->rating }}</td>
                <td>{{ $kr->manager_rating ?? '-' }}</td>
                <td>{{ $kr->manager_comments ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <h2>Achievements</h2>
    @if($appraisal->achievements->isEmpty())
        <p>No achievements recorded.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                @foreach($appraisal->achievements as $ach)
                <tr>
                    <td>{{ $ach->title }}</td>
                    <td>{{ $ach->description ?? '-' }}</td>
                    <td>{{ $ach->date?->format('M d, Y') ?? '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if($appraisal->manager_comments)
    <h2>Manager Comments</h2>
    <div class="section">
        {!! nl2br(e($appraisal->manager_comments)) !!}
    </div>
    @endif

    @if($appraisal->manager_rating)
    <h2>Overall Manager Rating</h2>
    <p><strong>{{ $appraisal->manager_rating }}/5</strong></p>
    @endif

    <div class="footer">
        Generated on {{ now()->format('F d, Y H:i') }} | Appraisal Management System
    </div>
</body>
</html>
