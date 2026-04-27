use axum::{extract::State, http::StatusCode, response::Json, Extension};
use serde::Deserialize;
use serde_json::{json, Value};

use crate::{db::{workspace, DbPool}, models::user::User};

#[derive(Deserialize)]
pub struct InviteRequest {
    pub email: String,
    pub role: String,
}

pub async fn list(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
) -> Result<Json<Value>, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let org_id = workspace::ensure_org(&conn, &user.id, &user.email, &user.name).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let members = workspace::list_team(&conn, &org_id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(json!(members)))
}

pub async fn invite(
    State(pool): State<DbPool>,
    Extension(user): Extension<User>,
    Json(body): Json<InviteRequest>,
) -> Result<Json<Value>, StatusCode> {
    if !body.email.contains('@') {
        return Err(StatusCode::BAD_REQUEST);
    }
    let role = match body.role.as_str() {
        "owner" | "admin" | "operator" | "viewer" | "member" => body.role,
        _ => "member".to_string(),
    };
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let org_id = workspace::ensure_org(&conn, &user.id, &user.email, &user.name).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let member = workspace::invite_member(&conn, &org_id, &body.email, &role, &user.id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(member))
}
