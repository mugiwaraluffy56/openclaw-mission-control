use axum::{extract::State, http::StatusCode, response::Json, Extension};
use serde::Deserialize;
use serde_json::{json, Value};

use crate::{db::{workspace, DbPool}, models::user::User};

#[derive(Deserialize)]
pub struct NotificationRequest {
    pub event_type: String,
    pub destination: String,
    pub enabled: Option<bool>,
    pub threshold: Option<String>,
}

pub async fn list(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
) -> Result<Json<Value>, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let rules = workspace::list_notifications(&conn, &user.id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!(rules)))
}

pub async fn create(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Json(body): Json<NotificationRequest>,
) -> Result<Json<Value>, StatusCode> {
    if body.event_type.trim().is_empty() || body.destination.trim().is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let rule = workspace::create_notification(
        &conn,
        &user.id,
        &body.event_type,
        &body.destination,
        body.enabled.unwrap_or(true),
        body.threshold.as_deref(),
    ).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(rule))
}
