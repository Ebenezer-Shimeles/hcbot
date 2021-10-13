from django_tgbot.decorators import processor
from django_tgbot.state_manager import message_types, update_types, state_types
from django_tgbot.types.update import Update
from hidden_chat_bot.bot import state_manager
from hidden_chat_bot.models import TelegramState
from hidden_chat_bot.bot import TelegramBot


@processor(state_manager, from_states=state_types.All)
def hello_world(bot: TelegramBot, update: Update, state: TelegramState):
    bot.sendMessage(update.get_chat().get_id(), 'Hello!')
