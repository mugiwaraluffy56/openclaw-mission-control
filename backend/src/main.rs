mod api;
mod auth;
mod db;
mod models;
mod ssh;
mod ws;

use axum::{middleware, routing::{get, post, put, delete}, Router};
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    let pool = db::init_pool("mission_control.db");

    let cors = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);

    let app = Router::new()
        .route("/api/auth/signup", post(api::auth::signup))
        .route("/api/auth/login", post(api::auth::login))
        .route("/api/auth/me", get(api::auth::me))
        .route("/api/agents", get(api::agents::list).post(api::agents::create))
        .route("/api/agents/:id", get(api::agents::get).put(api::agents::update).delete(api::agents::delete))
        .route("/api/agents/:id/restart", post(api::agents::restart))
        .route("/api/agents/:id/stop", post(api::agents::stop))
        .route("/api/agents/:id/start", post(api::agents::start_agent))
        .route("/api/agents/:id/config", get(api::agents::get_config).put(api::agents::update_config))
        .route("/api/agents/:id/sessions", get(api::agents::get_sessions))
        .route("/api/agents/:id/stats", get(api::agents::get_stats))
        .route("/api/activity", get(api::agents::get_activity))
        .route("/ws/logs/:id", get(ws::logs::ws_logs))
        .layer(middleware::from_fn(auth::middleware::make_middleware(pool.clone())))
        .layer(cors)
        .with_state(pool);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();
    println!("Mission Control API: http://0.0.0.0:3001");
    axum::serve(listener, app).await.unwrap();
}
