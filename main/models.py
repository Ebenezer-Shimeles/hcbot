from django.db import models
from django.utils import timezone

# Create your models here.

class User(models.Model):
    on_bot_name = models.CharField(max_length=255, null = False, blank=False, default="Anonymous")
    reg_time = models.DateTimeField(auto_created=True)
    tg_id = models.CharField(max_length=255,unique=True, null=False, blank=False)
    invite_number = models.IntegerField(default=0, null=False, blank=False)
    last_user = models.DateTimeField(default=timezone.now)
    current_talk = models.CharField(max_length=255, default="", null=False, blank=False)
    blocks = models.ManyToManyField('self')


class Actions(models.Model):
    action = models.CharField(max_length=255, null=False, default="Error")
    taken_time = models.DateTimeField(auto_now_add=True)
    taker = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    
    @classmethod
    def take_action(cls, action_string, taker):
        ins = cls()
        ins.action = action_string
        ins.taker = taker
        ins.save()
        return ins
class General:
    NO_OF_INVITES_FOR_CHANGE_NAME = 1