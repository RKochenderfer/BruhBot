class InteractionLog:
    """
    The interaction information
    """
    def __init__(self, log_level, discord_info, execution_time, type, message, timestamp, is_error, error):
        self.log_level = log_level
        self.discord_info = discord_info
        self.execution_time = execution_time
        self.type = type
        self.message = message
        self.timestamp = timestamp
        self.is_error = is_error
        self.error = error
