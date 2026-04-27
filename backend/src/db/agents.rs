use rusqlite::{params, Connection, OptionalExtension};
use crate::models::agent::Agent;

pub fn create(conn: &Connection, agent: &Agent) -> rusqlite::Result<()> {
    conn.execute(
        "INSERT INTO agents (id, user_id, name, ip, pem_content, gateway_token, model, accent, description) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)",
        params![agent.id, agent.user_id, agent.name, agent.ip, agent.pem_content, agent.gateway_token, agent.model, agent.accent, agent.description],
    )?;
    Ok(())
}

pub fn list_by_user(conn: &Connection, user_id: &str) -> rusqlite::Result<Vec<Agent>> {
    let mut stmt = conn.prepare(
        "SELECT id, user_id, name, ip, pem_content, gateway_token, model, accent, description, created_at FROM agents WHERE user_id = ?1 ORDER BY created_at DESC"
    )?;
    let rows = stmt.query_map(params![user_id], |row| Ok(Agent {
        id: row.get(0)?,
        user_id: row.get(1)?,
        name: row.get(2)?,
        ip: row.get(3)?,
        pem_content: row.get(4)?,
        gateway_token: row.get(5)?,
        model: row.get(6)?,
        accent: row.get(7)?,
        description: row.get(8)?,
        created_at: row.get(9)?,
    }))?;
    rows.collect()
}

pub fn find(conn: &Connection, id: &str, user_id: &str) -> rusqlite::Result<Option<Agent>> {
    conn.query_row(
        "SELECT id, user_id, name, ip, pem_content, gateway_token, model, accent, description, created_at FROM agents WHERE id = ?1 AND user_id = ?2",
        params![id, user_id],
        |row| Ok(Agent {
            id: row.get(0)?,
            user_id: row.get(1)?,
            name: row.get(2)?,
            ip: row.get(3)?,
            pem_content: row.get(4)?,
            gateway_token: row.get(5)?,
            model: row.get(6)?,
            accent: row.get(7)?,
            description: row.get(8)?,
            created_at: row.get(9)?,
        }),
    ).optional()
}

pub fn delete(conn: &Connection, id: &str, user_id: &str) -> rusqlite::Result<usize> {
    conn.execute("DELETE FROM agents WHERE id = ?1 AND user_id = ?2", params![id, user_id])
}

pub fn update(conn: &Connection, id: &str, user_id: &str, name: Option<&str>, model: Option<&str>, accent: Option<&str>, description: Option<&str>) -> rusqlite::Result<()> {
    if let Some(n) = name { conn.execute("UPDATE agents SET name=?1 WHERE id=?2 AND user_id=?3", params![n, id, user_id])?; }
    if let Some(m) = model { conn.execute("UPDATE agents SET model=?1 WHERE id=?2 AND user_id=?3", params![m, id, user_id])?; }
    if let Some(a) = accent { conn.execute("UPDATE agents SET accent=?1 WHERE id=?2 AND user_id=?3", params![a, id, user_id])?; }
    if let Some(d) = description { conn.execute("UPDATE agents SET description=?1 WHERE id=?2 AND user_id=?3", params![d, id, user_id])?; }
    Ok(())
}

pub fn log_activity(conn: &Connection, id: &str, user_id: &str, agent_id: Option<&str>, action: &str, detail: Option<&str>) -> rusqlite::Result<()> {
    conn.execute(
        "INSERT INTO activity_log (id, user_id, agent_id, action, detail) VALUES (?1,?2,?3,?4,?5)",
        params![id, user_id, agent_id, action, detail],
    )?;
    Ok(())
}

pub fn get_activity(conn: &Connection, user_id: &str, limit: i64) -> rusqlite::Result<Vec<serde_json::Value>> {
    let mut stmt = conn.prepare(
        "SELECT al.id, al.action, al.detail, al.created_at, a.name as agent_name FROM activity_log al LEFT JOIN agents a ON a.id = al.agent_id WHERE al.user_id = ?1 ORDER BY al.created_at DESC LIMIT ?2"
    )?;
    let rows = stmt.query_map(params![user_id, limit], |row| {
        Ok(serde_json::json!({
            "id": row.get::<_,String>(0)?,
            "action": row.get::<_,String>(1)?,
            "detail": row.get::<_,Option<String>>(2)?,
            "created_at": row.get::<_,String>(3)?,
            "agent_name": row.get::<_,Option<String>>(4)?,
        }))
    })?;
    rows.collect()
}
