from django import forms
from django.contrib.auth.forms import UserCreationForm

from userauths.models import User


class UserRegistrationForm(UserCreationForm):
    full_name = forms.CharField(widget=forms.TextInput(attrs={'id': "", 'placeholder': "Full Name"}), max_length=100, required=True)
    username = forms.CharField(widget=forms.TextInput(attrs={'id': "", 'placeholder': "Username"}), max_length=100, required=True)
    phone = forms.CharField(widget=forms.TextInput(attrs={'id': "", 'placeholder': "Phone"}), max_length=100, required=True)
    email = forms.CharField(widget=forms.TextInput(attrs={'id': "", 'placeholder': "Email"}), max_length=100, required=True)
    password1 = forms.CharField(widget=forms.TextInput(attrs={'id': "", 'placeholder': "Password"}), max_length=100, required=True)
    password2 = forms.CharField(widget=forms.TextInput(attrs={'id': "", 'placeholder': "Confirm Password"}), max_length=100, required=True)

    class Meta:
        model = User
        fields = ['full_name', 'username', 'email', 'phone', 'gender', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = "with-border"

