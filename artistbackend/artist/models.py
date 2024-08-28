from django.db import models
from user.models import User


class Artist(models.Model):
    GENDER = [("m","m"),("f","f"),("o","o")]

    class Meta:
        db_table = "artist"
    
    name = models.CharField(max_length=255)
    dob = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    gender  = models.CharField(choices =GENDER, null=True,blank=True, max_length=1 )
    first_release_year = models.PositiveSmallIntegerField()
    no_of_albums_released = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Music(models.Model):
    GENRE = [('rnb','rnb'),('country','country'),('classic','classic'),('rock','rock'),('jazz','jazz')]
    
    class Meta:
        db_table ="music"
    
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    album_name = models.CharField(max_length=255)
    genre = models.CharField(choices = GENRE, max_length=10)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
