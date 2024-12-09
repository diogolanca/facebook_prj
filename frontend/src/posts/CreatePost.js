import React, { useState } from 'react';
import axios from 'axios';
import './CreatePost.css';

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // Pré-visualização da imagem
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Define a pré-visualização
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('post-caption', title);
    formData.append('post-thumbnail', image);

    try {
      const response = await axios.post('http://127.0.0.1:8000/create_post/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.post) {
        onPostCreated(response.data.post);
        setTitle('');
        setImage(null);
        setPreview(null); // Limpa a pré-visualização após o envio
      } else {
        setError('Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Error creating post');
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
        <button type="submit">Post</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CreatePost;
