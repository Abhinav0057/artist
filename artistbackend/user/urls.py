from django.urls import path
from . import views

urlpatterns = [
	path('register/', views.CreateUser.as_view()),
 	path('get-token/', views.LoginUser.as_view(), name='login'),
  	path('get/me/', views.UserView.as_view()),
   	path('get/user-list/', views.GetUserList.as_view()),
   	path('register/user/', views.RegisterUser.as_view()),
    path('edit/user/<int:pk>/', views.EditUser.as_view()),
    path('delete/user/<int:pk>/', views.DeleteUser.as_view()),
]