use axum::{
    extract::Request,
    http::StatusCode,
    middleware::Next,
    response::Response,
};
use crate::{auth::jwt::verify, db::{users, DbPool}, models::user::User};

const PUBLIC_PATHS: &[&str] = &["/api/auth/signup", "/api/auth/login"];

pub fn make_middleware(pool: DbPool) -> impl Fn(Request, Next) -> std::pin::Pin<Box<dyn std::future::Future<Output = Response> + Send>> + Clone + Send + 'static {
    move |mut req: Request, next: Next| {
        let pool = pool.clone();
        Box::pin(async move {
            let path = req.uri().path().to_string();
            if PUBLIC_PATHS.contains(&path.as_str()) || path.starts_with("/ws/") {
                return next.run(req).await;
            }

            let token = req
                .headers()
                .get("Authorization")
                .and_then(|v| v.to_str().ok())
                .and_then(|v| v.strip_prefix("Bearer "))
                .map(|s| s.to_string());

            let Some(token) = token else {
                return axum::response::IntoResponse::into_response(StatusCode::UNAUTHORIZED);
            };

            let Some(claims) = verify(&token) else {
                return axum::response::IntoResponse::into_response(StatusCode::UNAUTHORIZED);
            };

            let user: Option<User> = {
                let Ok(conn) = pool.lock() else {
                    return axum::response::IntoResponse::into_response(StatusCode::INTERNAL_SERVER_ERROR);
                };
                users::find_by_id(&conn, &claims.sub).ok().flatten()
            };

            let Some(user) = user else {
                return axum::response::IntoResponse::into_response(StatusCode::UNAUTHORIZED);
            };

            req.extensions_mut().insert(user);
            next.run(req).await
        })
    }
}
