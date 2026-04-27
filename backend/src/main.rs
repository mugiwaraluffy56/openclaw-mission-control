mod api;
mod auth;
mod db;
mod models;
mod ssh;
mod ws;

use axum::{middleware, routing::{get, post, delete}, Router};
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::{ServeDir, ServeFile};

#[tokio::main]
async fn main() {
    let db_path = std::env::var("OPENCLAW_DB_PATH")
        .or_else(|_| std::env::var("MISSION_CONTROL_DB"))
        .unwrap_or_else(|_| "mission_control.db".to_string());
    let pool = db::init_pool(&db_path);
    let port = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(3001);
    let static_dir = std::env::var("CLAWDESK_STATIC_DIR").unwrap_or_else(|_| "public".to_string());

    let cors = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);

    let app = Router::new()
        .route("/api/auth/signup", post(api::auth::signup))
        .route("/api/auth/login", post(api::auth::login))
        .route("/api/auth/google", get(api::auth::google_start))
        .route("/api/auth/google/callback", get(api::auth::google_callback))
        .route("/api/auth/github", get(api::auth::github_start))
        .route("/api/auth/github/callback", get(api::auth::github_callback))
        .route("/api/auth/me", get(api::auth::me))
        .route("/api/health", get(api::health::health))
        .route("/api/agents", get(api::agents::list).post(api::agents::create))
        .route("/api/agents/:id", get(api::agents::get).put(api::agents::update).delete(api::agents::delete))
        .route("/api/agents/:id/restart", post(api::agents::restart))
        .route("/api/agents/:id/stop", post(api::agents::stop))
        .route("/api/agents/:id/start", post(api::agents::start_agent))
        .route("/api/agents/:id/command", post(api::agents::run_command))
        .route("/api/agents/:id/channels", get(api::agents::get_channels))
        .route("/api/agents/:id/plugins", get(api::agents::get_plugins))
        .route("/api/agents/:id/config", get(api::agents::get_config).put(api::agents::update_config))
        .route("/api/agents/:id/sessions", get(api::agents::get_sessions))
        .route("/api/agents/:id/stats", get(api::agents::get_stats))
        .route("/api/activity", get(api::agents::get_activity))
        .route("/api/webhooks", get(api::webhooks::list).post(api::webhooks::create))
        .route("/api/webhooks/:id", delete(api::webhooks::delete))
        .route("/api/notifications", get(api::notifications::list).post(api::notifications::create))
        .route("/api/team", get(api::team::list))
        .route("/api/team/invite", post(api::team::invite))
        .route("/ws/logs/:id", get(ws::logs::ws_logs))
        .layer(middleware::from_fn(auth::middleware::make_middleware(pool.clone())))
        .layer(cors)
        .with_state(pool)
        .fallback_service(
            ServeDir::new(&static_dir)
                .not_found_service(ServeFile::new(format!("{}/index.html", static_dir)))
        );

    let listener = tokio::net::TcpListener::bind(("0.0.0.0", port)).await.unwrap();
    println!("ClawDesk: http://0.0.0.0:{}", port);
    axum::serve(listener, app).await.unwrap();
}
