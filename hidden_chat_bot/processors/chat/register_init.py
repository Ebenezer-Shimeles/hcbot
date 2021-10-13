from django_tgbot.decorators import processor
from django_tgbot.state_manager import message_types, update_types, state_types
from django_tgbot.types.update import Update
from hidden_chat_bot.bot import state_manager
from hidden_chat_bot.models import TelegramState
from hidden_chat_bot.bot import TelegramBot

from hidden_chat_bot.processors  import strings  as STRINGS
@processor(
    state_manager, 
    from_states=state_types.All,
    update_types= [update_types.Message],
    message_types=[message_types.Text]
)
def hello_world(bot: TelegramBot, update: Update, state: TelegramState):
    chat = update.get_chat()
    chat_id = chat.get_id()
    message = update.get_message()
    message_text = message.get_text()
    
    if not message_text == "/register":
        return
    bot.sendMessage(chat_id, 
           STRINGS.SEND_NAME
    )
