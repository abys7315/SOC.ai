import argparse
import pandas as pd
import numpy as np
import time
import json
import requests
from datetime import datetime, timedelta
from faker import Faker
import random
from typing import Dict, List, Any, Optional

fake = Faker()

# Behavior Types
NORMAL = "normal"
BRUTE_FORCE = "brute_force"
IMPOSSIBLE_TRAVEL = "impossible_travel"
CREDENTIAL_STUFFING = "credential_stuffing"
LATERAL_MOVEMENT = "lateral_movement"
DEVICE_SPOOFING = "device_spoofing"
LOW_AND_SLOW = "low_and_slow"
INSIDER_DRIFT = "insider_drift"

ANOMALY_TYPES = [
    BRUTE_FORCE, IMPOSSIBLE_TRAVEL, CREDENTIAL_STUFFING, 
    LATERAL_MOVEMENT, DEVICE_SPOOFING, LOW_AND_SLOW, INSIDER_DRIFT
]

class EventGenerator:
    """
    Generates synthetic access logs and injects predefined behavioral anomalies.
    
    This class models baseline habitual behaviors for entities (users, devices, service accounts)
    and allows for controlled injection of 7 specific anomaly taxonomy classes to evaluate
    the sequence models in a highly imbalanced dataset scenario.
    """
    
    def __init__(self, num_entities: int = 200) -> None:
        self.num_entities = num_entities
        self.entities = self._generate_entity_profiles()
        
    def _generate_entity_profiles(self) -> Dict[str, Dict[str, Any]]:
        """Generates unique statistical profiles for each entity."""
        profiles = {}
        entity_types = ['user', 'service_account', 'edge_device']
        for i in range(self.num_entities):
            e_type = random.choices(entity_types, weights=[0.7, 0.1, 0.2])[0]
            if e_type == 'user':
                e_id = f"usr_{fake.uuid4()[:8]}"
            elif e_type == 'service_account':
                e_id = f"svc_{fake.uuid4()[:8]}"
            else:
                e_id = f"dev_{fake.uuid4()[:8]}"
                
            profiles[e_id] = {
                'entity_type': e_type,
                'typical_hour': random.randint(7, 18) if e_type == 'user' else None,
                'geo_locations': [fake.country() for _ in range(random.randint(1, 3))],
                'source_ips': [fake.ipv4() for _ in range(random.randint(1, 4))],
                'resources': [f"res_{random.randint(1, 50)}" for _ in range(random.randint(3, 10))],
                'auth_methods': ['password', 'token', 'certificate', 'biometric'],
                'base_fingerprint': f"{fake.user_agent()}_{fake.mac_address()}"
            }
        return profiles

    def _generate_normal_event(self, timestamp: datetime, entity_id: Optional[str] = None) -> Dict[str, Any]:
        """Generates a baseline, benign access event based on the entity's profile."""
        if entity_id is None:
            entity_id = random.choice(list(self.entities.keys()))
        
        profile = self.entities[entity_id]
        
        return {
            'entity_id': entity_id,
            'entity_type': profile['entity_type'],
            'timestamp': timestamp.isoformat(),
            'source_ip': random.choice(profile['source_ips']),
            'geo_location': random.choice(profile['geo_locations']),
            'resource_accessed': random.choice(profile['resources']),
            'auth_method': random.choice(profile['auth_methods']),
            'session_duration': max(0.1, random.gauss(300, 100)), # seconds
            'command_sequence': ["login", "read"] if profile['entity_type'] == 'user' else ["sync"],
            'device_fingerprint': profile['base_fingerprint'],
            'label': NORMAL
        }

    def generate_batch(self, days: int = 30) -> pd.DataFrame:
        """
        Generates a Pandas DataFrame containing historically simulated events 
        with extreme class imbalance injected automatically.
        """
        start_time = datetime.now() - timedelta(days=days)
        events = []
        current_time = start_time
        
        # ~100 events per day per entity on average? Too much for local. Let's do ~1000 events total per day.
        events_per_day = 1000
        total_events = days * events_per_day
        
        print(f"Generating ~{total_events} events...")
        for _ in range(total_events):
            current_time += timedelta(minutes=random.randint(1, 5))
            
            # Inject anomalies at 2% rate
            if random.random() < 0.02:
                anomaly_type = random.choice(ANOMALY_TYPES)
                events.extend(self._inject_anomaly(anomaly_type, current_time))
            else:
                events.append(self._generate_normal_event(current_time))
                
        df = pd.DataFrame(events)
        df.sort_values('timestamp', inplace=True)
        return df

    def _inject_anomaly(self, anomaly_type: str, timestamp: datetime) -> List[Dict[str, Any]]:
        """Synthesizes specific attack taxonomy vectors."""
        events = []
        target_entity = random.choice(list(self.entities.keys()))
        profile = self.entities[target_entity]
        
        if anomaly_type == BRUTE_FORCE:
            # Rapid failed auth attempts
            ip = fake.ipv4()
            for i in range(10):
                ev = self._generate_normal_event(timestamp + timedelta(seconds=i), target_entity)
                ev['source_ip'] = ip
                ev['label'] = BRUTE_FORCE
                events.append(ev)
                
        elif anomaly_type == IMPOSSIBLE_TRAVEL:
            ev1 = self._generate_normal_event(timestamp, target_entity)
            ev2 = self._generate_normal_event(timestamp + timedelta(minutes=10), target_entity)
            ev1['geo_location'] = "New York, USA"
            ev2['geo_location'] = "Beijing, China"
            ev1['label'] = IMPOSSIBLE_TRAVEL
            ev2['label'] = IMPOSSIBLE_TRAVEL
            events.extend([ev1, ev2])
            
        elif anomaly_type == CREDENTIAL_STUFFING:
            ip = fake.ipv4()
            for _ in range(20):
                ent = random.choice(list(self.entities.keys()))
                ev = self._generate_normal_event(timestamp + timedelta(seconds=random.randint(1,60)), ent)
                ev['source_ip'] = ip
                ev['label'] = CREDENTIAL_STUFFING
                events.append(ev)
                
        elif anomaly_type == LATERAL_MOVEMENT:
            # Compromised entity accessing unusual sequence of resources
            for i in range(5):
                ev = self._generate_normal_event(timestamp + timedelta(minutes=i*2), target_entity)
                ev['resource_accessed'] = f"sensitive_res_{random.randint(100,200)}"
                ev['command_sequence'] = ["ls", "cat", "copy", "scp"]
                ev['label'] = LATERAL_MOVEMENT
                events.append(ev)
                
        elif anomaly_type == DEVICE_SPOOFING:
            ev = self._generate_normal_event(timestamp, target_entity)
            ev['device_fingerprint'] = f"UNKNOWN_OS_{fake.mac_address()}"
            ev['label'] = DEVICE_SPOOFING
            events.append(ev)
            
        elif anomaly_type == LOW_AND_SLOW:
            # Gradual access over off hours
            for i in range(10):
                ev = self._generate_normal_event(timestamp + timedelta(hours=i*12), target_entity)
                ev['resource_accessed'] = "db_dump_chunk"
                ev['label'] = LOW_AND_SLOW
                events.append(ev)
                
        elif anomaly_type == INSIDER_DRIFT:
            ev = self._generate_normal_event(timestamp, target_entity)
            ev['resource_accessed'] = "new_project_repo"
            ev['label'] = INSIDER_DRIFT
            events.append(ev)
            
        return events

    def stream_live(self, target_url: str = "http://localhost:8000/score") -> None:
        """Streams generated data via HTTP POST for real-time demo scenarios."""
        print(f"Streaming live events to {target_url}...")
        import os
        signal_file = "data/generated/injection_signal.json"
        
        while True:
            current_time = datetime.now()
            
            # Check for injection signal
            injected_events = []
            if os.path.exists(signal_file):
                try:
                    with open(signal_file, "r") as f:
                        signal = json.load(f)
                    anomaly_type = signal.get("anomaly_type")
                    if anomaly_type in ANOMALY_TYPES:
                        print(f"!!! INJECTING ATTACK: {anomaly_type} !!!")
                        injected_events = self._inject_anomaly(anomaly_type, current_time)
                    os.remove(signal_file)
                except Exception as e:
                    print(f"Failed to process injection signal: {e}")
            
            # Randomly generate anomalies sometimes so the dashboard isn't empty
            if not injected_events and random.random() < 0.05:
                random_anomaly = random.choice(ANOMALY_TYPES)
                injected_events = self._inject_anomaly(random_anomaly, current_time)
                
            # Decide what to send
            events_to_send = injected_events if injected_events else [self._generate_normal_event(current_time)]
            
            for event in events_to_send:
                try:
                    payload = {k: v for k, v in event.items() if k != 'label'}
                    res = requests.post(target_url, json=payload)
                    # print(f"Sent event for {event['entity_id']}: {res.status_code}")
                except Exception as e:
                    print(f"Failed to send event: {e}")
                time.sleep(0.1) # small delay between injected events
                
            time.sleep(random.uniform(0.5, 2.0))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--entities', type=int, default=200)
    parser.add_argument('--days', type=int, default=30)
    parser.add_argument('--stream', action='store_true')
    args = parser.parse_args()

    gen = EventGenerator(num_entities=args.entities)
    
    if args.stream:
        gen.stream_live()
    else:
        df = gen.generate_batch(days=args.days)
        import os
        os.makedirs('data/generated', exist_ok=True)
        out_path = 'data/generated/synthetic_data.csv'
        df.to_csv(out_path, index=False)
        print(f"Saved {len(df)} events to {out_path}")
        print("Anomaly counts:")
        print(df['label'].value_counts())
