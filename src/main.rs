use anyhow::{Error, Result};
use dotenvy;
use log::{error, info, warn};
use models::user_data::UserData;
use poise::{
    framework,
    serenity_prelude::{self as serenity, GatewayIntents, GuildId},
    Framework, FrameworkOptions,
};
use std::{env, path::Path, sync::Arc, time::Duration, vec};

pub mod commands;
pub mod models;

pub type Context<'a> = poise::Context<'a, UserData, Error>;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();

    load_env()?;

    let options = setup_framework_options();

    let framework = build_framework(options);

    let token = env::var("TOKEN").expect("Missing `TOKEN` env var");
    let intents = serenity::GatewayIntents::all();

    let client = serenity::ClientBuilder::new(token, intents)
        .framework(framework)
        .await;

    client.unwrap().start().await?;

    Ok(())
}

fn load_env() -> Result<()> {
    let args: Vec<String> = env::args().collect();

    if args.len() > 1 {
        let provided_env_file_path = &args[1];
        dotenvy::from_path(Path::new(provided_env_file_path))?;
        info!("Env file path: {} provided.", provided_env_file_path);
    } else {
        info!("No env file provided. Using current environment variables");
    }

    Ok(())
}

fn build_framework(options: FrameworkOptions<UserData, Error>) -> Framework<UserData, Error> {
    poise::Framework::builder()
        .setup(move |ctx, _ready, framework| {
            Box::pin(async move {
                info!("Logged in as {}", _ready.user.name);
                poise::builtins::register_in_guild(
                    ctx,
                    &framework.options().commands,
                    GuildId::new(706506150643892334),
                )
                .await?;
                Ok(UserData {})
            })
        })
        .options(options)
        .build()
}

fn setup_framework_options() -> poise::FrameworkOptions<UserData, Error> {
    poise::FrameworkOptions {
        commands: vec![commands::bruh::bruh()],
        prefix_options: poise::PrefixFrameworkOptions {
            prefix: Some("~".into()),
            edit_tracker: Some(Arc::new(poise::EditTracker::for_timespan(
                Duration::from_secs(3600),
            ))),
            additional_prefixes: vec![
                poise::Prefix::Literal("hey bot"),
                poise::Prefix::Literal("hey bot,"),
            ],
            ..Default::default()
        },
        // The global error handler for all error cases that may occur
        on_error: |error| Box::pin(on_error(error)),
        // This code is run before every command
        pre_command: |ctx| {
            Box::pin(async move {
                info!("Executing command {}...", ctx.command().qualified_name);
            })
        },
        // This code is run after a command if it was successful (returned Ok)
        post_command: |ctx| {
            Box::pin(async move {
                info!("Executed command {}!", ctx.command().qualified_name);
            })
        },
        // Every command invocation must pass this check to continue execution
        command_check: Some(|ctx| {
            Box::pin(async move {
                if ctx.author().id == 123456789 {
                    return Ok(false);
                }
                Ok(true)
            })
        }),
        // Enforce command checks even for owners (enforced by default)
        // Set to true to bypass checks, which is useful for testing
        skip_checks_for_owners: false,
        event_handler: |_ctx, event, _framework, _data| {
            Box::pin(async move {
                info!(
                    "Got an event in event handler: {:?}",
                    event.snake_case_name()
                );
                Ok(())
            })
        },
        ..Default::default()
    }
}

async fn on_error(error: poise::FrameworkError<'_, UserData, Error>) {
    match error {
        poise::FrameworkError::Setup { error, .. } => panic!("Failed to start bot: {:?}", error),
        poise::FrameworkError::Command { error, ctx, .. } => {
            error!("Error in command `{}`: {:?}", ctx.command().name, error,);
        }
        error => {
            if let Err(e) = poise::builtins::on_error(error).await {
                error!("Error while handling error: {}", e)
            }
        }
    }
}
