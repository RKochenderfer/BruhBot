use crate::Context;
use anyhow::Result;
use log::info;

#[poise::command(slash_command, prefix_command)]
pub async fn bruh(ctx: Context<'_>) -> Result<()> {
    info!("Command bruh activated");
    let response = String::from("bruh");
    ctx.say(response).await?;

    Ok(())
}
