from rest_framework import serializers
from .models import Artist,Music
# from user.models import User
from django.db import connection

class CreateArtistSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    gender = serializers.CharField(required=True)
    first_release_year = serializers.CharField(required=True)
    no_of_albums_released = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    dob = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)

    def validate_email(self, email):
        cursor = connection.cursor()
        query = "SELECT COUNT(*) FROM user WHERE email = %s"
        cursor.execute(query, [email])
        count = cursor.fetchone()[0]
        
        if count > 0:
            raise serializers.ValidationError("Email already exists")
        
        return email


class ArtistUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    gender = serializers.CharField(required=True)
    first_release_year = serializers.CharField(required=True)
    no_of_albums_released = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    dob = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    
class CreateSongSerializer(serializers.Serializer):
    title = serializers.CharField(required=True)
    genre = serializers.CharField(required=True)
    album_name = serializers.CharField(required=True)