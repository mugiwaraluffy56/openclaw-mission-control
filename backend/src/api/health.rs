use axum::response::Json;
use serde_json::{json, Value};

pub async fn health() -> Json<Value> {
    Json(json!({
        "ok": true,
        "service": "clawdesk",
        "version": env!("CARGO_PKG_VERSION")
    }))
}
