import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Evita o recarregamento padrão do formulário

    // Simulação de autenticação (substitua pela sua lógica real)
    if (usuario === 'admin' && senha === '123456') {
      // Autenticação bem-sucedida, redireciona para a página inicial
      navigate('/inicial');
    } else {
      // Autenticação falhou, exibe mensagem de erro
      setErro('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="login-body">
      <main className="login-container">
        <header className="login-header">
          <h1>Login</h1>
          <p>Bem-vindo de volta! Faça login para continuar.</p>
          <p id="mensagem-usuario" className="erro-mensagem">{erro}</p> {/* Exibe a mensagem de erro */}
        </header>

        <form id="login-form" onSubmit={handleSubmit}> {/* Adiciona o manipulador de submit */}
          <div className="input-group">
            <label htmlFor="usuario">
              <FontAwesomeIcon icon={faUser} /> Usuário
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Digite seu nome"
              autoComplete="username"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">
              <FontAwesomeIcon icon={faLock} /> Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login">
            <FontAwesomeIcon icon={faSignInAlt} /> Entrar
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;