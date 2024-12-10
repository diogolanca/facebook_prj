from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from userauths import views

app_name = "userauths"

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("sign-up/", views.register_view, name="sign-up"),
    path("sign-in/", views.login_view, name="sign-in"),
    path("sign-out/", views.logout_view, name="sign-out"),
    path("my-profile/", views.my_profile, name="my-profile"),
    path("profile/<username>", views.friend_profile, name="profile")
]