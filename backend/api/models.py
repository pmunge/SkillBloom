from django.db import models
from django.contrib.auth.models import User

class Skill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=255)
    description = models.TextField()
    points_cost = models.PositiveIntegerField(default=10)  

    def __str__(self):
        return f"{self.name} - {self.user.username}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, null=True, blank=True)
    credits = models.IntegerField(default=50)  # Starting credits

    def __str__(self):
        return f"{self.user.username} - {self.credits} credits"

class Transaction(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_transactions")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_transactions")
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    points_transferred = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} paid {self.receiver.username} {self.points_transferred} points for {self.skill.name}"

