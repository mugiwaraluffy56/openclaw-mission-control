use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

const SECRET: &[u8] = b"openclaw_mission_control_jwt_secret_change_in_prod";

#[derive(Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

pub fn sign(user_id: &str) -> String {
    let exp = chrono::Utc::now().timestamp() as usize + 60 * 60 * 24 * 30;
    let claims = Claims { sub: user_id.to_string(), exp };
    encode(&Header::default(), &claims, &EncodingKey::from_secret(SECRET)).unwrap()
}

pub fn verify(token: &str) -> Option<Claims> {
    decode::<Claims>(token, &DecodingKey::from_secret(SECRET), &Validation::default())
        .ok()
        .map(|d| d.claims)
}
