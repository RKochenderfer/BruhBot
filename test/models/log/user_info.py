class UserInfo:
    """
    The Discord User Info
    """
    def __init__(self, id, bot, username, discriminator) -> None:
        self.id = id
        self.bot = bot
        self.username = username
        self.discriminator = discriminator