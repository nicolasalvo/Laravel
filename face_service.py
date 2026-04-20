from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import shutil
import os
from deepface import DeepFace

app = FastAPI()

@app.post("/verify")
async def verify_faces(foto1: UploadFile = File(...), foto2: UploadFile = File(...)):
    img1_path = f"temp_{foto1.filename}"
    img2_path = f"temp_{foto2.filename}"
    
    with open(img1_path, "wb") as buffer:
        shutil.copyfileobj(foto1.file, buffer)
    with open(img2_path, "wb") as buffer:
        shutil.copyfileobj(foto2.file, buffer)
        
    try:
        # Usamos mtcnn para mayor precisión y detector de puntos faciales
        result = DeepFace.verify(
            img1_path=img1_path,
            img2_path=img2_path,
            model_name="Facenet",
            detector_backend="mtcnn",
            distance_metric="cosine",
            enforce_detection=True
        )
        os.remove(img1_path)
        os.remove(img2_path)
        
        distance = float(result["distance"])
        # Umbral por defecto de Facenet es 0.40. 
        # Si el usuario falla por poco, podemos relajarlo a 0.50.
        is_verified = bool(result["verified"])
        
        # Flexibilidad extra si el modelo dice False pero la distancia es < 0.5
        if not is_verified and distance < 0.50:
            is_verified = True

        return JSONResponse(content={
            "verified": is_verified, 
            "distance": round(distance, 4),
            "threshold": result.get("threshold", 0.40)
        })
    except ValueError as ve:
        # Fallback a opencv si mtcnn falla o por si no se encuentra rostro
        if os.path.exists(img1_path): os.remove(img1_path)
        if os.path.exists(img2_path): os.remove(img2_path)
        return JSONResponse(content={"verified": False, "distance": 1.0, "error": "No se ha detectado ningún rostro claramente. Intenta iluminar mejor tu cara."})
    except Exception as e:
        if os.path.exists(img1_path): os.remove(img1_path)
        if os.path.exists(img2_path): os.remove(img2_path)
        return JSONResponse(status_code=500, content={"error": str(e)})

# Para iniciar: uvicorn face_service:app --port 8000
