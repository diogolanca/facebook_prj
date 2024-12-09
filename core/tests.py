from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Post, Comment
from userauths.models import User

# class PostAPITests(TestCase):
    # def setUp(self):
    #     # Create a test user and authenticate
    #     self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='password123')
    #     self.client = APIClient()
    #     self.client.force_authenticate(user=self.user)

    #     # Create a test post
    #     self.post = Post.objects.create(user=self.user, title='Test Post', visibility='Everyone')

    # def test_get_posts(self):
    #     # Test the GET /posts/ endpoint
    #     response = self.client.get('/posts/')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertIn('Test Post', str(response.data))

    # def test_create_post(self):
    #     # Test the POST /posts/ endpoint
    #     data = {'user': self.user.id, 'title': 'New Post', 'visibility': 'Everyone'}
    #     response = self.client.post('/posts/', data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(Post.objects.count(), 2)

    # def test_update_post(self):
    #     # Test the PUT /posts/{id}/ endpoint
    #     data = {
    #         'title': 'Updated Post',
    #         'visibility': 'Only Me',
    #         'user': self.user.id,
    #     }
    #     response = self.client.put(f'/posts/{self.post.id}/', data)
    #     print(response.data)  # Debugging
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.post.refresh_from_db()
    #     self.assertEqual(self.post.title, 'Updated Post')

    # def test_delete_post(self):
    #     # Test the DELETE /posts/{id}/ endpoint
    #     response = self.client.delete(f'/posts/{self.post.id}/')
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     self.assertEqual(Post.objects.count(), 0)

class CommentAPITests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='password123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.post = Post.objects.create(user=self.user, title='Test Post', visibility='Everyone')
        self.comment = Comment.objects.create(post=self.post, user=self.user, content='Test Comment')

    def test_create_comment(self):
        data = {'post': self.post.id, 'user': self.user.id, 'content': 'New Comment'}
        response = self.client.post('/comments/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)

    def test_update_comment(self):
        data = {'content': 'Updated Comment'}
        response = self.client.put(f'/comments/{self.comment.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.comment.refresh_from_db()
        self.assertEqual(self.comment.content, 'Updated Comment')

    def test_delete_comment(self):
        response = self.client.delete(f'/comments/{self.comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comment.objects.count(), 0)