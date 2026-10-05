import pytest
import numpy as np
from app.ml.feature_extraction import extract_acoustic_features, generate_waveform_points


def test_feature_extraction():
    sr = 22050
    t = np.linspace(0, 1.0, sr)
    signal = 0.5 * np.sin(2 * np.pi * 1000 * t) + 0.1 * np.random.randn(sr)

    result = extract_acoustic_features(signal, sr)
    
    assert "feature_vector" in result
    assert "feature_dict" in result
    assert "feature_groups" in result
    
    f_dict = result["feature_dict"]
    assert "RMS_Energy_Mean" in f_dict
    assert "Spectral_Centroid_Mean" in f_dict
    assert "Zero_Crossing_Rate_Mean" in f_dict
    assert "MFCC_1_Mean" in f_dict

    # Waveform peaks check
    peaks = generate_waveform_points(signal, num_points=50)
    assert len(peaks) == 50
    assert all(0.0 <= p <= 1.0 for p in peaks)
