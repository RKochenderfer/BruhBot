use anyhow::Error;
use models::user_data::UserData;
use poise::serenity_prelude as serenity;


pub mod commands;
pub mod models;


pub type Context<'a> = poise::Context<'a, UserData, Error>;
