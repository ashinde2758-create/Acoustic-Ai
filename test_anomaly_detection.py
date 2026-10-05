import pytest
import numpy as np
from app.ml.anomaly_detection import IsolationForestAnomalyDetector


def test_anomaly_detection_with_and_without_baseline():
    detector = IsolationForestAnomalyDetector()

    test_features = {
        "RMS_Energy_Mean": 0.08,
        "Spectral_Centroid_Mean": 2000.0,
        "Zero_Crossing_Rate_Mean": 0.04,
        "Spectral_Rolloff_Mean": 3800.0,
        "MFCC_1_Mean": -10.0,
        "MFCC_2_Mean": 5.0
    }

    # Evaluate without baseline
    res_no_base = detector.predict(test_features, baseline_info=None)
    assert 0.0 <= res_no_base["health_score"] <= 100.0
    assert 0.0 <= res_no_base["anomaly_score"] <= 1.0
    assert res_no_base["status"] in ["Healthy", "Warning", "Critical"]

    # Evaluate with baseline
    keys = sorted(test_features.keys())
    mean_vec = np.array([test_features[k] for k in keys])
    std_vec = np.array([0.01, 100.0, 0.005, 150.0, 1.0, 0.5])
    matrix = np.array([mean_vec, mean_vec + 0.001, mean_vec - 0.001])

    baseline_info = {
        "sample_count": 3,
        "status": "Established",
        "keys": keys,
        "matrix": matrix,
        "mean_vector": mean_vec,
        "std_vector": std_vec
    }

    res_base = detector.predict(test_features, baseline_info=baseline_info)
    assert res_base["health_score"] >= 80.0  # Should be high health score for matching features
    assert res_base["anomaly_score"] < 0.3
    assert "explanation" in res_base
    assert "recommendations" in res_base
