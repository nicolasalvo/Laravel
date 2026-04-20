<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index()
    {
        return Message::with('user')->latest()->take(50)->get()->reverse()->values();
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $message = auth()->user()->messages()->create([
            'content' => $request->input('content'),
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return $message->load('user');
    }
}
