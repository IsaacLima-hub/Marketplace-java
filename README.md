# 🚗 Marketplace de Veículos

Projeto desenvolvido em Java + Spring Boot com frontend em HTML, CSS e JavaScript.

O sistema funciona como um marketplace de veículos onde usuários podem:

- Criar anúncios
- Visualizar veículos
- Reservar veículos
- Realizar pagamento de entrada via Mercado Pago
- Gerenciar perfil
- Administrar usuários

---

# 📸 Funcionalidades

## 👤 Usuários
- Cadastro
- Login
- Perfil do usuário
- Máscara e validação de CPF
- Máscara e validação de telefone

---

## 🚘 Veículos
- Cadastro de veículos
- Upload de imagem
- Listagem de anúncios
- Página de detalhes
- Edição de anúncios
- Exclusão de anúncios

---

## 💳 Pagamentos
Integração com Mercado Pago:

- Checkout Pro
- Pagamento de 10% da entrada
- Reserva automática após pagamento
- Página de sucesso personalizada

---

## 🔒 Sistema de Reserva
Após o pagamento:
- veículo fica reservado
- aparece na página de reservados
- indisponível para outros usuários

---

# 🛠️ Tecnologias Utilizadas

## Backend
- Java 17
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate
- MySQL

## Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5

## APIs
- Mercado Pago SDK Java

---

# 📂 Estrutura do Projeto

```bash
src/
 ├── controller/
 ├── model/
 ├── repository/
 ├── config/
 └── resources/

frontend/
 ├── index.html
 ├── detalhes.html
 ├── sucesso.html
 ├── script.js
 └── style.css
