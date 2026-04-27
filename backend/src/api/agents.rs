use axum::{extract::{Path, State}, http::StatusCode, response::Json, Extension};
use serde::Deserialize;
use serde_json::{json, Value};
use uuid::Uuid;

use crate::{
    db::{agents, DbPool},
    models::{agent::{Agent, AgentStatus, CreateAgentRequest, UpdateAgentRequest}, user::User},
    ssh::{client::SshClient, commands},
};

#[derive(Deserialize)]
pub struct CommandRequest {
    pub command: String,
}

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
        accent: body.accent.unwrap_or_else(|| "rose".to_string()),
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

pub async fn run_command(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
    Json(body): Json<CommandRequest>,
) -> Result<Json<Value>, StatusCode> {
    let command = body.command.trim();
    if command.is_empty() || command.len() > 4000 {
        return Err(StatusCode::BAD_REQUEST);
    }
    let agent = get_agent_or_404(&pool, &id, &user.id)?;
    let client = SshClient::new(&agent.ip, &agent.pem_content).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let (success, stdout, stderr) = client.run(command);
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    agents::log_activity(&conn, &Uuid::new_v4().to_string(), &user.id, Some(&id), "command_run", Some(command))
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!({ "success": success, "stdout": stdout, "stderr": stderr })))
}

pub async fn get_channels(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let config = read_agent_config(&pool, &id, &user.id)?;
    let channels = config.get("channels")
        .or_else(|| config.get("telegram"))
        .or_else(|| config.get("discord"))
        .cloned()
        .unwrap_or(json!([]));
    Ok(Json(json!({ "channels": channels })))
}

pub async fn get_plugins(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let config = read_agent_config(&pool, &id, &user.id).unwrap_or(json!({}));
    let from_config = config.get("plugins").cloned().unwrap_or(json!([]));
    if from_config.as_array().map(|a| !a.is_empty()).unwrap_or(false) {
        return Ok(Json(json!({ "plugins": from_config, "source": "config" })));
    }

    let agent = get_agent_or_404(&pool, &id, &user.id)?;
    let client = SshClient::new(&agent.ip, &agent.pem_content).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let (_, logs, _) = client.run("journalctl --user -u openclaw-gateway.service -n 300 --no-pager 2>/dev/null | grep -i plugin | tail -50");
    let plugins: Vec<Value> = logs.lines()
        .filter(|line| !line.trim().is_empty())
        .map(|line| json!({ "name": line.trim(), "status": "observed" }))
        .collect();
    Ok(Json(json!({ "plugins": plugins, "source": "logs" })))
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

fn read_agent_config(pool: &DbPool, id: &str, user_id: &str) -> Result<Value, StatusCode> {
    let agent = get_agent_or_404(pool, id, user_id)?;
    let client = SshClient::new(&agent.ip, &agent.pem_content).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let content = client.read_file("/home/ubuntu/.openclaw/openclaw.json").ok_or(StatusCode::BAD_GATEWAY)?;
    serde_json::from_str(&content).map_err(|_| StatusCode::BAD_GATEWAY)
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
