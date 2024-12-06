import shortuuid
from django.contrib.auth.decorators import login_required
from django.db.models import Subquery, Q, OuterRef
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.utils.text import slugify
from django.utils.timesince import timesince
from django.views.decorators.csrf import csrf_exempt
from requests import post

from core.models import Post, Comment, ReplyComment, Friend, FriendRequest, Notification, ChatMessage
from userauths.models import User


noti_new_like = "New Like"
noti_new_follower = "New Follower"
noti_friend_request = "Friend Request"
noti_new_comment = "New Comment"
noti_comment_liked = "Comment Liked"
noti_comment_replied = "Comment Replied"
noti_friend_request_accepted = "Friend Request Accepted"

@login_required
def index(request):
    posts = Post.objects.filter(active=True, visibility="Everyone").order_by("-id")
    context = {"posts": posts}
    return render(request, "core/index.html", context)


@login_required
def post_detail(request, slug):
    post = Post.objects.get(slug=slug, active=True, visibility="Everyone")
    context = {"p": post}
    return render(request, "core/post-detail.html", context)


def send_notification(user=None, sender=None, post=None, comment=None, notification_type=None):
    notification = Notification.objects.create(
        user=user,
        sender=sender,
        post=post,
        comment=comment,
        notification_type=notification_type,
    )
    return notification


@csrf_exempt
def create_post(request):
    if request.method == "POST":
        title = request.POST.get("post-caption")
        visibility = request.POST.get("visibility")
        image = request.FILES.get("post-thumbnail")

        uuid_key = shortuuid.uuid()
        uniqueid = uuid_key[:4]

        if title and image:
            post = Post(title=title, image=image, visibility=visibility, user=request.user,
                        slug=slugify(title) + "-" + str(uniqueid.lower()))
            post.save()
            return JsonResponse({"post": {"title": post.title, "image_url ": post.image.url,
                                          "full_name": post.user.profile.full_name,
                                          "profile_image": post.user.profile.image.url,
                                          "date": timesince(post.date), "id": post.id}})
        else:
            return JsonResponse({"error": "Image or title does not exist"})


def like_post(request):
    _id = request.GET['id']
    post = Post.objects.get(id=_id)
    user = request.user
    _bool = False

    if user in post.likes.all():
        post.likes.remove(user)
        _bool = False
    else:
        post.likes.add(user)
        _bool = True

        if post.user != request.user:
            send_notification(post.user, user, post, None, noti_new_like)

    data = {
        "bool": _bool,
        "likes": post.likes.all().count()
    }

    return JsonResponse({"data": data})


def comment_on_post(request):
    id = request.GET['id']
    comment = request.GET['comment']
    post = Post.objects.get(id=id)
    comment_count = Comment.objects.filter(post=post).count()
    user = request.user
    new_comment = Comment.objects.create(user=user, post=post, comment=comment)

    if new_comment.user != post.user:
        send_notification(post.user, user, post, new_comment, noti_new_comment)

    data = {
        "bool": True,
        "comment": new_comment.comment,
        "profile_image": new_comment.user.profile.image.url,
        "date": timesince(new_comment.date),
        "comment_id": new_comment.id,
        "post_id": new_comment.post.id,
        "comment_count": comment_count + int(1)
    }
    return JsonResponse({"data": data})


def like_comment(request):
    id = request.GET['id']
    comment = Comment.objects.get(id=id)
    user = request.user
    _bool = False

    if user in comment.likes.all():
        comment.likes.remove(user)
        _bool = False
    else:
        comment.likes.add(user)
        _bool = True

        if comment.user != user:
            send_notification(comment.user, user, post, comment, noti_comment_liked)

    data = {
        "bool": _bool,
        "likes": comment.likes.all().count()
    }
    return JsonResponse({"data": data})


def reply_comment(request):
    id = request.GET['id']
    reply = request.GET['reply']
    comment = Comment.objects.get(id=id)
    user = request.user
    new_reply = ReplyComment.objects.create(comment=comment, user=user, reply=reply)

    if comment.user != user:
        send_notification(comment.user, user, post, comment, noti_comment_replied)

    data = {
        "bool": True,
        "reply": new_reply.reply,
        "profile_image": new_reply.user.profile.image.url,
        "date": timesince(new_reply.date),
        "reply_id": new_reply.id,
        "post_id": new_reply.comment.post.id
    }
    return JsonResponse({"data": data})


