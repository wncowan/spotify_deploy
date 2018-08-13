# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect, HttpResponse
from ..login_registration.models import User
from .models import Songs

def index(request):
    user = User.objects.get(id=request.session['user_id'])
    songs = Songs.objects.all()
    context = {
        'user': user,
        'Song': songs
    }
    return render(request, "spotify/index.html", context)

def user(request):
    user = User.objects.get(id=request.session['user_id'])
    music = Songs.objects.filter(liked_others = request.session['user_id'])
    print len(music)
    song_array = ""
    for i in range(len(music)):
        song_array += music[i].song + ' '
    print song_array
    context = {
        'User': user,
        'Song': song_array
    }
    return render(request,"spotify/user.html",context)

def logout(request):
    request.session.flush()
    return redirect('/')

def showTrack(request, track_id):
    print "track id:", track_id
    user = User.objects.get(id=request.session['user_id'])
    songs = Songs.objects.get_or_create(song = track_id)
    context={
        'track_id': track_id,
        'person' : user,
        'Song': songs[0]
    }
    return render(request, "spotify/track.html", context)

def likedsongs(request,route, track_id):
    if route == 'index':
        Song = track_id
        users = User.objects.get(id = request.session['user_id'])
        songs = Songs.objects.get_or_create(song = track_id)
        songs[0].liked_others.add(users)
        songs[0].save()
        return redirect('/spotify')
    if route == 'tracks':
        Song = track_id
        users = User.objects.get(id = request.session['user_id'])
        songs = Songs.objects.get_or_create(song = track_id)
        songs[0].liked_others.add(users)
        songs[0].save()
        return redirect('/spotify/tracks/{}'.format(Song))

def unlikedsongs(request,route, track_id):
    if route == 'index':
        Song = track_id
        users = User.objects.get(id = request.session['user_id'])
        songs = Songs.objects.get_or_create(song = track_id)
        songs[0].liked_others.remove(users)
        return redirect('/spotify')
    if route == 'user':
        Song = track_id
        users = User.objects.get(id = request.session['user_id'])
        songs = Songs.objects.get_or_create(song = track_id)
        songs[0].liked_others.remove(users)
        return redirect('/spotify/user')
    if route == 'tracks':
        Song = track_id
        users = User.objects.get(id = request.session['user_id'])
        songs = Songs.objects.get_or_create(song = track_id)
        songs[0].liked_others.remove(users)
        return redirect('/spotify/tracks/{}'.format(Song))

def likebutton(request,route,track_id):
    songs = Songs.objects.get_or_create(song = track_id)
    user = User.objects.get(id = request.session['user_id'])
    print songs
    context = {
        'Song': songs[0],
        'user': user,
        'route': route
    }
    return render(request, "spotify/_like.html",context)

def artist(request,artistid):
    
    user = User.objects.get(id=request.session['user_id'])

    context = {
        "Username" : user,
        "artist_id" : artistid
    }
    return render(request,"spotify/artist.html", context)
