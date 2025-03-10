from django.urls import path
from .views import hello_world, exchange_skill, get_user_credits, UserProfileView

urlpatterns = [
    path('hello/', hello_world),
    path('exchange-skill/', exchange_skill, name='exchange-skill'),
    path("api/user/<int:user_id>/credits/", get_user_credits, name="user_credits"),
    path('api/user/<str:username>/', UserProfileView.as_view(), name='user-profile'),

]
