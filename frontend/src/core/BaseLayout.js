import React from 'react';
import './layouts/BaseLayout.css';

function BaseLayout({ children }) {
  return (
    <div>
      {/* Cabeçalho */}
      <header>
        <h1>What I Want</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/messages">Messages</a></li>
          </ul>
        </nav>
      </header>

      {/* Conteúdo Dinâmico */}
      <main>{children}</main>

      {/* Rodapé */}
      <footer>
        <p>&copy; 2024 Socialite. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default BaseLayout;
