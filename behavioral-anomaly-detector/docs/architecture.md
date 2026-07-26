# AI-Powered Behavioral Anomaly Detection Architecture

## Overview
This system detects behavioral anomalies in access logs in near real-time by establishing a baseline for user, service account, and device behavior.

## Components
- **Data Generator**: Simulates realistic enterprise access patterns and injects 8 specific anomaly types.
- **Sequence Encoder**: LSTM-based model capturing the sequential nature of authentication and access events.
- **Anomaly Classifier**: Classifies anomalies into predefined attack categories.
- **Explainability Layer**: Maps feature attributions to natural language.
- **Dashboard**: Streamlit interface for live monitoring and attack simulation.

## Synthetic Data Generation Assumptions
The synthetic data generator (`data/generator.py`) builds behavioral profiles per entity with the following assumptions:
1. **Entity Distribution**: 70% users, 10% service accounts, 20% edge devices.
2. **Temporal Patterns**: Users have typical working hours (e.g., 7 AM to 6 PM), while service accounts operate continuously or on scheduled intervals.
3. **Geographic & Network Footprint**: Each entity operates from a small pool of typical IP addresses and geographic locations.
4. **Resource Access**: Entities interact with a predefined subset of resources based on their role.
5. **Anomaly Injection Rates**: Anomalies are injected into the standard event stream at approximately a 2% rate to simulate realistic class imbalance.

## Injected Anomaly Types
- `brute_force`: Rapid repeated failed auths.
- `impossible_travel`: Geographically distant logins within a short timeframe.
- `credential_stuffing`: Wide-scale failed attempts from a single source.
- `lateral_movement`: Accessing unusual resource sequences.
- `device_spoofing`: Reappearing entity with a mismatched device fingerprint.
- `low_and_slow`: Gradual unauthorized access over time.
- `insider_drift`: Slow expansion of privilege footprint.
