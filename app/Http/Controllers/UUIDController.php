<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class UUIDController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $documents = Document::query()
            ->select(['uuid', 'user_id', 'title'])
            ->get();

        return inertia('Documents/UUID', [
            'documents' => $documents,
        ]);
    }
}
