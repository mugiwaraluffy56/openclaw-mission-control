use axum::{extract::{Path, State}, http::StatusCode, response::Json, Extension};
use serde_json::{json, Value};
use uuid::Uuid;

use crate::{
    db::{agents, DbPool},
    models::{agent::{Agent, AgentStatus, CreateAgentRequest, UpdateAgentRequest}, user::User},
    ssh::{client::SshClient, commands},
};

pub async fn list(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
) -> Result<Json<Value>, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let list = agents::list_by_user(&conn, &user.id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    drop(conn);
    let statuses: Vec<AgentStatus> = list.iter().map(get_agent_status).collect();
    Ok(Json(json!(statuses)))
}

pub async fn create(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Json(body): Json<CreateAgentRequest>,
) -> Result<Json<Value>, StatusCode> {
    let agent = Agent {
        id: Uuid::new_v4().to_string(),
        user_id: user.id.clone(),
        name: body.name,
        ip: body.ip,
        pem_content: body.pem_content,
        gateway_token: body.gateway_token,
        model: body.model.unwrap_or_else(|| "unknown".to_string()),
        accent: body.accent.unwrap_or_else(|| "violet".to_string()),
        description: body.description,
        created_at: chrono::Utc::now().to_rfc3339(),
    };
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    agents::create(&conn, &agent).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    agents::log_activity(&conn, &Uuid::new_v4().to_string(), &user.id, Some(&agent.id), "agent_created", Some(&agent.name))
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    drop(conn);
    let status = get_agent_status(&agent);
    Ok(Json(json!(status)))
}

pub async fn get(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let agent = get_agent_or_404(&pool, &id, &user.id)?;
    let status = get_agent_status(&agent);
    Ok(Json(json!(status)))
}

pub async fn update(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
    Json(body): Json<UpdateAgentRequest>,
) -> Result<Json<Value>, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    agents::update(&conn, &id, &user.id,
        body.name.as_deref(), body.model.as_deref(),
        body.accent.as_deref(), body.description.as_deref(),
    ).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!({ "success": true })))
}

pub async fn delete(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    agents::delete(&conn, &id, &user.id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!({ "success": true })))
}

pub async fn restart(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let agent = get_agent_or_404(&pool, &id, &user.id)?;
    let client = SshClient::new(&agent.ip, &agent.pem_content).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let ok = commands::restart(&client);
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    agents::log_activity(&conn, &Uuid::new_v4().to_string(), &user.id, Some(&id), "restart", None)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!({ "success": ok })))
}

pub async fn stop(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let agent = get_agent_or_404(&pool, &id, &user.id)?;
    let client = SshClient::new(&agent.ip, &agent.pem_content).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let ok = commands::stop(&client);
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    agents::log_activity(&conn, &Uuid::new_v4().to_string(), &user.id, Some(&id), "stop", None)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!({ "success": ok })))
}

pub async fn start_agent(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let agent = get_agent_or_404(&pool, &id, &user.id)?;
    let client = SshClient::new(&agent.ip, &agent.pem_content).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let ok = commands::start(&client);
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    agents::log_activity(&conn, &Uuid::new_v4().to_string(), &user.id, Some(&id), "start", None)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!({ "success": ok })))
}

pub async fn get_config(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let agent = get_agent_or_404(&pool, &id, &user.id)?;
    let client = SshClient::new(&agent.ip, &agent.pem_content).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let content = client.read_file("/home/ubuntu/.openclaw/openclaw.json").ok_or(StatusCode::BAD_GATEWAY)?;
    let parsed: Value = serde_json::from_str(&content).unwrap_or(json!({}));
    Ok(Json(parsed))
}

pub async fn update_config(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
    Json(body): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    let agent = get_agent_or_404(&pool, &id, &user.id)?;
    let client = SshClient::new(&agent.ip, &agent.pem_content).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let content = serde_json::to_string_pretty(&body).map_err(|_| StatusCode::BAD_REQUEST)?;
    let ok = client.write_file("/home/ubuntu/.openclaw/openclaw.json", &content);
    if ok {
        commands::restart(&client);
        let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        agents::log_activity(&conn, &Uuid::new_v4().to_string(), &user.id, Some(&id), "config_updated", None)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }
    Ok(Json(json!({ "success": ok })))
}

pub async fn get_sessions(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let agent = get_agent_or_404(&pool, &id, &user.id)?;
    let client = SshClient::new(&agent.ip, &agent.pem_content).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let content = client.read_file("/home/ubuntu/.openclaw/agents/main/sessions/sessions.json").unwrap_or_else(|| "{}".to_string());
    let parsed: Value = serde_json::from_str(&content).unwrap_or(json!({}));
    Ok(Json(parsed))
}

pub async fn get_stats(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let agent = get_agent_or_404(&pool, &id, &user.id)?;
    let client = SshClient::new(&agent.ip, &agent.pem_content).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let stats = commands::get_system_stats(&client);
    Ok(Json(stats))
}

pub async fn get_activity(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
) -> Result<Json<Value>, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let activity = agents::get_activity(&conn, &user.id, 50).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!(activity)))
}

fn get_agent_or_404(pool: &DbPool, id: &str, user_id: &str) -> Result<Agent, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    agents::find(&conn, id, user_id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)
}

fn get_agent_status(agent: &Agent) -> AgentStatus {
    let client = SshClient::new(&agent.ip, &agent.pem_content);
    let (active, pid, uptime, logs) = client.map(|c| {
        let active = commands::is_active(&c);
        let pid = commands::get_pid(&c);
        let uptime = commands::get_uptime(&c);
        let logs = if active { commands::get_recent_logs(&c, 5) } else { vec![] };
        (active, pid, uptime, logs)
    }).unwrap_or((false, None, None, vec![]));

    AgentStatus {
        id: agent.id.clone(),
        name: agent.name.clone(),
        ip: agent.ip.clone(),
        model: agent.model.clone(),
        accent: agent.accent.clone(),
        description: agent.description.clone(),
        active,
        pid,
        uptime,
        last_log_lines: logs,
        created_at: agent.created_at.clone(),
    }
}
