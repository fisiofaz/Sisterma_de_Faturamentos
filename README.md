# 🧾 Sistema de Faturamento de Lojas

Projeto em desenvolvimento para gerenciamento diário de faturamento de três lojas físicas: a matriz **Ortofisi'us**, e as filiais **Fisiomed Centro** e **Fisiomed Camobi**.

## 🚀 Objetivo do Projeto

Criar um sistema simples e funcional onde o faturamento de cada loja seja registrado diariamente, com possibilidade de:
- Visualizar o histórico de faturamento
- Imprimir relatórios
- Evoluir o sistema com novos recursos e tecnologias

Este projeto será incrementado continuamente e faz parte do meu portfólio de estudos Full Stack.

## 🛠 Tecnologias utilizadas (etapa atual)

- HTML5
- CSS3
- JavaScript (vanilla)
- LocalStorage (armazenamento local)
- Visual Studio Code
- Git e GitHub

## 🗂 Estrutura Inicial do Projeto

```bash
faturamento-lojas/
├── lojas/
│   ├── ortofisius.html
│   ├── fisiomed-centro.html
│   ├── fisiomed-camobi.html
├── historico.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── ortofisius.js
│   ├── fisiomed-centro.js
│   ├── fisiomed-camobi.js
├── README.md
├── .gitignore
└── index.html
```

## 📌 Funcionalidades da primeira etapa - v.1.0
 
 - Página da loja Ortofisi'us

 - Cadastro de faturamento com data e valor

 - Exibição de histórico na tela

 - Armazenamento local (temporário)

 - Estrutura básica para as demais lojas

## 📌 Funcionalidades da segunda etapa - v.1.1

- Impressão de relatórios

- Autenticação de usuário

- Histórico geral por loja

- Filtros por período

## 📌 Funcionalidades da segunda etapa - v.1.2

1. Dashboard Geral com Resumo:

 Criar uma página de dashboard com:

- Total faturado por loja.

- Gráficos simples (ex: com Chart.js) por loja.

- Destaques do mês (valores mais altos, média, etc.).

2. Edição e Exclusão dos Registros

Nos históricos, incluir botões:

- ✏️ Editar

- 🗑️ Excluir

- Atualizar o localStorage dinamicamente.

## 📈 Funcionalidades futuras

1. Armazenamento em Nuvem (versão intermediária)

- Substituir localStorage por Firebase ou Supabase para armazenamento real dos dados.

- Benefício: acesso em tempo real, múltiplos dispositivos.

2. Controle de Acessos e Perfis

- Criar perfis (admin, gestor, etc.).

- Diferentes permissões para visualizar e editar os dados.

3. Melhorias Visuais e de UX

- Animações suaves nas transições de páginas.

- Feedback visual ao salvar/excluir/editar.

- Tooltip nos ícones.

- PWA (Progressive Web App) para rodar como app em celular.


## 💻 Como executar o projeto

1. Clone este repositório:

```
git clone https://github.com/seuusuario/faturamento-lojas.git
```

2. Acesse o projeto no VSCode:

```
cd faturamento-lojas
code .
```

3. Abra `index.html` ou `lojas/ortofisius.html` em seu navegador

## 📅 Atualizações e Versões

v0.1 – Estrutura inicial + Página Ortofisi'us <br>
v1.0 - Estrutura basica completa com todas as paginas<br>
v1.1 - Impressão de relatórios e login de autenticação <br>
v1.2 - Dashboard Geral com Resumo e Edição e Exclusão dos Registros

Desenvolvido com dedicação por Fábio André Zatta 🚀