import abc

from src.lessons.domain.interfaces.lesson_provider import ILessonAIProvider


class ILessonAI(abc.ABC):

    def __init__(self, provider: ILessonAIProvider):
        self.provider = provider

    @abc.abstractmethod
    def run(self):
        ...

    @abc.abstractmethod
    def process(self):
        ...

    @abc.abstractmethod
    def stop(self):
        ...
