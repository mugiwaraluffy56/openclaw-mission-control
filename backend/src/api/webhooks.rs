use axum::{extract::{Path, State}, http::StatusCode, response::Json, Extension};
use serde::Deserialize;
use serde_json::{json, Value};

use crate::{db::{workspace, DbPool}, models::user::User};

#[derive(Deserialize)]
pub struct WebhookRequest {
    pub name: String,
    pub url: String,
    pub events: Value,
    pub secret: Option<String>,
    pub enabled: Option<bool>,
}

pub async fn list(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
) -> Result<Json<Value>, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let hooks = workspace::list_webhooks(&conn, &user.id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!(hooks)))
}

pub async fn create(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Json(body): Json<WebhookRequest>,
) -> Result<Json<Value>, StatusCode> {
    if !body.url.starts_with("https://") && !body.url.starts_with("http://localhost") {
        return Err(StatusCode::BAD_REQUEST);
    }
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let hook = workspace::create_webhook(
        &conn,
        &user.id,
        &body.name,
        &body.url,
        &body.events,
        body.secret.as_deref(),
        body.enabled.unwrap_or(true),
    ).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(hook))
}

pub async fn delete(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Path(id): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let deleted = workspace::delete_webhook(&conn, &user.id, &id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    if deleted == 0 {
        return Err(StatusCode::NOT_FOUND);
    }
    Ok(Json(json!({ "success": true })))
}