def delete_comment(request):
    id = request.GET['id']
    comment = Comment.objects.get(id=id)
    comment.delete()
    data = {
        "bool": True,
    }
    return JsonResponse({"data": data})


def add_friend(request):
    sender = request.user
    receiver_id = request.GET['id']
    _bool = False
    if sender.id == int(receiver_id):
        return JsonResponse({"error": "You can't send a friend request to yourself!"})

    receiver = User.objects.get(id=receiver_id)
    try:
        friend_request = FriendRequest.objects.get(sender=sender, receiver=receiver)
        print(friend_request)
        if friend_request:
            friend_request.delete()
            _bool = False
        return JsonResponse({"error": "Cancelled", "bool": _bool})
    except FriendRequest.DoesNotExist:
        friend_request = FriendRequest(sender=sender, receiver=receiver)
        friend_request.save()
        _bool = True

        send_notification(receiver, sender, None, None, noti_friend_request)

        return JsonResponse({"success": "Sent", "bool": _bool})


def accept_friend_request(request):
    id = request.GET['id']
    receiver = request.user
    sender = User.objects.get(id=id)
    friend_request = FriendRequest.objects.filter(sender=sender, receiver=receiver).first()
    receiver.profile.friends.add(sender)
    sender.profile.friends.add(receiver)
    friend_request.delete()

    send_notification(sender, receiver, None, None, noti_friend_request_accepted)

    data = {
        "message": "Accepted",
        "bool": True,
    }
    return JsonResponse({"data": data})


def reject_friend_request(request):
    id = request.GET['id']
    receiver = request.user
    sender = User.objects.get(id=id)
    friend_request = FriendRequest.objects.filter(sender=sender, receiver=receiver).first()
    friend_request.delete()

    data = {
        "message": "Rejected",
        "bool": True,
    }
    return JsonResponse({"data": data})


def unfriend(request):
    sender = request.user
    friend_id = request.GET['id']
    _bool = False

    if sender.id == int(friend_id):
        return JsonResponse({"error": "You can't unfriend yourself!"})

    my_friend = User.objects.get(id=friend_id)

    if my_friend in sender.profile.friends.all():
        sender.profile.friends.remove(my_friend)
        my_friend.profile.friends.remove(sender)
        _bool = True
        return JsonResponse({"success": "Friend removed successfully!", "bool": _bool})


@login_required
def inbox(request):
    user_id = request.user.id

    # Obter o último ID de mensagem para cada conversa
    last_message_subquery = ChatMessage.objects.filter(
        conversation_id=OuterRef('conversation_id')
    ).order_by('-date').values('id')[:1]

    # Filtrar mensagens onde o usuário participa e obter as últimas mensagens por conversa
    last_messages = ChatMessage.objects.filter(
        Q(sender=user_id) | Q(receiver=user_id),
        id__in=Subquery(last_message_subquery)
    ).order_by('-date')

    context = {
        "chat_message": last_messages,
    }
    return render(request, "chat/inbox.html", context)


def inbox_detail(request, username):
    user_id = request.user.id

    # Obter o último ID de mensagem para cada conversa
    last_message_subquery = ChatMessage.objects.filter(
        conversation_id=OuterRef('conversation_id')
    ).order_by('-date').values('id')[:1]

    # Filtrar mensagens onde o usuário participa e obter as últimas mensagens por conversa
    message_list = ChatMessage.objects.filter(
        Q(sender=user_id) | Q(receiver=user_id),
        id__in=Subquery(last_message_subquery)
    ).order_by('-date')

    sender = request.user
    receiver = User.objects.get(username=username)
    receiver_details = User.objects.get(username=username)

    message_detail = ChatMessage.objects.filter(
        Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).order_by("date")

    message_detail.update(is_read=True)

    if message_detail:
        r = message_detail.first()
        receiver = User.objects.get(username=r.receiver)
    else:
        receiver = User.objects.get(username=username)

    context = {
        "message_detail": message_detail,
        "receiver": receiver,
        "sender": sender,
        "receiver_details": receiver_details,
        "message_list": message_list
    }

    return render(request, "chat/inbox_detail.html", context)


def block_user(request):  # sourcery skip: avoid-builtin-shadow
    id = request.GET['id']
    user = request.user
    friend = User.objects.get(id=id)

    if user.id == friend.id:
        return JsonResponse({"error": "You cannot block yourself"})

    user.profile.blocked.add(friend)
    if friend in user.profile.friends.all():
        user.profile.friends.remove(friend)
        friend.profile.friends.remove(user)

    return JsonResponse({"success": "User Blocked"})