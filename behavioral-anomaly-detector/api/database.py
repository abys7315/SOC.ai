import sqlite3
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

DB_PATH = "anomaly_detector.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Configuration Table (Key-Value for global settings)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    """)
    
    # Audit Logs Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            action TEXT NOT NULL,
            user TEXT NOT NULL,
            details TEXT NOT NULL
        )
    """)
    
    # Alerts Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            risk_score REAL NOT NULL,
            anomaly_type TEXT NOT NULL,
            explanation TEXT NOT NULL,
            event_details TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    # Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL,
            status TEXT NOT NULL,
            mfa_enabled BOOLEAN NOT NULL DEFAULT 0
        )
    """)

    # Detection Rules Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS detection_rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT 1
        )
    """)
    
    conn.commit()
    conn.close()
    logger.info("Database initialized successfully.")

# --- Config Management ---
def get_config():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT value FROM config WHERE key = 'global'")
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return json.loads(row['value'])
    return {} # Return empty if not found

def save_config(config_data: dict):
    conn = get_connection()
    cursor = conn.cursor()
    config_json = json.dumps(config_data)
    cursor.execute("""
        INSERT INTO config (key, value) VALUES ('global', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
    """, (config_json,))
    conn.commit()
    conn.close()

# --- Audit Logs ---
def add_audit_log(action: str, details: dict, user: str = "System"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO audit_logs (timestamp, action, user, details)
        VALUES (?, ?, ?, ?)
    """, (datetime.utcnow().isoformat(), action, user, json.dumps(details)))
    conn.commit()
    conn.close()

def get_audit_logs(limit: int = 100):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    logs = []
    for row in rows:
        logs.append({
            "id": row['id'],
            "timestamp": row['timestamp'],
            "action": row['action'],
            "user": row['user'],
            "details": json.loads(row['details'])
        })
    return logs

# --- Users ---
def get_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r['id'], "username": r['username'], "role": r['role'], "status": r['status'], "mfa_enabled": bool(r['mfa_enabled'])} for r in rows]

def create_user(username: str, role: str, status: str = "Active", mfa_enabled: bool = False):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO users (username, role, status, mfa_enabled)
            VALUES (?, ?, ?, ?)
        """, (username, role, status, int(mfa_enabled)))
        conn.commit()
    except sqlite3.IntegrityError:
        pass # Ignore duplicates for now
    finally:
        conn.close()

def delete_user(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

# --- Detection Rules ---
def get_rules():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM detection_rules")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r['id'], "name": r['name'], "description": r['description'], "risk_score": r['risk_score'], "enabled": bool(r['enabled'])} for r in rows]

def create_rule(name: str, description: str, risk_score: int, enabled: bool = True):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO detection_rules (name, description, risk_score, enabled)
        VALUES (?, ?, ?, ?)
    """, (name, description, risk_score, int(enabled)))
    conn.commit()
    conn.close()

def toggle_rule(rule_id: int, enabled: bool):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE detection_rules SET enabled = ? WHERE id = ?", (int(enabled), rule_id))
    conn.commit()
    conn.close()

# Initialize DB when module is imported
init_db()
