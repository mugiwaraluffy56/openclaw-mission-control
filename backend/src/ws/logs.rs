use axum::{
    extract::{ws::{Message, WebSocket, WebSocketUpgrade}, Path, State, Query},
    http::StatusCode,
    response::Response,
};
use serde::Deserialize;
use std::io::{BufRead, BufReader};

use crate::{auth::jwt::verify, db::{agents, DbPool}};

#[derive(Deserialize)]
pub struct LogQuery {
    pub token: Option<String>,
}

pub async fn ws_logs(
    Path(id): Path<String>,
    Query(q): Query<LogQuery>,
    State(pool): State<DbPool>,
    ws: WebSocketUpgrade,
) -> Result<Response, StatusCode> {
    let token = q.token.ok_or(StatusCode::UNAUTHORIZED)?;
    let claims = verify(&token).ok_or(StatusCode::UNAUTHORIZED)?;
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let agent = agents::find(&conn, &id, &claims.sub)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;
    drop(conn);

    Ok(ws.on_upgrade(move |socket| stream_logs(socket, agent.ip, agent.pem_content)))
}

async fn stream_logs(mut socket: WebSocket, ip: String, pem_content: String) {
    let client = match crate::ssh::client::SshClient::new(&ip, &pem_content) {
        Some(c) => c,
        None => return,
    };
    let mut child = match client.spawn_log_stream() {
        Some(c) => c,
        None => return,
    };
    if let Some(stdout) = child.stdout.take() {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            match line {
                Ok(l) => { if socket.send(Message::Text(l.into())).await.is_err() { break; } }
                Err(_) => break,
            }
        }
    }
    let _ = child.kill();
}
