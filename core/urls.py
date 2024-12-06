from django.urls import path
from core import views

app_name = "core"

urlpatterns = [
    path("", views.index, name="feed"),
    path("post/<slug:slug>/", views.post_detail, name="post-detail"),
    path("create_post/", views.create_post, name="create_post"),
    path("like_post/", views.like_post, name="like_post"),
    path("comment_post/", views.comment_on_post, name="comment_post"),
    path("like_comment/", views.like_comment, name="like_comment"),
    path("reply_comment/", views.reply_comment, name="reply_comment"),
    path("delete_comment/", views.delete_comment, name="delete_comment"),
    path("add_friend/", views.add_friend, name="add_friend"),
    path("accept_friend_request/", views.accept_friend_request, name="accept_friend_request"),
    path("reject_friend_request/", views.reject_friend_request, name="reject_friend_request"),
    path("unfriend/", views.unfriend, name="unfriend"),
    path("core/inbox/", views.inbox, name="inbox"),
    path("core/inbox/<username>/", views.inbox_detail, name="inbox_detail"),
    path("block_user/", views.block_user, name="block_user")
]