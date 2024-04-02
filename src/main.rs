use std::{env, path::Path};
use dotenvy;
use log::info;
use anyhow::Result;
use poise::serenity_prelude::{self as serenity, GatewayIntents};
use bruhbot;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();

    load_env()?;
    let token = env::var("TOKEN").expect("Excepted a token in the environment");
    let intents = GatewayIntents::all();

    Ok(())
}

fn load_env() -> Result<()> {
    let args: Vec<String> = env::args().collect();

    if args.len() > 1 {
        let provided_env_file_path = &args[1];
        dotenvy::from_path(Path::new(provided_env_file_path))?;
        info!("Env file path: {} provided.", provided_env_file_path);
    }
    else {
        println!("No arguments provided");
        info!("No env file provided. Using current environment variables");
    }

    Ok(())
}

