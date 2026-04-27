use std::io::Write as IoWrite;
use std::process::{Command, Stdio};
use tempfile::NamedTempFile;

pub struct SshClient {
    pub ip: String,
    key_file: NamedTempFile,
}

impl SshClient {
    pub fn new(ip: &str, ssh_key_content: &str) -> Option<Self> {
        let mut f = tempfile::NamedTempFile::new().ok()?;
        f.write_all(ssh_key_content.as_bytes()).ok()?;
        // Fix permissions
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            std::fs::set_permissions(f.path(), std::fs::Permissions::from_mode(0o600)).ok()?;
        }
        Some(Self { ip: ip.to_string(), key_file: f })
    }

    pub fn run(&self, cmd: &str) -> (bool, String, String) {
        let output = Command::new("ssh")
            .args([
                "-i", self.key_file.path().to_str().unwrap_or(""),
                "-o", "StrictHostKeyChecking=no",
                "-o", "ConnectTimeout=5",
                "-o", "BatchMode=yes",
                &format!("ubuntu@{}", self.ip),
                cmd,
            ])
            .output();
        match output {
            Ok(o) => (
                o.status.success(),
                String::from_utf8_lossy(&o.stdout).to_string(),
                String::from_utf8_lossy(&o.stderr).to_string(),
            ),
            Err(e) => (false, String::new(), e.to_string()),
        }
    }

    pub fn read_file(&self, path: &str) -> Option<String> {
        let (ok, out, _) = self.run(&format!("cat {}", path));
        if ok { Some(out) } else { None }
    }

    pub fn write_file(&self, path: &str, content: &str) -> bool {
        let encoded = base64_encode(content);
        let (ok, _, _) = self.run(&format!("echo '{}' | base64 -d > {}", encoded, path));
        ok
    }

    pub fn spawn_log_stream(&self) -> Option<std::process::Child> {
        Command::new("ssh")
            .args([
                "-i", self.key_file.path().to_str().unwrap_or(""),
                "-o", "StrictHostKeyChecking=no",
                "-o", "ConnectTimeout=5",
                "-o", "BatchMode=yes",
                &format!("ubuntu@{}", self.ip),
                "journalctl --user -u openclaw-gateway.service -f --no-pager -n 100 --output=short",
            ])
            .stdout(Stdio::piped())
            .stderr(Stdio::null())
            .spawn()
            .ok()
    }
}

fn base64_encode(input: &str) -> String {
    use std::fmt::Write;
    let bytes = input.as_bytes();
    let mut out = String::new();
    let alphabet = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut i = 0;
    while i < bytes.len() {
        let b0 = bytes[i] as usize;
        let b1 = if i + 1 < bytes.len() { bytes[i+1] as usize } else { 0 };
        let b2 = if i + 2 < bytes.len() { bytes[i+2] as usize } else { 0 };
        let _ = write!(out, "{}{}{}{}",
            alphabet[b0 >> 2] as char,
            alphabet[((b0 & 3) << 4) | (b1 >> 4)] as char,
            if i + 1 < bytes.len() { alphabet[((b1 & 15) << 2) | (b2 >> 6)] as char } else { '=' },
            if i + 2 < bytes.len() { alphabet[b2 & 63] as char } else { '=' },
        );
        i += 3;
    }
    out
}
