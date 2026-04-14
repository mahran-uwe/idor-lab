<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Database\Seeder;

class InvoiceItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::query()->get();

        if ($products->isEmpty()) {
            return;
        }

        $invoices = Invoice::query()->get();

        foreach ($invoices as $invoice) {
            $invoice->items()->delete();

            $invoice->items()->createMany([
                $this->buildLineItem($products->random()),
                $this->buildLineItem($products->random()),
            ]);
        }
    }

    /**
     * @return array{product_id:int, quantity:int, unit_price:float, line_total:float}
     */
    private function buildLineItem(Product $product): array
    {
        $quantity = random_int(1, 5);
        $unitPrice = (float) $product->price;

        return [
            'product_id' => $product->id,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'line_total' => $quantity * $unitPrice,
        ];
    }
}
