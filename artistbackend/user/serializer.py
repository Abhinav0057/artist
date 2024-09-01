from rest_framework import serializers
from .models import User
class CreateUserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'phone', 'dob', "gender","address","role_type")

