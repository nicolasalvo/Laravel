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
        result = DeepFace.verify(
            img1_path=img1_path,
            img2_path=img2_path,
            model_name="Facenet",
            detector_backend="opencv",
            enforce_detection=True
        )
        os.remove(img1_path)
        os.remove(img2_path)
        
        distance = float(result["distance"])
        is_verified = bool(result["verified"])

        return JSONResponse(content={
            "verified": is_verified, 
            "distance": distance
        })
    except ValueError as ve:
        # Se activa si enforce_detection=True no encuentra un rostro humano
        if os.path.exists(img1_path): os.remove(img1_path)
        if os.path.exists(img2_path): os.remove(img2_path)
        return JSONResponse(content={"verified": False, "distance": 1.0, "error": "No se ha detectado ningún rostro claramente."})
    except Exception as e:
        if os.path.exists(img1_path): os.remove(img1_path)
        if os.path.exists(img2_path): os.remove(img2_path)
        return JSONResponse(status_code=500, content={"error": str(e)})

# Para iniciar: uvicorn face_service:app --port 8000
