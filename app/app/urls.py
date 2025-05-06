from django.contrib import admin
from django.urls import path, include
from api import views
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from django.conf import settings
from django.conf.urls.static import static

# Create router and register viewsets
router = DefaultRouter()
router.register(r'user', views.UserViewSet, basename='user')
router.register(r'farmers', views.FarmersViewSet, basename='farmers')
router.register(r'coffee', views.CoffeeViewSet, basename='coffee')
router.register(r'catalogue', views.CatalogueViewSet, basename='catalogue')
# router.register(r'lots', views.LotsViewSet, basename='lots')

# Define urlpatterns first
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token', obtain_auth_token),
]

# Then append static files route
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
