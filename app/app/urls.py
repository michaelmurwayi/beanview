"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api import views
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
# creating router and registering our viewsets
router = DefaultRouter()
router.register(r'user', views.UserViewSet, basename='user')
router.register(r'farmers', views.FarmersViewSet, basename='farmers')
router.register(r'coffee', views.CoffeeViewSet, basename='coffee')
router.register(r'catalogue', views.CatalogueViewSet, basename='catalogue')
# router.register(r'lots', views.LotsViewSet, basename='lots')



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token', obtain_auth_token)
]


