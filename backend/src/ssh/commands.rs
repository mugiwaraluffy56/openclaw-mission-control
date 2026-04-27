use super::client::SshClient;

pub fn is_active(c: &SshClient) -> bool {
    let (_, out, _) = c.run("systemctl --user is-active openclaw-gateway.service 2>/dev/null");
    out.trim() == "active"
}

pub fn get_pid(c: &SshClient) -> Option<u32> {
    let (_, out, _) = c.run("systemctl --user show openclaw-gateway.service --property=MainPID --value 2>/dev/null");
    out.trim().parse::<u32>().ok().filter(|&p| p > 0)
}

pub fn get_uptime(c: &SshClient) -> Option<String> {
    let (_, out, _) = c.run("systemctl --user show openclaw-gateway.service --property=ActiveEnterTimestamp --value 2>/dev/null");
    let s = out.trim().to_string();
    if s.is_empty() || s == "n/a" { None } else { Some(s) }
}

pub fn restart(c: &SshClient) -> bool {
    c.run("systemctl --user restart openclaw-gateway.service 2>/dev/null").0
}

pub fn stop(c: &SshClient) -> bool {
    c.run("systemctl --user stop openclaw-gateway.service 2>/dev/null").0
}

pub fn start(c: &SshClient) -> bool {
    c.run("systemctl --user start openclaw-gateway.service 2>/dev/null").0
}

pub fn get_recent_logs(c: &SshClient, n: u32) -> Vec<String> {
    let (_, out, _) = c.run(&format!(
        "journalctl --user -u openclaw-gateway.service -n {} --no-pager --output=short 2>/dev/null", n
    ));
    out.lines().map(|l| l.to_string()).collect()
}

pub fn get_system_stats(c: &SshClient) -> serde_json::Value {
    let (_, cpu, _) = c.run("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' 2>/dev/null");
    let (_, mem, _) = c.run("free -m | awk 'NR==2{printf \"%.1f\", $3/$2*100}' 2>/dev/null");
    let (_, uptime, _) = c.run("uptime -p 2>/dev/null");
    serde_json::json!({
        "cpu": cpu.trim(),
        "memory": mem.trim(),
        "uptime": uptime.trim(),
    })
}
