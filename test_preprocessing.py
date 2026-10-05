import pytest
import numpy as np
import soundfile as sf
import tempfile
import os
from app.ml.preprocessing import validate_audio_file, preprocess_audio, AudioValidationError


def test_validate_and_preprocess_audio():
    # Create a temporary WAV file with synthetic sine wave
    sr = 22050
    duration = 2.0
    t = np.linspace(0, duration, int(sr * duration))
    signal = 0.5 * np.sin(2 * np.pi * 440 * t)

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp_path = tmp.name
        sf.write(tmp_path, signal, sr)

    try:
        # Validate
        info = validate_audio_file(tmp_path)
        assert info["duration"] >= 1.9
        assert info["file_size"] > 0

        # Preprocess
        proc_signal, proc_sr = preprocess_audio(tmp_path, target_sr=sr)
        assert proc_sr == 22050
        assert len(proc_signal) > 0
        assert np.max(np.abs(proc_signal)) <= 1.0
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_invalid_file_handling():
    with pytest.raises(AudioValidationError):
        validate_audio_file("non_existent_file.wav")
