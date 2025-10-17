# Español
Pawsi es mi proyecto más destacado: una aplicación móvil diseñada para ayudar a localizar y adoptar mascotas en Argentina. Fue desarrollada, diseñada y publicada por mí en Google Play, gestionando todo el ciclo: UI/UX, desarrollo, pruebas, despliegue y promoción. La app conecta a usuarios, mascotas perdidas y veterinarios, ofreciendo geolocalización, filtros por raza, género y estado de salud, y funciones de comunicación entre usuarios.

# Tecnologías utilizadas
Frontend / Mobile: React, Capacitor, TypeScript, Tailwind CSS
Backend: Supabase (PostgreSQL), NextAuth
Mapas y Geolocalización: Mapbox
Email: Resend
Autenticación y seguridad: NextAuth, Cloudflare Turnstile
Almacenamiento de archivos: Cloudinary

# Herramientas de desarrollo:
 VS Code, Android Studio, Git & GitHub

# Funcionalidades principales
Publicación y búsqueda de mascotas perdidas o en adopción
Filtros por raza, color, género y estado de salud
Geolocalización y navegación GPS
Conexión entre usuarios y veterinarios
Gestión de usuarios, notificaciones y administración de contenidos

# Cómo ejecutar / construir el proyecto
Cloná el repositorio:
git clone https://github.com/tuusuario/pawsi-app.git
cd pawsi-app
Instalá dependencias:

bash
Copiar código
npm install
Crea un archivo .env basado en .env.example:

bash
Copiar código
cp .env.example .env
Rellena tus claves reales en .env.

Ejecuta la app:

bash
Copiar código
npm run dev
o construí la app para producción:

bash
Copiar código
npm run build
npm run preview


# Rol y contribuciones:
-Desarrollo full-stack y diseño de UI/UX

-Publicación en Google Play

-Entrevistas a usuarios, soporte y campaña de lanzamiento

-Integración con APIs y servicios externos (Supabase, Mapbox, Cloudinary, Resend)









# English

Pawsi is my most notable project: a mobile app designed to help locate and adopt pets across Argentina. I handled the entire lifecycle — design, development, testing, deployment, and promotion. The app connects users, lost pets, and veterinarians, offering geolocation, filters by breed, gender, health status, and user-to-user communication.

# Technologies

Frontend / Mobile: React, Capacitor, TypeScript, Tailwind CSS

Backend: Supabase (PostgreSQL), NextAuth

Maps & Geolocation: Mapbox

Email: Resend

Authentication & Security: NextAuth, Cloudflare Turnstile

File Storage: Cloudinary

# Development Tools:
 VS Code, Android Studio, Git & GitHub

# Main Features

Publish and search for lost or adoptable pets

Filters by breed, color, gender, and health status

Geolocation and GPS navigation

Connection between users and veterinarians

User management, notifications, and content administration


# How to Run / Build

Clone the repository:

git clone https://github.com/yourusername/pawsi-app.git
cd pawsi-app


Install dependencies:

npm install


Create a .env file based on .env.example:

cp .env.example .env


Fill in your real keys in .env.

Run the app:

npm run dev


Or build for production:

npm run build
npm run preview

# Role & Contributions

-Full-stack development and UI/UX design

-Google Play publication

-User interviews, support, and launch campaign

-Integration with external APIs and services (Supabase, Mapbox, Cloudinary, Resend)



### **.env.example**

```env
# --- Supabase ---
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# --- Resend (emails) ---
RESEND_API_KEY=your_resend_api_key

# --- Mapbox ---
VITE_MAPBOX_TOKEN=your_mapbox_token

# --- Cloudflare Turnstile ---
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key

# --- NextAuth ---
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:5173

# --- Cloudinary ---
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret






























Lovable README


Welcome to your Lovable project
Project info
URL: https://lovable.dev/projects/4587b22d-9e29-4609-825a-a9243771d8ef

How can I edit this code?
There are several ways of editing your application.

Use Lovable

Simply visit the Lovable Project and start prompting.

Changes made via Lovable will be committed automatically to this repo.

Use your preferred IDE

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - install with nvm

Follow these steps:

# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
Edit a file directly in GitHub

Navigate to the desired file(s).
Click the "Edit" button (pencil icon) at the top right of the file view.
Make your changes and commit the changes.
Use GitHub Codespaces

Navigate to the main page of your repository.
Click on the "Code" button (green button) near the top right.
Select the "Codespaces" tab.
Click on "New codespace" to launch a new Codespace environment.
Edit files directly within the Codespace and commit and push your changes once you're done.
What technologies are used for this project?
This project is built with:

Vite
TypeScript
React
shadcn-ui
Tailwind CSS
How can I deploy this project?
Simply open Lovable and click on Share -> Publish.

Can I connect a custom domain to my Lovable project?
Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: Setting up a custom domain
