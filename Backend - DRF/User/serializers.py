from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import authenticate


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "username", "email")


class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(
        write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(
        write_only=True, style={'input_type': 'password'})

    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "password1", "password2")
        extra_kwargs = {
            "username": {"validators": []},  
            "email": {"validators": []},   
        }

    def validate(self, attrs):
        errors = {}

        password1 = attrs.get("password1", "")
        password2 = attrs.get("password2", "")

        if len(password1) < 8:
            errors["password1"] = "Password must be at least 8 characters!"

        if password1 != password2:
            errors["password2"] = "Passwords do not match!"

        if CustomUser.objects.filter(username=attrs.get("username")).exists():
            errors["username"] = "A user with that username already exists."

        if CustomUser.objects.filter(email=attrs.get("email")).exists():
            errors["email"] = "user with this email already exists."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password1")
        validated_data.pop("password2")

        return CustomUser.objects.create_user(password=password, **validated_data)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials!")
