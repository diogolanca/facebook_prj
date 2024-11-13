from django.urls import path
from core import views

app_name = "core"

urlpatterns = [
    path("", views.index, name="feed"),
    path("create_post/", views.create_post, name="create_post"),
    path("like_post/", views.like_post, name="like_post"),
    path("comment_post/", views.comment_on_post, name="comment_post")
]