use axum::{extract::State, http::StatusCode, response::Json};
use serde_json::{json, Value};
use uuid::Uuid;

use crate::{
    auth::jwt,
    db::{self, users, DbPool},
    models::user::{AuthResponse, LoginRequest, SignupRequest},
};

pub async fn signup(
    State(pool): State<DbPool>,
    Json(body): Json<SignupRequest>,
) -> Result<Json<Value>, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    if users::find_by_email(&conn, &body.email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?.is_some() {
        return Err(StatusCode::CONFLICT);
    }
    let hash = bcrypt::hash(&body.password, 10).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let id = Uuid::new_v4().to_string();
    users::create(&conn, &id, &body.email, &body.name, Some(&hash), None, None)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let user = users::find_by_id(&conn, &id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let token = jwt::sign(&id);
    Ok(Json(json!(AuthResponse { token, user })))
}

pub async fn login(
    State(pool): State<DbPool>,
    Json(body): Json<LoginRequest>,
) -> Result<Json<Value>, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let (user, hash) = users::find_by_email(&conn, &body.email)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::UNAUTHORIZED)?;
    let hash = hash.ok_or(StatusCode::UNAUTHORIZED)?;
    let valid = bcrypt::verify(&body.password, &hash).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    if !valid { return Err(StatusCode::UNAUTHORIZED); }
    let token = jwt::sign(&user.id);
    Ok(Json(json!(AuthResponse { token, user })))
}

pub async fn me(
    axum::Extension(user): axum::Extension<crate::models::user::User>,
) -> Json<Value> {
    Json(json!(user))
}
