from django.urls import path
from . import views

urlpatterns = [
	path('register/', views.CreateUser.as_view()),
 	path('get-token/', views.LoginUser.as_view(), name='login'),
  	path('get/me/', views.UserView.as_view()),
]