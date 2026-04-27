use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

pub fn sign(user_id: &str) -> String {
    let exp = chrono::Utc::now().timestamp() as usize + 60 * 60 * 24 * 30;
    let claims = Claims { sub: user_id.to_string(), exp };
    encode(&Header::default(), &claims, &EncodingKey::from_secret(jwt_secret().as_bytes())).unwrap()
}

pub fn verify(token: &str) -> Option<Claims> {
    decode::<Claims>(token, &DecodingKey::from_secret(jwt_secret().as_bytes()), &Validation::default())
        .ok()
        .map(|d| d.claims)
}

fn jwt_secret() -> String {
    std::env::var("OPENCLAW_JWT_SECRET")
        .or_else(|_| std::env::var("JWT_SECRET"))
        .expect("OPENCLAW_JWT_SECRET or JWT_SECRET must be set")
}
