# Hackathon Feedback App - Mobile

<div style="display:flex;flex-wrap:wrap;gap:16px;">
	<figure style="margin:0;text-align:center;">
		<img src="./assets/images/logo.png" width="300" />
	</figure>
</div>

O **Hackathon Feedback App** é o aplicativo mobile do projeto do hackathon com o tema **"Auxilio aos professores e professoras no ensino publico"**. O objetivo é oferecer um canal simples e acessivel para que estudantes enviem feedbacks sobre aulas, palestras e materias, enquanto professores e escolas acompanham a percepcao das turmas e tomam decisoes baseadas em dados.

`* Renato Carapiá Brunetti / RM362132`

[Repositório GitHub](https://github.com/RenatoBrunetti/fiap-postech-5fsdt-fase5-hackathon-mobile)

## Telas

### Telas Publicas

<div style="display:flex;flex-wrap:wrap;gap:16px;">
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/splash.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/login.png" width="300" />
	</figure>
</div>

### Telas Autenticadas (Aluno)

<div style="display:flex;flex-wrap:wrap;gap:16px;">
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/student/student-home.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/student/student-feedback-available.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/student/student-feedback-fill-out.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/student/student-feedback-view.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/student/student-profile.png" width="300" />
	</figure>
</div>

### Telas Autenticadas (Professor)

<div style="display:flex;flex-wrap:wrap;gap:16px;">
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/teacher/teacher-home.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/teacher/teacher-feedback-view.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/teacher/teacher-feedback-create.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/teacher/teacher-profile.png" width="300" />
	</figure>
</div>

### Telas Autenticadas (Admin)

<div style="display:flex;flex-wrap:wrap;gap:16px;">
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-home.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-teacher.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-teacher-create.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-teacher-profile.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-school.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-school-create.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-school-class.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-school-class-create.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-school-class-student.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-school-class-student-link.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-school-class-student-profile.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-school-class-teacher.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-school-class-teacher-link.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-school-class-teacher-profile.png" width="300" />
	</figure>
	<figure style="margin:0;text-align:center;">
		<img src="./assets/screens/admin/admin-profile.png" width="300" />
	</figure>
</div>
<br>
<br>

# ⛭ Informacoes Tecnicas

## → Objetivo do serviço

- Fornecer uma experiencia mobile rapida e intuitiva para alunos e professores.
- Registrar feedbacks e respostas por alunos.
- Integrar-se com a API do backend para autenticacao e dados.

## → Tecnologias utilizadas

- **React Native** com **Expo** para app cross-platform.
- **TypeScript** para tipagem e manutenção.
- **Expo Router** para navegação.
- **Axios** para integração com API.
- **React Hook Form** + **Zod** para formulários e validação.
- **Expo Secure Store** para armazenamento seguro de tokens.
- **Lottie** para animacoes leves.

## → Arquitetura do sistema

O app utiliza uma arquitetura modular, com camadas de **telas**, **servicos de API**, **contextos de autenticacao** e **tipos compartilhados**. Isso organiza a logica de negócio e reduz acoplamento entre UI e infraestrutura.

```mermaid
flowchart TD
	U[Usuario] --> M[App Mobile - React Native]
	M --> S[Camada de Servicos - Axios]
	S --> B[API REST - Backend]
	B --> D[(PostgreSQL)]
```

## → Fluxo de execução (local)

Pre-requisitos:

- Node.js (LTS)
- Expo CLI
- Emulador (Android Studio / Xcode) ou Expo Go

Passos basicos:

1. Instale dependencias: `npm install`
2. Rode o app: `npm start`
3. Use o QR Code no Expo Go ou execute emulador.
