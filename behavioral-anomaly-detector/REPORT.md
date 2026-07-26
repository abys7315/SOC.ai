# Behavioral Anomaly Detection System Report
**Deliverable 7: Assumptions, Metrics, and Known Limitations**

## 1. Behavioral Assumptions

### Synthetic Data Generation Taxonomy
Real-world access logs suffer from extreme class imbalance, privacy restrictions, and formatting inconsistency. To rigorously evaluate the detection system, synthetic data was generated based on specific behavioral assumptions mimicking enterprise IT/OT environments:

- **Habitual Baselines**: We assume legitimate users and service accounts exhibit diurnal patterns (e.g., standard working hours 09:00 - 17:00). Service accounts exhibit machine-like periodicity (e.g., cron jobs executing every 60 minutes), while human users exhibit high variance in session duration.
- **Geographic Velocity**: Legitimate users operate within consistent geographic regions. The system assumes a maximum physical travel velocity. Anomalies are injected when concurrent or rapid successive logins occur from geographically impossible distances (e.g., New York and Beijing within 10 minutes).
- **Resource Clustering**: Entities interact with a finite cluster of resources. Lateral movement is simulated when a compromised entity suddenly interacts with a broad, disjoint set of high-sensitivity resources (e.g., a standard user suddenly accessing `ssh` and `scp` endpoints on a database server).

## 2. Metrics & Imbalance Handling

### Extreme Class Imbalance Strategies
In our dataset, true anomalies represent roughly ~2% of all access events. Standard accuracy metrics (e.g., 98% accuracy) are dangerously misleading, as a model predicting purely "normal" would achieve 98%.

To counteract this, the system employs the following:
1. **Weighted Cross-Entropy**: During model training, the loss function penalizes false negatives exponentially more than false positives. The `normal` class receives a weight of `0.1`, while `anomaly` classes receive a weight of `10.0`. 
2. **Evaluation Metrics**: The primary metric for evaluation is **Recall (Sensitivity)** on the minority classes and **F1-Score**.
3. **Analyst Alert Budget**: We assume SOC analysts suffer from alert fatigue. The threshold for flagging an event is dynamically adjustable, targeting a realistic false positive rate capped at the top 1% of events.

## 3. Known Limitations & Future Work

### 1. Scaling vs. Distributed Streaming
**Limitation**: The current prototype leverages a monolithic FastAPI deployment that processes events in sequence. 
**Future Work**: In a production environment, the event ingestion layer must be decoupled using a message broker (e.g., Apache Kafka or RabbitMQ) and processed by horizontally scaled worker nodes.

### 2. Complex Cold-Start Scenarios
**Limitation**: The system currently mitigates the cold-start problem by defaulting new entities to a population-level `IsolationForest` baseline. However, if a new user belongs to a highly specialized role (e.g., Domain Admin), they might be incorrectly flagged by the general population baseline.
**Future Work**: Implement Role-Based baseline clustering. New users inherit the baseline representation of their assigned Active Directory group before building their own unique profile.

### 3. Concept Drift Granularity
**Limitation**: Legitimate behavior evolves over time (e.g., an employee moves to a new country). While our Human-in-the-Loop active learning module adjusts risk thresholds based on SOC analyst feedback ("Reject False Positive"), it does not physically retrain the sequence model's weights in real-time.
**Future Work**: Implement a scheduled nightly retraining pipeline that incrementally fine-tunes the GRU weights on the latest rolling 30-day window of verified benign behavior.
