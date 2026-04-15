<?php

namespace App\Models;

use Database\Factories\DocumentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Document extends Model
{
    /** @use HasFactory<DocumentFactory> */
    use HasFactory;

    protected $hidden = ['path'];

    protected static function booted()
    {
        static::creating(function (Document $document) {
            $document->uuid = (string) Str::uuid();
        });
    }
}
