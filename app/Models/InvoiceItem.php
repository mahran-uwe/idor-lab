<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    /** @use HasFactory<InvoiceItemFactory> */
    use HasFactory;

    protected static function booted()
    {
        static::saving(function ($item) {
            $item->line_total = $item->quantity * $item->unit_price;
        });

        $updateTotal = function ($item) {
            $invoice = $item->invoice;
            $newSubtotal = $invoice->items()->sum('line_total');

            $gst = $newSubtotal * 0.08;

            $invoice->update([
                'subtotal' => $newSubtotal,
                'gst' => $gst,
                'total' => $newSubtotal + $gst,
            ]);
        };

        // Trigger on every change
        static::saved($updateTotal);
        static::deleted($updateTotal);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
