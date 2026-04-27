use axum::{extract::{Query, State}, http::StatusCode, response::{Json, Redirect}};
use serde::Deserialize;
use serde_json::{json, Value};
use uuid::Uuid;

use crate::{
    auth::jwt,
    db::{users, DbPool},
    models::user::{AuthResponse, LoginRequest, SignupRequest},
};

#[derive(Deserialize)]
pub struct OAuthCallback {
    code: Option<String>,
    error: Option<String>,
}

#[derive(Deserialize)]
struct GoogleTokenResponse {
    access_token: String,
}

#[derive(Deserialize)]
struct GoogleUser {
    sub: String,
    email: String,
    name: Option<String>,
    picture: Option<String>,
}

#[derive(Deserialize)]
struct GitHubTokenResponse {
    access_token: String,
}

#[derive(Deserialize)]
struct GitHubUser {
    id: u64,
    login: String,
    name: Option<String>,
    email: Option<String>,
    avatar_url: Option<String>,
}

#[derive(Deserialize)]
struct GitHubEmail {
    email: String,
    primary: bool,
    verified: bool,
}

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

pub async fn google_start() -> Result<Redirect, StatusCode> {
    let client_id = env_required("GOOGLE_CLIENT_ID")?;
    let redirect_uri = format!("{}/api/auth/google/callback", backend_public_url());
    let url = format!(
        "https://accounts.google.com/o/oauth2/v2/auth?client_id={}&redirect_uri={}&response_type=code&scope={}&prompt=select_account",
        enc(&client_id),
        enc(&redirect_uri),
        enc("openid email profile"),
    );
    Ok(Redirect::temporary(&url))
}

pub async fn google_callback(
    State(pool): State<DbPool>,
    Query(query): Query<OAuthCallback>,
) -> Redirect {
    let result = async {
        if query.error.is_some() {
            return Err(());
        }
        let code = query.code.ok_or(())?;
        let client_id = env_required("GOOGLE_CLIENT_ID").map_err(|_| ())?;
        let client_secret = env_required("GOOGLE_CLIENT_SECRET").map_err(|_| ())?;
        let redirect_uri = format!("{}/api/auth/google/callback", backend_public_url());
        let http = reqwest::Client::new();
        let token = http.post("https://oauth2.googleapis.com/token")
            .form(&[
                ("client_id", client_id.as_str()),
                ("client_secret", client_secret.as_str()),
                ("code", code.as_str()),
                ("grant_type", "authorization_code"),
                ("redirect_uri", redirect_uri.as_str()),
            ])
            .send().await.map_err(|_| ())?
            .error_for_status().map_err(|_| ())?
            .json::<GoogleTokenResponse>().await.map_err(|_| ())?;
        let profile = http.get("https://www.googleapis.com/oauth2/v3/userinfo")
            .bearer_auth(token.access_token)
            .send().await.map_err(|_| ())?
            .error_for_status().map_err(|_| ())?
            .json::<GoogleUser>().await.map_err(|_| ())?;
        oauth_login(&pool, "google", &profile.sub, &profile.email, profile.name.as_deref().unwrap_or(&profile.email), profile.picture.as_deref()).map_err(|_| ())
    }.await;
    oauth_redirect(result)
}

pub async fn github_start() -> Result<Redirect, StatusCode> {
    let client_id = env_required("GITHUB_CLIENT_ID")?;
    let redirect_uri = format!("{}/api/auth/github/callback", backend_public_url());
    let url = format!(
        "https://github.com/login/oauth/authorize?client_id={}&redirect_uri={}&scope={}",
        enc(&client_id),
        enc(&redirect_uri),
        enc("read:user user:email"),
    );
    Ok(Redirect::temporary(&url))
}

