use rusqlite::{params, Connection, OptionalExtension};
use crate::models::user::User;

pub fn create(conn: &Connection, id: &str, email: &str, name: &str, hash: Option<&str>, google_id: Option<&str>, avatar: Option<&str>) -> rusqlite::Result<()> {
    conn.execute(
        "INSERT INTO users (id, email, name, password_hash, google_id, avatar_url) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![id, email, name, hash, google_id, avatar],
    )?;
    Ok(())
}

pub fn find_by_email(conn: &Connection, email: &str) -> rusqlite::Result<Option<(User, Option<String>)>> {
    conn.query_row(
        "SELECT id, email, name, avatar_url, created_at, password_hash FROM users WHERE email = ?1",
        params![email],
        |row| {
            Ok((
                User {
                    id: row.get(0)?,
                    email: row.get(1)?,
                    name: row.get(2)?,
                    avatar_url: row.get(3)?,
                    created_at: row.get(4)?,
                },
                row.get::<_, Option<String>>(5)?,
            ))
        },
    ).optional()
}

pub fn find_by_id(conn: &Connection, id: &str) -> rusqlite::Result<Option<User>> {
    conn.query_row(
        "SELECT id, email, name, avatar_url, created_at FROM users WHERE id = ?1",
        params![id],
        |row| Ok(User {
            id: row.get(0)?,
            email: row.get(1)?,
            name: row.get(2)?,
            avatar_url: row.get(3)?,
            created_at: row.get(4)?,
        }),
    ).optional()
}

pub fn find_by_google_id(conn: &Connection, google_id: &str) -> rusqlite::Result<Option<User>> {
    conn.query_row(
        "SELECT id, email, name, avatar_url, created_at FROM users WHERE google_id = ?1",
        params![google_id],
        |row| Ok(User {
            id: row.get(0)?,
            email: row.get(1)?,
            name: row.get(2)?,
            avatar_url: row.get(3)?,
            created_at: row.get(4)?,
        }),
    ).optional()
}

pub fn find_by_github_id(conn: &Connection, github_id: &str) -> rusqlite::Result<Option<User>> {
    conn.query_row(
        "SELECT id, email, name, avatar_url, created_at FROM users WHERE github_id = ?1",
        params![github_id],
        |row| Ok(User {
            id: row.get(0)?,
            email: row.get(1)?,
            name: row.get(2)?,
            avatar_url: row.get(3)?,
            created_at: row.get(4)?,
        }),
    ).optional()
}

pub fn link_google(conn: &Connection, user_id: &str, google_id: &str, avatar: Option<&str>) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE users SET google_id = ?1, avatar_url = COALESCE(?2, avatar_url) WHERE id = ?3",
        params![google_id, avatar, user_id],
    )?;
    Ok(())
}

pub fn link_github(conn: &Connection, user_id: &str, github_id: &str, avatar: Option<&str>) -> rusqlite::Result<()> {
    conn.execute(
        "UPDATE users SET github_id = ?1, avatar_url = COALESCE(?2, avatar_url) WHERE id = ?3",
        params![github_id, avatar, user_id],
    )?;
    Ok(())
}

pub fn create_oauth(conn: &Connection, id: &str, email: &str, name: &str, provider: &str, provider_id: &str, avatar: Option<&str>) -> rusqlite::Result<()> {
    let (google_id, github_id) = if provider == "google" {
        (Some(provider_id), None)
    } else {
        (None, Some(provider_id))
    };
    conn.execute(
        "INSERT INTO users (id, email, name, password_hash, google_id, github_id, avatar_url) VALUES (?1, ?2, ?3, NULL, ?4, ?5, ?6)",
        params![id, email, name, google_id, github_id, avatar],
    )?;
    Ok(())
}
