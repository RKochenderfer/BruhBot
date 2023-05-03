class DiscordInfo:
    """
    The discord provided log information
    """
    def __init__(self, channel_id, channel_name, guild_id, content, command, command_type, regex, author):
        self.channel_id = channel_id
        self.channel_name = channel_name
        self.guild_id = guild_id
        self.content = content
        self.command = command
        self.command_type = command_type
        self.regex = regex
        self.author = author