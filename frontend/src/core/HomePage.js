import React, { useState, useEffect } from 'react';
import BaseLayout from './BaseLayout';
import './layouts/HomePage.css';
import axios from 'axios';

function HomePage() {
  const [posts, setPosts] = useState([]);

  // Função para carregar os posts da API
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get('/'); // URL do endpoint
        console.log(response.data);
        
        setPosts(response.data); // Atualiza o estado com os dados
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchPosts();
  }, []);

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
          <h2>Feed</h2>
          {posts && posts.length > 0 && posts.map((post) => (
            <div className="post" key={post.id}>
              <h4>{post.title}</h4>
              <p>{post.content || 'No content available.'}</p>
              <small>By: {post.user ? post.user.email : 'Unknown'}</small>
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
