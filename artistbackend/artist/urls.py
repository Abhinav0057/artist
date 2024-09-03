from django.urls import path
from . import views

urlpatterns = [
	path('create/artist/', views.CreateArtist.as_view()),
	path('delete/artist/<str:pk>/', views.DeleteArtist.as_view()),
    path('get/artist/list/', views.GetArtistList.as_view()),
]