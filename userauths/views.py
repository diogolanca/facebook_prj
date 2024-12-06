import json

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect

from core.models import Post, FriendRequest
from userauths.forms import UserRegistrationForm
from userauths.models import Profile, User


def register_view(request):
    if request.user.is_authenticated:
        messages.warning(request, "You are registered!")
        return redirect("core:feed")

    form = UserRegistrationForm(request.POST or None)
    if form.is_valid():
        form.save()
        full_name = form.cleaned_data.get("full_name")
        phone = form.cleaned_data.get("phone")
        email = form.cleaned_data.get("email")
        password = form.cleaned_data.get("password1")

        user = authenticate(email=email, password=password)
        login(request, user)

        messages.success(request, f"Hi {full_name}. Your account was created successfully.")
        profile = Profile.objects.get(user=request.user)
        profile.full_name = full_name
        profile.phone = phone
        profile.save()
        return redirect("core:feed")

    context = {
        "form": form
    }
    return render(request, "userauths/sign-up.html", context)


def login_view(request):
    if request.user.is_authenticated:
        messages.warning(request, "You are already logged in!")
        return redirect("core:feed")
    if request.method == "POST":
        name = request.POST.get("email")
        password = request.POST.get("password")
        try:
            if '@' in name:
                user = authenticate(email=name, password=password)
            else:
                login_user = User.objects.filter(username=name)
                if len(login_user) > 0:
                    user = authenticate(username=login_user[0].email, password=password)
                else:
                    messages.error(request, "Wrong Username or password")
                    return redirect("userauths:sign-up")
            if user is not None:
                login(request, user)
                return redirect("core:feed")
            else:
                messages.error(request, "Wrong Username or password")
                return redirect("userauths:sign-up")
        except Exception as ex:
            print(ex)
            messages.error(request, "Something went wrong please try again in a few minutes.")
            return redirect("userauths:sign-up")

    return HttpResponseRedirect("/")


def logout_view(request):
    logout(request)
    messages.success(request, "you are logged out")
    if not request.user.is_authenticated:
        return redirect("userauths:sign-up")


@login_required
def my_profile(request):
    profile = request.user.profile
    posts = Post.objects.filter(active=True, user=request.user).order_by("-id")
    context = {
        "profile": profile,
        "posts": posts
    }
    return render(request, "userauths/my-profile.html", context)


@login_required
def friend_profile(request, username):
    profile = Profile.objects.get(user__username=username)
    if request.user.profile == profile:
        return redirect("userauths:my-profile")

    posts = Post.objects.filter(active=True, user=profile.user).order_by("-id")
    _bool = False
    bool_friend = False
    sender = request.user
    receiver = profile.user

    try:
        friend_request = FriendRequest.objects.get(sender=sender, receiver=receiver)
        if friend_request:
            _bool = True
        else:
            _bool = False
    except:
        _bool = False

    context = {
        "profile": profile,
        "posts": posts,
        "bool": _bool,
        "posts": posts
    }
    return render(request, "userauths/friend-profile.html", context)

