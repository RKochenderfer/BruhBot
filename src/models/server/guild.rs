use super::{flagged_message::FlaggedMessage, pin::Pin};

#[derive(Debug, Clone)]
pub struct Guild {
    pins: Vec<Pin>,
    flagged_messages: Vec<FlaggedMessage>,
    name: String,
    guild_id: String,
}

impl Guild {
    pub fn new(name: &str, guild_id: &str) -> Self {
        Self {
            pins: vec![],
            flagged_messages: vec![],
            name: name.to_string(),
            guild_id: guild_id.to_string(),
        }
    }

    pub fn guild_id(&self) -> &str {
        &self.guild_id
    }

    pub fn name(&self) -> &str {
        &self.name
    }
}
