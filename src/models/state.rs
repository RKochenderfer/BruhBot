use std::str::FromStr;

use anyhow::Result;
use moka::future::Cache;
use poise::serenity_prelude::{model::guild, GuildId};
use uuid::Uuid;

use super::server::guild::Guild;

static DEFAULT_CACHE_CAPACITY: u64 = 10;


#[derive(Debug)]
pub struct State {
    server_cache: Cache<GuildId, Guild>,
}

impl State {
    pub fn new() -> Self {
        let cache_capacity_string: String =
            std::env::var("CACHE_CAPACITY").map_or(DEFAULT_CACHE_CAPACITY.to_string(), |x| x);
        let cache_capacity: u64 = cache_capacity_string
            .parse()
            .expect("Failed to parse cache_capacity");
        let server_cache: Cache<GuildId, Guild> = Cache::new(cache_capacity);

        Self { server_cache }
    }

    pub async fn add_guild(&self, guild: &Guild) -> Result<()> {
        self.server_cache
            .insert(*guild.guild_id(), guild.clone())
            .await;

        Ok(())
    }

    pub async fn get_guild(&self, guild_id: &GuildId) -> Option<Guild> {
        self.server_cache.get(guild_id).await
    }

    pub async fn is_guild_in_cache(&self, guild_id: &GuildId) -> bool {
        let guild = self.get_guild(guild_id).await;

        guild.is_some()
    }

    pub async fn is_guild_not_in_cache(&self, guild_id: &GuildId) -> bool {
        !self.is_guild_in_cache(guild_id).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn add_valid_guild_to_state() {
        // Arrange
        let state = State::new();
        let guild_name = "name";
        let guild_id = GuildId::new(123);
        let guild = Guild::new(&guild_name, &guild_id);

        // Act
        let result = state.add_guild(&guild).await;

        // Assert
        assert!(result.is_ok());

        // Assert guild is in cache
        let guild_option = state.get_guild(&guild_id).await;
        assert!(guild_option.is_some());

        // Assert guild information is correctly added to cache
        let added_guild = guild_option.unwrap();
        assert_eq!(guild_name, added_guild.name());
        assert_eq!(guild_id, *added_guild.guild_id());
    }

    #[tokio::test]
    async fn is_guild_in_cache_with_guild_in_cache() {
        // Arrange
        let state = State::new();
        let guild_name = "name";
        let guild_id = GuildId::new(123);
        let guild = Guild::new(&guild_name, &guild_id);
        state.add_guild(&guild).await.unwrap();

        // Act
        let is_in_cache = state.is_guild_in_cache(&guild_id).await;

        // Assert
        assert!(is_in_cache)
    }

    #[tokio::test]
    async fn is_guild_in_cache_with_guild_not_in_cache() {
        // Arrange
        let state = State::new();
        let guild_id = GuildId::new(1234);

        // Act
        let is_in_cache = state.is_guild_in_cache(&guild_id).await;

        // Assert
        assert!(!is_in_cache)
    }

    #[tokio::test]
    async fn is_guild_not_in_cache_with_guild_in_cache() {
        // Arrange
        let state = State::new();
        let guild_name = "name";
        let guild_id = GuildId::new(123);
        let guild = Guild::new(&guild_name, &guild_id);
        state.add_guild(&guild).await.unwrap();

        // Act
        let is_not_in_cache = state.is_guild_not_in_cache(&guild_id).await;

        // Assert
        assert!(!is_not_in_cache)
    }

    #[tokio::test]
    async fn is_guild_not_in_cache_with_guild_not_in_cache() {
        // Arrange
        let state = State::new();

        // Act
        let is_not_in_cache = state.is_guild_not_in_cache(&GuildId::new(1234)).await;

        // Assert
        assert!(is_not_in_cache)
    }
}
