use poise::serenity_prelude::GuildId;

use super::{flagged_message::FlaggedMessage, pin::Pin};

#[derive(Debug, Clone)]
pub struct Guild {
    pins: Vec<Pin>,
    flagged_messages: Vec<FlaggedMessage>,
    name: String,
    guild_id: GuildId,
}

impl Guild {
    pub fn new(name: &str, guild_id: &GuildId) -> Self {
        Self {
            pins: vec![],
            flagged_messages: vec![],
            name: name.to_string(),
            guild_id: guild_id.clone(),
        }
    }

    pub fn guild_id(&self) -> &GuildId {
        &self.guild_id
    }

    pub fn name(&self) -> &str {
        &self.name
    }
}
