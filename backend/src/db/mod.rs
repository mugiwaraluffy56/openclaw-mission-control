pub mod agents;
pub mod schema;
pub mod users;
pub mod workspace;

use rusqlite::Connection;
use std::sync::{Arc, Mutex};

pub type DbPool = Arc<Mutex<Connection>>;

pub fn init_pool(path: &str) -> DbPool {
    let conn = Connection::open(path).expect("Failed to open database");
    schema::init(&conn).expect("Failed to initialize schema");
    Arc::new(Mutex::new(conn))
}
