<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /** @var Collection<int, User> $users */
        $users = User::query()
            ->whereIn('email', [
                'user.a@example.com',
                'user.b@example.com',
            ])
            ->orderBy('id')
            ->get();

        foreach ($users as $index => $user) {
            $firstNumber = ($index * 2) + 1;
            $secondNumber = $firstNumber + 1;

            $user->invoices()->updateOrCreate(
                ['invoice_number' => 'INV-'.str_pad((string) $firstNumber, 4, '0', STR_PAD_LEFT)],
                [
                    'due_date' => now()->addDays(fake()->numberBetween(-14, 60))->toDateString(),
                    'status' => fake()->numberBetween(0, 2),
                    'subtotal' => 100,
                    'gst' => 10,
                    'total' => 110,
                ],
            );

            $user->invoices()->updateOrCreate(
                ['invoice_number' => 'INV-'.str_pad((string) $secondNumber, 4, '0', STR_PAD_LEFT)],
                [
                    'due_date' => now()->addDays(fake()->numberBetween(-14, 60))->toDateString(),
                    'status' => fake()->numberBetween(0, 2),
                    'subtotal' => 200,
                    'gst' => 20,
                    'total' => 220,
                ],
            );
        }
    }
}
