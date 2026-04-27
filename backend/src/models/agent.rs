use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Agent {
    pub id: String,
    pub user_id: String,
    pub name: String,
    pub ip: String,
    pub ssh_key_content: String,
    pub gateway_token: String,
    pub model: String,
    pub accent: String,
    pub description: Option<String>,
    pub created_at: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AgentStatus {
    pub id: String,
    pub name: String,
    pub ip: String,
    pub model: String,
    pub accent: String,
    pub description: Option<String>,
    pub active: bool,
    pub pid: Option<u32>,
    pub uptime: Option<String>,
    pub last_log_lines: Vec<String>,
    pub created_at: String,
    // ssh_key_content and gateway_token are NEVER included in this struct
}

#[derive(Deserialize)]
pub struct CreateAgentRequest {
    pub name: String,
    pub ip: String,
    pub ssh_key_content: String,
    pub gateway_token: String,
    pub model: Option<String>,
    pub accent: Option<String>,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateAgentRequest {
    pub name: Option<String>,
    pub model: Option<String>,
    pub accent: Option<String>,
    pub description: Option<String>,
}
