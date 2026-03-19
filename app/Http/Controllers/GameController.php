<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::with('creator')->latest()->get();
        return Inertia::render('Games/Index', ['games' => $games]);
    }

    public function create()
    {
        return Inertia::render('Games/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
            'url' => 'nullable|string|url',
        ]);

        $request->user()->games()->create($validated);

        return redirect()->route('games.index')->with('message', 'Game created successfully.');
    }

    public function show(Game $game)
    {
        return Inertia::render('Games/Preview', ['game' => $game]);
    }

    public function edit(Game $game)
    {
        return Inertia::render('Games/Edit', ['game' => $game]);
    }

    public function update(Request $request, Game $game)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
            'url' => 'nullable|string|url',
        ]);

        $game->update($validated);

        return redirect()->route('games.index')->with('message', 'Game updated successfully.');
    }

    public function destroy(Game $game)
    {
        $game->delete();
        return redirect()->route('games.index')->with('message', 'Game deleted successfully.');
    }
}
