<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/logout', function () {
    \Illuminate\Support\Facades\Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout.get');

Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::post('/posts', [PostController::class, 'store'])->middleware('auth')->name('posts.store');
Route::get('/posts/create', [PostController::class, 'create'])->middleware('auth')->name('posts.create');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->middleware('auth')->name('posts.edit');
Route::put('/posts/{post}', [PostController::class, 'update'])->middleware('auth')->name('posts.update');
Route::delete('/posts/{post}', [PostController::class, 'destroy'])->middleware('auth')->name('posts.destroy');
Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->middleware('auth')->name('comments.store');

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        $games = \App\Models\Game::with('creator')->where('is_published', true)->get();
        return \Inertia\Inertia::render('Dashboard', [
            'games' => $games
        ]);
    })->name('dashboard');

    Route::get('/play', function () {
        return \Inertia\Inertia::render('Play/Index');
    })->name('play.index');

    // Face Profile Routes
    Route::get('/profile', [\App\Http\Controllers\ProfileFaceController::class, 'index'])->name('profile.index');
    Route::post('/profile/face-photo', [\App\Http\Controllers\ProfileFaceController::class, 'upload'])->name('profile.face.upload');
    Route::post('/verify-face', [\App\Http\Controllers\ProfileFaceController::class, 'verify'])->name('face.verify');

    Route::resource('admin/games', \App\Http\Controllers\GameController::class)
        ->middleware('role:Administrador,Gestor');
});


