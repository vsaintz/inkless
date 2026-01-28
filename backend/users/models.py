from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
from django.db import models


class User(AbstractUser):
    username = None
    email = models.EmailField("email address", unique=True)

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)

    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
