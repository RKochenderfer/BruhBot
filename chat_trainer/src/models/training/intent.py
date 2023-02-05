class Intent:
    """
    Training intent
    """
    def __init__(self, tag, patterns, responses, context_set) -> None:
        self.tag = tag
        self.patterns = patterns
        self.responses = responses
        self.context_set = context_set