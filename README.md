# AcoustiGuard AI

### AI-Powered Acoustic Predictive Maintenance Platform

**Academic Project Title:** Acoustic AI System for Predictive Maintenance Using Machine Sound Signature Analysis  
**Application Name:** AcoustiGuard AI

---

## 📌 Project Overview

**AcoustiGuard AI** is a complete, full-stack, working AI predictive maintenance application designed to monitor industrial machinery (motors, pumps, ventilation fans, gearboxes, compressors, conveyors) using acoustic sound signatures captured through low-cost microphones.

Instead of relying on expensive, invasive contact vibration sensors or hardwired telemetry, AcoustiGuard AI captures machine sound emissions, preprocesses the signal, extracts multi-dimensional spectral audio features, compares them against custom per-machine baseline models, and detects abnormal acoustic behavior using an unsupervised **Isolation Forest** machine learning algorithm combined with **Mahalanobis acoustic vector distance metrics**.

---

## 🚀 Key Features

- **Industrial AI Dashboard:** Real-time summary KPIs (Total Equipment, Healthy, Warning, Critical Anomalies, Total Inspections, Average Fleet Health Score) and equipment monitoring cards.
- **Equipment Management (CRUD):** Add, edit, delete, and inspect machines with custom machine type support (Motor, Pump, Fan, Compressor, Gearbox, Conveyor, or Custom).
- **Dual Audio Capture Workflow:**
  - **Option A (File Upload):** Drag & drop WAV, MP3, FLAC, M4A, or OGG audio files with automatic format & size validation.
  - **Option B (Live Microphone):** Record directly from the browser microphone API with a real-time HTML5 Canvas visualizer and Web Audio API PCM 16-bit WAV encoder.
- **8-Stage Backend AI Pipeline:**
  1. Audio capture & validation
  2. Audio preprocessing (22.05 kHz resampling, mono conversion, amplitude normalization)
  3. Feature extraction (13 MFCCs, RMS Energy, Zero Crossing Rate, Spectral Centroid, Bandwidth, Rolloff, Spectral Contrast, Chroma STFT)
  4. 57-dimensional acoustic signature vector creation
  5. Machine baseline collection (accumulates 3–10 normal recordings per machine)
  6. Isolation Forest anomaly detection & vector distance calculation
  7. Calibrated 0–100 Health Score & explainable AI feedback citing specific acoustic feature shifts
  8. Actionable advisory maintenance recommendations
- **Visualizations:** Real-time Canvas waveform peak visualizer and STFT frequency spectrogram image rendering.
- **Historical Analytics:** Recharts trend graphs for Health Score vs Time, Anomaly Score vs Time, RMS Energy vs Time, and Spectral Centroid vs Time.
- **Report Generation & Export:** Professional report-style analysis view with print/PDF export and batch CSV history download.
- **Academic AI Transparency:** Clearly reports **"Acoustic Anomaly Detected"** without fabricating unverified mechanical fault classifications or artificial accuracy numbers.
- **Extensible ML Model Architecture:** Includes abstract base class `PredictiveMaintenanceModel` for dropping in supervised fault classifiers when labeled dataset samples become available.
- **Demo Seed Mechanism:** One-click instant seeding of fictional machines (Motor-01, Pump-01, Cooling-Fan-01, Conveyor-01) with historical acoustic readings.

---

## 🏗️ System Architecture

