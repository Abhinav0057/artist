from rest_framework import serializers
from .models import User

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, get_user_model


class CreateUserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'phone', 'dob', "gender","address","role_type")

