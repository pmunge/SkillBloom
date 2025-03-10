from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Skill, UserProfile

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name', 'description', 'points_cost']

class UserProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True, source='user.skills')

    class Meta:
        model = UserProfile
        fields = ['credits', 'skills']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True, source='userprofile')

    class Meta:
        model = User
        fields = ['username', 'profile']