# 🛠️ BeamGuard AI - Structural Failure Prediction System

BeamGuard AI is a full-stack, rule-driven system that predicts structural failure for beams and columns using engineering safety metrics. It provides real-time, explainable insights with a premium React dashboard and a Flask-powered analytical engine.

## 🌟 Features
- **Deterministic Engineering Engine**: Precise stress and slenderness calculations.
- **Material Library**: Presets for Steel, Concrete, Titanium, and Timber.
- **Dynamic Visualization**: Live animated beam deformation and stress-performance curves.
- **Vercel Optimized**: Ready for instant deployment as a unified full-stack app.

---

## 🚀 Deployment (Vercel)

This project is configured for a seamless **Vercel** deployment (Frontend + Serverless Python API).

1. **Push to GitHub**: Push this entire directory to a new GitHub repository.
2. **Connect to Vercel**:
    - Go to [Vercel](https://vercel.com) and click **"New Project"**.
    - Import your GitHub repository.
3. **Configure Settings**:
    - **Build Command**: `cd frontend && npm install && npm run build`
    - **Output Directory**: `frontend/dist`
    - **Install Command**: `pip install -r requirements.txt` (Vercel handles this automatically).
4. **Deploy**: Click deploy. Vercel will serve the React app and route `/api/*` requests to the Flask engine.

---

## 💻 Local Development

### 1. Start the Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Runs at `http://localhost:5001`*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Runs at `http://localhost:5173`*

---

## 🧠 Engineering Logic
- **Stress**: $\sigma = (Load / Area)$
- **Safety Factor**: $Strength / Stress$
- **Slenderness (Columns)**: $Length / \sqrt{Area}$ (Unit balanced)

---

## ⚖️ Disclaimer
This tool uses simplified structural models for educational and preliminary screening purposes. It is NOT a replacement for professional engineering software (FEA) or a certified structural engineer's manual review.
