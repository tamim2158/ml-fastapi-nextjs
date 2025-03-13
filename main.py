 
from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

app = FastAPI()

MODEL_PATH = "model.pkl"

@app.post("/learn")
async def learn(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file)

        if df.shape[1] < 2:
            raise HTTPException(status_code=400, detail="CSV must have at least two columns")

        X = df.iloc[:, :-1]  
        y = df.iloc[:, -1]   

        if y.dtype == 'O':  
            le = LabelEncoder()
            y = le.fit_transform(y)
            joblib.dump(le, "label_encoder.pkl")

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        joblib.dump(model, MODEL_PATH)

        return {"message": "Model trained successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/ask")
async def ask(q: str):
    try:
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(status_code=400, detail="Model not trained yet.")

        model = joblib.load(MODEL_PATH)

        data = [float(i) for i in q.split(",")]
        prediction = model.predict([data])

        if os.path.exists("label_encoder.pkl"):
            le = joblib.load("label_encoder.pkl")
            prediction = le.inverse_transform(prediction)

        return {"prediction": prediction.tolist()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
