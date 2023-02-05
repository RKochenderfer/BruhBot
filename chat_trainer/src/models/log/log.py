class Log:
    """
    The log information from BruhBot
    """
    def __init__(self, level, timestamp, type, message, interaction_log):
        self.level = level,
        self.timestamp = timestamp,
        self.type = type
        self.message = message
        self.interaction_log = interaction_log