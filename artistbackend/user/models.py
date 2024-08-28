from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import CustomUserManager

class User(AbstractBaseUser, PermissionsMixin):
    GENDER = [("m","m"),("f","f"),("o","o")]
    ROLE_TYPE = [("super_admin","super_admin"),("artist_manager","artist_manager"),("artist","artist")]
    class Meta:
        db_table="user"


    
    first_name  = models.CharField( null=True,blank=True, max_length=255 )
    last_name  = models.CharField( null=True,blank=True, max_length=255 )
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    phone = models.CharField(max_length=20)
    dob = models.DateField(null=True,blank=True)
    gender  = models.CharField(choices =GENDER, null=True,blank=True, max_length=1 )
    address = models.CharField(max_length=255, blank=True)
    role_type = models.CharField(choices =ROLE_TYPE, null=True,blank=True, max_length=20 )
    is_staff = models.BooleanField(default=False)  
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email





    