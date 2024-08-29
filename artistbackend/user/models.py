from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Group, Permission

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
    GENDER = [("m","Male"),("f","Female"),("o","Other")]
    ROLE_TYPE = [("super_admin","Super Admin"),("artist_manager","Artist Manager"),("artist","Artist")]

    first_name = models.CharField(null=True, blank=True, max_length=255)
    last_name = models.CharField(null=True, blank=True, max_length=255)
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(choices=GENDER, null=True, blank=True, max_length=10)
    address = models.CharField(max_length=255, blank=True)
    role_type = models.CharField(choices=ROLE_TYPE, null=True, blank=True, max_length=20)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        db_table = 'user'
