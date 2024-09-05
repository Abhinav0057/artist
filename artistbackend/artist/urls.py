from django.urls import path
from . import views

urlpatterns = [
	path('create/artist/', views.CreateArtist.as_view()),
	path('edit/artist/<str:pk>/', views.UpdateArtist.as_view()),
	path('delete/artist/<str:pk>/', views.DeleteArtist.as_view()),
    path('get/artist/list/', views.GetArtistList.as_view()),
    path("get/artist/song/list/<str:pk>/",views.GetSongsList.as_view()),
    path("create/artist/song/",views.CreateSong.as_view()),
    path("edit/artist/song/<str:pk>/",views.UpdateSong.as_view()),
    path("delete/artist/song/<str:pk>/",views.DeleteSong.as_view()),
    # files
    path("get/sample/artist/",views.GetSampleArtistFile.as_view()),
    path("get/all/artist/",views.GetAllArtistFile.as_view()),
    path("upload/bulk/artist/",views.BulkUploadArtists.as_view()),
    
]