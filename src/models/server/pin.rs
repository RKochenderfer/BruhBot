use chrono::prelude::*;
use uuid::Uuid;

#[derive(Debug, Clone, Default)]
pub struct Pin {
    message: String,
    date: Option<Utc>,
    user_id: Uuid,
}

impl Pin {
    pub fn new(message: String, date: Option<Utc>, user_id: Uuid) -> Self {
        Self {
            message,
            date,
            user_id,
        }
    }

    pub fn message(&self) -> &str {
        &self.message
    }

    pub fn date(&self) -> Option<Utc> {
        self.date
    }

    pub fn user_id(&self) -> Uuid {
        self.user_id
    }
}