```
[ Industrial Machine Sound Emission ]
                 │
                 ▼
 [ Microphone Recording / File Upload ] ──► (Web Audio API PCM 16-bit WAV Encoder)
                 │
                 ▼
    [ FastAPI Backend REST API ] ──► [ Preprocessing ] (22.05 kHz Resampling, Mono)
                 │
                 ▼
    [ Acoustic Feature Extractor ] ──► (MFCC, RMS, ZCR, Centroid, Bandwidth, Rolloff, Contrast, Chroma)
                 │
                 ▼
   [ Machine Baseline Manager ] ──► [ Isolation Forest + Vector Distance Engine ]
                 │                                      │
                 └───────────────────┬──────────────────┘
                                     ▼
                        [ Health Score (0-100) ]
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
    [ SQLite / SQLAlchemy DB ]              [ React + Tailwind AI Dashboard ]
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS v4 (Dark Industrial AI Design System with glassmorphism & glow effects)
- **Charts & Icons:** Recharts + Lucide-React
- **HTTP Client:** Axios
- **Audio Processing:** HTML5 Web Audio API, Canvas API, MediaRecorder PCM WAV encoder

### Backend
- **Framework:** Python 3.10+ + FastAPI + Uvicorn
- **Database Layer:** SQLAlchemy ORM (SQLite for dev, PostgreSQL compatible)
- **Validation:** Pydantic v2
- **Audio Processing & ML:** `librosa`, `NumPy`, `SciPy`, `scikit-learn`, `soundfile`, `matplotlib`
- **Testing:** `pytest`

---

## 📂 Project Structure

```
Acoustic Ai/
├── backend/
│   ├── app/
│   │   ├── api/             # REST API Routers (machines, audio, analysis, dashboard, demo)
│   │   ├── database/        # SQLAlchemy engine, session, and ORM models
│   │   ├── ml/              # Audio preprocessing, feature extraction, baseline manager, anomaly detector
│   │   ├── models/          # Pydantic request/response validation schemas
│   │   ├── services/        # Audio pipeline orchestration service
│   │   ├── config.py        # Central settings, paths, & sampling rates
│   │   └── main.py          # FastAPI application entry point
│   ├── tests/               # Pytest suite for ML modules & API endpoints
│   ├── uploads/             # Audio storage directory (/audio/{machine_id}/{date}/)
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client wrapper
│   │   ├── components/      # UI components (Navbar, Sidebar, HealthGauge, AudioRecorder, AudioUploader, Waveform, FeatureChart)
│   │   ├── pages/           # Pages (Landing, Dashboard, Machines, MachineDetail, AudioAnalysis, Result, Reports, Settings, About)
│   │   ├── types/           # TypeScript data interfaces
│   │   ├── App.tsx          # Root application component
│   │   └── index.css        # Tailwind CSS imports & custom dark industrial styles
│   ├── package.json
│   └── vite.config.ts       # Vite proxy & Tailwind plugin setup
├── .env.example             # Example environment configuration
├── README.md                # Project documentation
└── implementation_plan.md   # Architectural implementation plan
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.10+ installed
- Node.js v18+ installed

### 1. Clone & Setup Backend

```powershell
# Navigate to project root
cd "Acoustic Ai"

# Create Python virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r backend/requirements.txt
```

### 2. Start Backend Server

```powershell
# Run FastAPI server on port 8000
$env:PYTHONPATH="backend"; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Health Check: `http://localhost:8000/`
- Interactive Swagger API Documentation: `http://localhost:8000/docs`

### 3. Setup & Start Frontend Server

Open a second terminal window:

```powershell
cd "Acoustic Ai/frontend"

# Install npm packages
npm install

# Start Vite development server
npm run dev
```
Open web application in browser: `http://localhost:5173`

---

## 🧪 Running Automated Tests

Run backend unit tests for signal preprocessing, feature extraction, and Isolation Forest anomaly detection:

```powershell
$env:PYTHONPATH="backend"; .\venv\Scripts\python.exe -m pytest
```

---

## 💡 AI Pipeline Explanation

1. **Preprocessing:** Audio clips are loaded via `librosa`, resampled to a consistent 22,050 Hz sampling rate, converted to single-channel mono, and min-max normalized to `[-1.0, 1.0]`.
2. **Feature Extraction:** 8 spectral & time-domain features are computed:
   - 13 MFCCs (means & standard deviations)
   - RMS Energy (mean, std, max)
   - Zero Crossing Rate (ZCR)
   - Spectral Centroid (mean brightness frequency in Hz)
   - Spectral Bandwidth
   - Spectral Rolloff (85% energy frequency threshold)
   - Spectral Contrast (7 frequency sub-bands)
   - Chroma STFT (12 pitch classes)
3. **Machine Baseline Vector:** For each machine, multiple normal recordings build a statistical mean vector ($\mu$) and standard deviation envelope ($\sigma$).
4. **Anomaly Scoring:** An Isolation Forest model evaluates test samples alongside normalized vector distance ($Z$-scores and Cosine distance from machine baseline) to derive an Anomaly Score ($0.0 \rightarrow 1.0$) and a calibrated Health Score ($0 \rightarrow 100$).

---

## 📌 Disclaimers & Future Scope

- **Academic Scope:** Designed as an academic computer engineering predictive-maintenance system. Health scores reflect learned acoustic baseline deviations.
- **Future Expansion:** The ML abstraction layer (`PredictiveMaintenanceModel`) supports dropping in trained supervised fault classifiers (e.g. `BEARING_FAULT`, `MOTOR_FAULT`, `GEAR_FAULT`) when labeled industrial acoustic datasets become available.
