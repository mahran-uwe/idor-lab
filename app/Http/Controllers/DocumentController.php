<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $documents = Document::query()
            ->select(['id', 'user_id', 'title'])
            ->orderBy('id')
            ->get();

        return inertia('Documents/Index', [
            'documents' => $documents,
        ]);
    }
}
