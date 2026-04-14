<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class ProfileFaceController extends Controller
{
    public function index()
    {
        return Inertia::render('Profile/Index', [
            'user' => auth()->user()
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:10240', // 10MB max
        ]);

        $user = auth()->user();
        
        $path = $request->file('photo')->store('registerPics', 'public');

        if ($user->face_photo_path && Storage::disk('public')->exists($user->face_photo_path)) {
            Storage::disk('public')->delete($user->face_photo_path);
        }

        $user->face_photo_path = $path;
        $user->save();

        return redirect()->back()->with('success', 'Foto de registro subida correctamente.');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'validation_photo' => 'required|image|max:10240',
        ]);

        $user = auth()->user();

        if (!$user->face_photo_path || !Storage::disk('public')->exists($user->face_photo_path)) {
            return response()->json(['error' => 'No tienes una foto de registro. Ve a tu perfil y sube una primero.'], 400);
        }

        $registeredPhotoPath = Storage::disk('public')->path($user->face_photo_path);
        
        $validationPhoto = $request->file('validation_photo');
        $validationPhotoPath = $validationPhoto->getPathname();

        try {
            $response = Http::timeout(60)->attach(
                'foto1', file_get_contents($registeredPhotoPath), 'registered.jpg'
            )->attach(
                'foto2', file_get_contents($validationPhotoPath), 'validation.jpg'
            )->post('http://127.0.0.1:8001/verify');

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'Error de red con el modelo de verificación. Detalles: ' . $response->body()], 500);

        } catch (\Exception $e) {
            return response()->json(['error' => 'El servicio de validación facial no está en ejecución. Detalles: ' . $e->getMessage()], 500);
        }
    }
}
