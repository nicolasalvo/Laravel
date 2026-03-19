<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::where('is_published', true)
            ->with(['creator' => function ($query) {
                $query->select('id', 'name');
            }])
            ->latest()
            ->get();
            
        return response()->json($games);
    }
}
