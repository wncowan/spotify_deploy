# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponse, redirect
from time import gmtime, strftime
from django.contrib import messages
from .models import User
import bcrypt
# Create your views here.
def index(request):
    errors = messages.get_messages(request)
    context = {
        'errors': errors
    }
    return render(request, "login_registration/index.html", context)

def registration(request):
    errors = messages.get_messages(request)
    context = {
        'errors': errors
    }
    return render(request, 'login_registration/registration.html', context)

def create(request):
    print('entered create')
    hash1 = bcrypt.hashpw(request.POST['password'].encode(), bcrypt.gensalt())
    errors = User.objects.basic_validator(request.POST)
    if len(errors):
        for error in errors:
            messages.error(request, error)
        return redirect('/registration')
    else:
        new_user = User.objects.create(
            name=request.POST['name'], 
            email=request.POST['email'], 
            password=hash1
            )
        request.session['user_id'] = new_user.id
        request.session['action'] = "registered"
        print(request.session['action'])
        print(request.session['user_id'])
        return redirect('/')

def login(request):
    print('entered login')
    errors = User.objects.login_validator(request.POST)
    if len(errors):
        for error in errors:
            messages.error(request, error)
        return redirect('/')
    else:
        request.session['user_id'] = User.objects.filter(email=request.POST['email'])[0].id
        request.session['name'] = User.objects.filter(email=request.POST['email'])[0].name
        request.session['action'] = "logged in"
        print("logged in: ")
        print(request.session['user_id'])
        return redirect('/spotify')

    return redirect('/')

def delete(request):
    print('entered delete')
    b = User.objects.all()
    b.delete()
    return redirect('/')    

def success(request):
    print('entered success')
    return render(request, 'login_registration/success.html')
