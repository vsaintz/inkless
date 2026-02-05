from django.contrib import admin
from django.urls import path
from users.views import UserProfileView
from users.views import health_check

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/me/", UserProfileView.as_view()),
    path("api/health", health_check),
]
