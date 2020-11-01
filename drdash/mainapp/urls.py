from . import views
from django.urls import path, re_path

urlpatterns = [
    path('', views.mainfunc, name="main"),
    path('insert', views.insert_new, name="insert"),
    path('update', views.update, name="update"),
]