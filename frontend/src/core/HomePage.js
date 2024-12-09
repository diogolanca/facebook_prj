import React, { useState, useEffect } from 'react';
import BaseLayout from './BaseLayout';
import './layouts/HomePage.css';
import axios from 'axios';
import CreatePost from '../posts/CreatePost';

function HomePage() {
  const [posts, setPosts] = useState([]);

  
  // Função para carregar os posts da API
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/'); // URL do endpoint
        setPosts(response.data); // Atualiza o estado com os dados
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <BaseLayout>
      <div className="homepage-container">
        {/* Sidebar Esquerda */}
        <aside className="sidebar left-sidebar">
          <h3>Online Courses</h3>
          <ul>
            <li>Web Development Basics</li>
            <li>React Advanced Techniques</li>
            <li>Designing for Accessibility</li>
          </ul>
        </aside>

        {/* Conteúdo Principal */}
        <main className="feed">
          <CreatePost onPostCreated={handlePostCreated} />
          <h2>Feed</h2>
          {posts && posts.length > 0 && posts.map((post) => (
            <div className="post" key={post.id}>
              {/* Cabeçalho do post */}
              <div className="post-header">
                <img
                  src={post.user.image}
                  alt={`${post.user.username} profile`}
                />
                <div className="author-info">
                  <span>{post.user.username}</span>
                  <small>{new Date(post.created_at).toLocaleString()}</small>
                </div>
              </div>

              {/* Conteúdo do post */}
              <div className="post-content">
                <p>{post.content || 'No content available.'}</p>
                {post.image_url && <img src={post.image_url} alt={post.title} />}
              </div>
            </div>
          ))}
        </main>

        {/* Sidebar Direita */}
        <aside className="sidebar right-sidebar">
          <h3>Upcoming Events</h3>
          <ul>
            <li>React Meetup - Jan 10</li>
            <li>JavaScript Conference - Feb 15</li>
            <li>UX Design Workshop - Mar 5</li>
          </ul>
        </aside>
      </div>
    </BaseLayout>
  );
}

export default HomePage;
