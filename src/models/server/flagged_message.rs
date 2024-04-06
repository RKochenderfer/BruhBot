use chrono::{DateTime, Utc};
use regex::Regex;
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct FlaggedMessage {
    key: String,
    expression: Regex,
    response: String,
    flags: Option<String>,
    has_flags: bool,
    message_history: MessageHistory,
}

impl FlaggedMessage {
    pub fn new(
        key: &str,
        expression: Regex,
        response: &str,
        flags: Option<&str>,
        message_history: &MessageHistory,
    ) -> Result<Self, &'static str> {
        if key.is_empty() {
            return Err("Key cannot be an empty string");
        }
        if response.is_empty() {
            return Err("Response cannot be an empty string");
        }

        Ok(Self {
            key: key.to_string(),
            expression,
            response: response.to_string(),
            flags: flags.map(|f| f.to_string()),
            has_flags: flags.is_some(),
            message_history: message_history.clone(),
        })
    }

    pub fn key(&self) -> &str {
        &self.key
    }

    pub fn expression(&self) -> &Regex {
        &self.expression
    }

    pub fn response(&self) -> &str {
        &self.response
    }

    pub fn has_flags(&self) -> bool {
        self.has_flags
    }

    pub fn message_history(&self) -> &MessageHistory {
        &self.message_history
    }

    pub fn flags(&self) -> Option<&String> {
        self.flags.as_ref()
    }
}

#[derive(Debug, Clone)]
pub struct MessageHistory {
    last_author_id: Uuid,
    last_author_username: String,
    count: u64,
    last_found: DateTime<Utc>,
    previously_last_found: DateTime<Utc>,
}

impl MessageHistory {
    fn new(
        last_author_id: Uuid,
        last_author_username: &str,
        count: u64,
        last_found: DateTime<Utc>,
        previously_last_found: DateTime<Utc>,
    ) -> Self {
        Self {
            last_author_id,
            last_author_username: last_author_username.to_string(),
            count,
            last_found,
            previously_last_found,
        }
    }

    pub fn last_author_id(&self) -> Uuid {
        self.last_author_id
    }

    pub fn last_author_username(&self) -> &str {
        &self.last_author_username
    }

    pub fn count(&self) -> u64 {
        self.count
    }

    pub fn last_found(&self) -> DateTime<Utc> {
        self.last_found
    }

    pub fn previously_last_found(&self) -> DateTime<Utc> {
        self.previously_last_found
    }
}

impl Default for MessageHistory {
    fn default() -> Self {
        Self {
            last_author_id: Default::default(),
            last_author_username: Default::default(),
            count: Default::default(),
            last_found: Utc::now(),
            previously_last_found: Utc::now(),
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::models::server::flagged_message;

    use super::*;

    #[test]
    fn create_new_flagged_message() {
        // Arrange
        let expression_string = "test";
        let key = "key";
        let expression = Regex::new(expression_string).unwrap();
        let response = "success";
        let flags = Some("f");
        let message_history = MessageHistory::default();

        // Act
        let result_flagged_message =
            FlaggedMessage::new(key, expression, response, flags, &message_history);

        // Assert
        assert!(result_flagged_message.is_ok());
        let flagged_message = result_flagged_message.unwrap();

        assert_eq!(key, flagged_message.key());
        assert!(flagged_message.expression().is_match(expression_string));
        assert_eq!(response, flagged_message.response());
        assert_eq!(flags, flagged_message.flags().map(|x| x.as_str()));
        assert!(flagged_message.has_flags());
        assert_eq!(
            message_history.last_author_id(),
            flagged_message.message_history().last_author_id()
        );
        assert_eq!(
            message_history.last_author_username(),
            flagged_message.message_history().last_author_username()
        );
        assert_eq!(
            message_history.count(),
            flagged_message.message_history().count()
        );
        assert_eq!(
            message_history.previously_last_found(),
            flagged_message.message_history().previously_last_found()
        );
        assert_eq!(
            message_history.last_found(),
            flagged_message.message_history().last_found()
        );
    }

    #[test]
    fn create_new_flagged_message_with_no_flags() {
        // Arrange
        let expression_string = "test";
        let key = "key";
        let expression = Regex::new(expression_string).unwrap();
        let response = "success";
        let message_history = MessageHistory::default();

        // Act
        let result_flagged_message =
            FlaggedMessage::new(key, expression, response, None, &message_history);

        // Assert
        assert!(result_flagged_message.is_ok());
        let flagged_message = result_flagged_message.unwrap();

        assert_eq!(key, flagged_message.key());
        assert!(flagged_message.expression().is_match(expression_string));
        assert_eq!(response, flagged_message.response());
        assert!(flagged_message.flags().is_none());
        assert!(!flagged_message.has_flags());
        assert_eq!(
            message_history.last_author_id(),
            flagged_message.message_history().last_author_id()
        );
        assert_eq!(
            message_history.last_author_username(),
            flagged_message.message_history().last_author_username()
        );
        assert_eq!(
            message_history.count(),
            flagged_message.message_history().count()
        );
        assert_eq!(
            message_history.previously_last_found(),
            flagged_message.message_history().previously_last_found()
        );
        assert_eq!(
            message_history.last_found(),
            flagged_message.message_history().last_found()
        );
    }

    #[test]
    fn create_new_message_history() {
        // Arrange
        let last_author_id = Uuid::new_v4();
        let last_author_username = String::from("author");
        let count: u64 = 1;
        let previously_last_found = Utc::now();
        let last_found = Utc::now();

        // Act
        let message_history = MessageHistory::new(
            last_author_id.clone(),
            &last_author_username,
            count,
            last_found.clone(),
            previously_last_found.clone(),
        );

        // Assert
        assert_eq!(last_author_id, message_history.last_author_id());
        assert_eq!(last_author_username, message_history.last_author_username());
        assert_eq!(count, message_history.count());
        assert_eq!(
            previously_last_found,
            message_history.previously_last_found()
        );
        assert_eq!(last_found, message_history.last_found());
    }
}
