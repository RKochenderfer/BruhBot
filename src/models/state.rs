use std::str::FromStr;

use anyhow::Result;
use moka::future::Cache;
use uuid::Uuid;

use super::server::guild::Guild;

static DEFAULT_CACHE_CAPACITY: u64 = 10;

struct State {
    server_cache: Cache<Uuid, Guild>,
}

impl State {
    fn new() -> Self {
        let cache_capacity_string: String =
            std::env::var("CACHE_CAPACITY").map_or(DEFAULT_CACHE_CAPACITY.to_string(), |x| x);
        let cache_capacity: u64 = cache_capacity_string
            .parse()
            .expect("Failed to parse cache_capacity");
        let server_cache: Cache<Uuid, Guild> = Cache::new(cache_capacity);

        Self { server_cache }
    }

    pub async fn add_guild(&self, guild: &Guild) -> Result<()> {
        self.server_cache
            .insert(Uuid::from_str(guild.guild_id())?, guild.clone())
            .await;

        Ok(())
    }

	pub async fn get_guild(&self, guild_id: &Uuid) -> Option<Guild> {
		self.server_cache.get(&guild_id).await
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
		let guild_id = Uuid::new_v4();
        let guild = Guild::new(&guild_name, &guild_id.to_string());

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
		assert_eq!(guild_id, Uuid::parse_str(added_guild.guild_id()).unwrap());
    }
}