pub async fn github_callback(
    State(pool): State<DbPool>,
    Query(query): Query<OAuthCallback>,
) -> Redirect {
    let result = async {
        if query.error.is_some() {
            return Err(());
        }
        let code = query.code.ok_or(())?;
        let client_id = env_required("GITHUB_CLIENT_ID").map_err(|_| ())?;
        let client_secret = env_required("GITHUB_CLIENT_SECRET").map_err(|_| ())?;
        let http = reqwest::Client::new();
        let token = http.post("https://github.com/login/oauth/access_token")
            .header("Accept", "application/json")
            .form(&[
                ("client_id", client_id.as_str()),
                ("client_secret", client_secret.as_str()),
                ("code", code.as_str()),
            ])
            .send().await.map_err(|_| ())?
            .error_for_status().map_err(|_| ())?
            .json::<GitHubTokenResponse>().await.map_err(|_| ())?;
        let profile = http.get("https://api.github.com/user")
            .header("User-Agent", "ClawDesk")
            .bearer_auth(&token.access_token)
            .send().await.map_err(|_| ())?
            .error_for_status().map_err(|_| ())?
            .json::<GitHubUser>().await.map_err(|_| ())?;
        let emails = http.get("https://api.github.com/user/emails")
            .header("User-Agent", "ClawDesk")
            .bearer_auth(&token.access_token)
            .send().await.map_err(|_| ())?
            .error_for_status().map_err(|_| ())?
            .json::<Vec<GitHubEmail>>().await.map_err(|_| ())?;
        let email = profile.email
            .or_else(|| emails.into_iter().find(|e| e.primary && e.verified).map(|e| e.email))
            .ok_or(())?;
        let name = profile.name.as_deref().unwrap_or(&profile.login);
        oauth_login(&pool, "github", &profile.id.to_string(), &email, name, profile.avatar_url.as_deref()).map_err(|_| ())
    }.await;
    oauth_redirect(result)
}

fn oauth_login(pool: &DbPool, provider: &str, provider_id: &str, email: &str, name: &str, avatar: Option<&str>) -> Result<AuthResponse, StatusCode> {
    let conn = pool.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let existing = if provider == "google" {
        users::find_by_google_id(&conn, provider_id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    } else {
        users::find_by_github_id(&conn, provider_id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    };
    let user = if let Some(user) = existing {
        user
    } else if let Some((user, _)) = users::find_by_email(&conn, email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)? {
        if provider == "google" {
            users::link_google(&conn, &user.id, provider_id, avatar).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        } else {
            users::link_github(&conn, &user.id, provider_id, avatar).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        }
        users::find_by_id(&conn, &user.id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?.ok_or(StatusCode::INTERNAL_SERVER_ERROR)?
    } else {
        let id = Uuid::new_v4().to_string();
        users::create_oauth(&conn, &id, email, name, provider, provider_id, avatar).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        users::find_by_id(&conn, &id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?.ok_or(StatusCode::INTERNAL_SERVER_ERROR)?
    };
    let token = jwt::sign(&user.id);
    Ok(AuthResponse { token, user })
}

fn oauth_redirect(result: Result<AuthResponse, ()>) -> Redirect {
    let base = frontend_origin();
    match result {
        Ok(auth) => Redirect::temporary(&format!("{}/auth/oauth/callback?token={}", base, enc(&auth.token))),
        Err(_) => Redirect::temporary(&format!("{}/auth/login?oauth_error=1", base)),
    }
}

fn env_required(name: &str) -> Result<String, StatusCode> {
    std::env::var(name).map_err(|_| StatusCode::SERVICE_UNAVAILABLE)
}

fn backend_public_url() -> String {
    std::env::var("BACKEND_PUBLIC_URL").unwrap_or_else(|_| "http://localhost:3001".to_string()).trim_end_matches('/').to_string()
}

fn frontend_origin() -> String {
    std::env::var("FRONTEND_ORIGIN").unwrap_or_else(|_| "http://localhost:5173".to_string()).trim_end_matches('/').to_string()
}

fn enc(input: &str) -> String {
    input.bytes().flat_map(|b| match b {
        b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => vec![b as char],
        _ => format!("%{:02X}", b).chars().collect(),
    }).collect()
}
