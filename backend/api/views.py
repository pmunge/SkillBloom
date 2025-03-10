from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import status
from .models import UserProfile, Skill, Transaction
from rest_framework.views import APIView
from .serializers import UserSerializer

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, SkillBloomers!"})

@api_view(["POST"])
def exchange_skill(request):
    sender = request.user
    receiver_id = request.data.get("receiver_id")
    skill_id = request.data.get("skill_id")

    receiver = get_object_or_404(User, id=receiver_id)
    skill = get_object_or_404(Skill, id=skill_id, user=receiver)
    
    sender_profile = get_object_or_404(UserProfile, user=sender)
    receiver_profile = get_object_or_404(UserProfile, user=receiver)

    if sender_profile.credits < skill.points_cost:
        return Response({"error": "Insufficient credits"}, status=status.HTTP_400_BAD_REQUEST)

    # Deduct points from sender
    sender_profile.credits -= skill.points_cost
    sender_profile.save()

    # Add points to receiver
    receiver_profile.credits += skill.points_cost
    receiver_profile.save()

    # Create transaction record
    Transaction.objects.create(
        sender=sender,
        receiver=receiver,
        skill=skill,
        points_transferred=skill.points_cost
    )

    return Response({"message": "Transaction successful"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])

def get_user_credits(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        profile = UserProfile.objects.get(user=user)
        return JsonResponse({"points": profile.points})
    except UserProfile.DoesNotExist:
        return JsonResponse({"points": 0})


class UserProfileView(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)
