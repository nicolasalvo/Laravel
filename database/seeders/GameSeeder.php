<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;
use App\Models\User;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $creator = User::where('name', 'Nicolas Oxovi')->first() ?? User::where('email', 'nico@nico.nico')->first() ?? User::first();
        $creatorId = $creator ? $creator->id : null;

        Game::truncate();

        $games = [
            [
                'title' => 'Slope',
                'description' => 'Juego de carreras 3D',
                'is_published' => true,
                'image_url' => '../../../Files/CaratulaSlope.png',
                'url' => '/games/slope/index.html',
                'user_id' => $creatorId,
            ],
            [
                'title' => 'Snake 3D',
                'description' => 'Clásico reinventado',
                'is_published' => false,
                'image_url' => '../../../Files/CaratulaSnake.png',
                'url' => '',
                'user_id' => $creatorId,
            ],
            [
                'title' => 'Tetris Max',
                'description' => 'Desafío mental',
                'is_published' => false,
                'image_url' => '../../../Files/CaratulaTetris.png',
                'url' => '',
                'user_id' => $creatorId,
            ],
            [
                'title' => 'Space Invaders',
                'description' => 'Acción espacial',
                'is_published' => false,
                'image_url' => '../../../Files/CaratulaSpaceInvaders.png',
                'url' => '',
                'user_id' => $creatorId,
            ],
            [
                'title' => 'Geometry Dash',
                'description' => 'Juego de estrategia 3D',
                'is_published' => false,
                'image_url' => '../../../Files/CaratulaGeometryDash.png',
                'url' => '',
                'user_id' => $creatorId,
            ],
        ];

        foreach ($games as $game) {
            Game::create($game);
        }
    }
}
