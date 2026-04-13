<?php

namespace App\Models;

use Database\Factories\InvoiceItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    /** @use HasFactory<InvoiceItemFactory> */
    use HasFactory;

    protected static function booted()
    {
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

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
