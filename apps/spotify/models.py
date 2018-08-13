# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from ..login_registration.models import User
import re
# Create your models here.
class Songs(models.Model):
    song = models.CharField(max_length=255, unique=True)
    liked_at = models.DateTimeField(auto_now_add= True)
    liked_others = models.ManyToManyField(User, related_name="otherlikedsongs")
