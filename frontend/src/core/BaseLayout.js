import React from 'react';
import './layouts/BaseLayout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function BaseLayout({ children }) {
  return (
    <div>
      {/* Cabeçalho */}
      <header>
        <h1>What I Want</h1>
        <nav>
          <ul>
            <li>
              <a href="/">
                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                Home
              </a>
            </li>
            <li>
              <a href="/profile">
                <FontAwesomeIcon icon={faUser} className="nav-icon" />
                Profile
              </a>
            </li>
            <li>
              <a href="/messages">
                <FontAwesomeIcon icon={faEnvelope} className="nav-icon" />
                Messages
              </a>
            </li>
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
