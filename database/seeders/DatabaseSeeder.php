<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProductSeeder::class,
        ]);
        
        $users = ['User A', 'User B', 'Super Admin'];
        foreach ($users as $user) {
            $user = User::factory()->create([
                'name' => $user,
                'email' => strtolower(str_replace(' ', '.', $user)).'@example.com',
            ]);

            $user->documents()->createMany([
                [
                    'title' => 'Document 1 for '.$user->name,
                    'path' => storage_path('app/demo/documents/Sample Document.pdf'),
                ],
                [
                    'title' => 'Document 2 for '.$user->name,
                    'path' => storage_path('app/demo/documents/Sample Document.pdf'),
                ],
            ]);

            $invoices = $user->invoices()->createMany([
                [
                    'invoice_number' => 'INV-'.str_pad($user->id * 2 - 1, 4, '0', STR_PAD_LEFT),
                    'due_date' => now()->addDays(30),
                    'status' => 0,
                    'subtotal' => 100,
                    'gst' => 10,
                    'total' => 110,
                ],
                [
                    'invoice_number' => 'INV-'.str_pad($user->id * 2, 4, '0', STR_PAD_LEFT),
                    'due_date' => now()->addDays(30),
                    'status' => 0,
                    'subtotal' => 200,
                    'gst' => 20,
                    'total' => 220,
                ],
            ]);

            foreach ($invoices as $invoice) {
                $invoice->items()->createMany([
                    [
                        'product_id' => ($product = Product::inRandomOrder()->first())->id,
                        'quantity' => $quantity = rand(1, 5),
                        'unit_price' => $product->price,
                        'line_total' => $quantity * $product->price,
                    ],
                    [
                        'product_id' => ($product = Product::inRandomOrder()->first())->id,
                        'quantity' => $quantity = rand(1, 5),
                        'unit_price' => $product->price,
                        'line_total' => $quantity * $product->price,
                    ],
                ]);
            }
        }
    }
}
