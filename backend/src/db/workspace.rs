use rusqlite::{params, Connection, OptionalExtension};
use serde_json::{json, Value};

pub fn ensure_org(conn: &Connection, user_id: &str, email: &str, name: &str) -> rusqlite::Result<String> {
    if let Some(id) = conn.query_row(
        "SELECT id FROM organizations WHERE owner_user_id = ?1 ORDER BY created_at LIMIT 1",
        params![user_id],
        |row| row.get::<_, String>(0),
    ).optional()? {
        return Ok(id);
    }

    let id = uuid::Uuid::new_v4().to_string();
    let slug_base = email.split('@').next().unwrap_or("workspace").replace(|c: char| !c.is_ascii_alphanumeric(), "-");
    let slug = format!("{}-{}", slug_base.to_lowercase(), &id[..8]);
    conn.execute(
        "INSERT INTO organizations (id, owner_user_id, name, slug, plan) VALUES (?1, ?2, ?3, ?4, 'free')",
        params![id, user_id, format!("{}'s Workspace", name), slug],
    )?;
    conn.execute(
        "INSERT INTO team_members (id, org_id, user_id, email, name, role, status, invited_by) VALUES (?1, ?2, ?3, ?4, ?5, 'owner', 'active', ?3)",
        params![uuid::Uuid::new_v4().to_string(), id, user_id, email, name],
    )?;
    Ok(id)
}

pub fn list_webhooks(conn: &Connection, user_id: &str) -> rusqlite::Result<Vec<Value>> {
    let mut stmt = conn.prepare("SELECT id, name, url, events, secret, enabled, created_at FROM webhooks WHERE user_id = ?1 ORDER BY created_at DESC")?;
    let rows = stmt.query_map(params![user_id], |row| Ok(json!({
        "id": row.get::<_, String>(0)?,
        "name": row.get::<_, String>(1)?,
        "url": row.get::<_, String>(2)?,
        "events": serde_json::from_str::<Value>(&row.get::<_, String>(3)?).unwrap_or(json!([])),
        "secret": row.get::<_, Option<String>>(4)?,
        "enabled": row.get::<_, i64>(5)? == 1,
        "created_at": row.get::<_, String>(6)?,
    })))?;
    rows.collect()
}

pub fn create_webhook(conn: &Connection, user_id: &str, name: &str, url: &str, events: &Value, secret: Option<&str>, enabled: bool) -> rusqlite::Result<Value> {
    let id = uuid::Uuid::new_v4().to_string();
    let events_text = serde_json::to_string(events).unwrap_or_else(|_| "[]".to_string());
    conn.execute(
        "INSERT INTO webhooks (id, user_id, name, url, events, secret, enabled) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![id, user_id, name, url, events_text, secret, if enabled { 1 } else { 0 }],
    )?;
    Ok(json!({ "id": id, "name": name, "url": url, "events": events, "secret": secret, "enabled": enabled }))
}

pub fn delete_webhook(conn: &Connection, user_id: &str, id: &str) -> rusqlite::Result<usize> {
    conn.execute("DELETE FROM webhooks WHERE id = ?1 AND user_id = ?2", params![id, user_id])
}

pub fn list_notifications(conn: &Connection, user_id: &str) -> rusqlite::Result<Vec<Value>> {
    let mut stmt = conn.prepare("SELECT id, event_type, destination, enabled, threshold, created_at FROM notification_rules WHERE user_id = ?1 ORDER BY event_type")?;
    let rows = stmt.query_map(params![user_id], |row| Ok(json!({
        "id": row.get::<_, String>(0)?,
        "event_type": row.get::<_, String>(1)?,
        "destination": row.get::<_, String>(2)?,
        "enabled": row.get::<_, i64>(3)? == 1,
        "threshold": row.get::<_, Option<String>>(4)?,
        "created_at": row.get::<_, String>(5)?,
    })))?;
    rows.collect()
}

pub fn create_notification(conn: &Connection, user_id: &str, event_type: &str, destination: &str, enabled: bool, threshold: Option<&str>) -> rusqlite::Result<Value> {
    let id = uuid::Uuid::new_v4().to_string();
    conn.execute(
        "INSERT INTO notification_rules (id, user_id, event_type, destination, enabled, threshold) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![id, user_id, event_type, destination, if enabled { 1 } else { 0 }, threshold],
    )?;
    Ok(json!({ "id": id, "event_type": event_type, "destination": destination, "enabled": enabled, "threshold": threshold }))
}

pub fn list_team(conn: &Connection, org_id: &str) -> rusqlite::Result<Vec<Value>> {
    let mut stmt = conn.prepare("SELECT id, email, name, role, status, created_at FROM team_members WHERE org_id = ?1 ORDER BY role DESC, created_at ASC")?;
    let rows = stmt.query_map(params![org_id], |row| Ok(json!({
        "id": row.get::<_, String>(0)?,
        "email": row.get::<_, String>(1)?,
        "name": row.get::<_, Option<String>>(2)?,
        "role": row.get::<_, String>(3)?,
        "status": row.get::<_, String>(4)?,
        "created_at": row.get::<_, String>(5)?,
    })))?;
    rows.collect()
}

pub fn invite_member(conn: &Connection, org_id: &str, email: &str, role: &str, invited_by: &str) -> rusqlite::Result<Value> {
    let id = uuid::Uuid::new_v4().to_string();
    conn.execute(
        "INSERT INTO team_members (id, org_id, email, role, status, invited_by) VALUES (?1, ?2, ?3, ?4, 'pending', ?5)",
        params![id, org_id, email, role, invited_by],
    )?;
    Ok(json!({ "id": id, "email": email, "role": role, "status": "pending" }))
}
