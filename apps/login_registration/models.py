# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import re
import bcrypt
import datetime

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
# Create your models here.

class UserManager(models.Manager):
    def basic_validator(self, postData):
        errors = []
        if len(postData['name']) < 3:
            errors.append("name must be no fewer than 3 characters")
        # if re.search('[0-9]', postData['first_name']) != None:
        #     errors.append("no numbers in first name")
        # if len(postData['username']) < 3:
        #     errors.append("username must be no fewer than 2 characters")
        # if re.search('[0-9]', postData['last_name']) != None:
            # errors.append("no numbers in last name")
        if EMAIL_REGEX.match(postData['email']) == None:
            errors.append("Invalid email format")
        if len(postData['password']) < 8:
            errors.append("Pw must be at least 8 characters")
        if (postData['password'] != postData['confirm_password']):
            errors.append("Password does not match Confirm Password")
        # if not postData['birthdate']:
        #     errors.append("birthday field cannot be empty")
        # if datetime.datetime.strptime(postData['birthdate'], "%Y-%m-%d") > datetime.datetime.now() - datetime.timedelta(days=365*18):
        #     errors.append('hey kid get outta here YR TOO YUNG')
        email_exists = User.objects.filter(email=postData['email'])
        if email_exists:
            print('email is already in use buddy')
            errors.append("email already in use")
        return errors

    def login_validator(self, postData):
        errors=[]
        email_exists = User.objects.filter(email=postData['email'])
        print(email_exists)
        if not email_exists:
            errors.append("email is not in database. please register")
        else:
            hash1 = User.objects.filter(email=postData['email'])[0].password
            if not bcrypt.checkpw(postData['password'].encode(), hash1.encode()):
                errors.append("Incorrect Password for this user")
        return errors

class User(models.Model):
    email = models.CharField(max_length=55)
    password = models.CharField(max_length=55)
    name = models.CharField(max_length=55)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)
    objects = UserManager()