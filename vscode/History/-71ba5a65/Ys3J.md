# Tariqul's Portfolio

A modern, interactive portfolio website built with Next.js 15, featuring a beautiful UI, smooth animations, and a unique terminal-style interface. This project also includes a full-featured dashboard for managing content.

🌐 **Live Demo:** [https://tariqul.dev](https://tariqul.dev)

![Portfolio Preview](public/assets/banner.png)

## ✨ Features

- 🎨 Modern and responsive design
- 🌓 Dark/Light mode support
- ⚡ Fast performance with Next.js 15 and Turbopack
- 🎭 Smooth animations with Framer Motion
- 💻 Interactive terminal-style profile section
- 📱 Mobile-first approach
- 🎯 Project showcase with detailed views
- 🛠️ Skills cloud visualization
- 📬 Contact form with Nodemailer
- 🎮 Interactive UI elements (Magic buttons, cards, etc.)
- 🔐 Authentication with NextAuth
- 📝 Full-featured dashboard for managing blogs and projects
- 📈 Structured logging with Pino

## 🚀 Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **Authentication:** NextAuth.js
- **Animations:** Framer Motion
- **UI Components:** Radix UI, Shadcn UI
- **Form Handling:** React Hook Form + Zod
- **Email Service:** Nodemailer
- **Icons:** Lucide Icons
- **Theme:** Next Themes
- **Logging:** Pino

## 🛠️ Getting Started

1.  **Clone the repository:**

    '''bash
    git clone https://github.com/tariqul420/tariqul-portfolio-next.git
    cd tariqul-portfolio-next
    '''

2.  **Install dependencies:**

    '''bash
    npm install

    # or

    yarn install

    # or

    pnpm install
    '''

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the following environment variables:

    '''env

    # MongoDB

    DATABASE_URL=<your_mongodb_connection_string>
    DB_PASSWORD=<your_mongodb_password>

    # NextAuth

    NEXTAUTH_SECRET=<your_nextauth_secret>
    NEXTAUTH_URL=http://localhost:3000

    # Nodemailer

    EMAIL_HOST=<your_email_host>
    EMAIL_PORT=<your_email_port>
    EMAIL_USER=<your_email_user>
    EMAIL_PASS=<your_email_password>
    EMAIL_FROM=<your_email_from>

    # Cloudinary

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    '''

4.  **Run the development server:**

    '''bash
    npm run dev

    # or

    yarn dev

    # or

    pnpm dev
    '''

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Project Structure

'''
tariqul/
├── app/ # Next.js app directory
│ ├── (auth)/ # Authentication routes
│ ├── (dashboard)/ # Dashboard routes
│ ├── (root)/ # Public routes
│ └── api/ # API routes
├── components/ # React components
│ ├── shared/ # Shared components
│ ├── ui/ # UI components
│ └── ...
├── lib/ # Utility functions and actions
│ ├── actions/ # Server actions
│ ├── auth/ # Authentication configuration
│ └── ...
├── models/ # Mongoose models
├── public/ # Static assets
└── ...
'''

## 🔧 Configuration

The project uses several configuration files:

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `eslint.config.mjs` - ESLint configuration

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/tariqul420/tariqul/issues).

## 📫 Contact

Feel free to reach out to me through:

- Email: [contact@tariqul.dev]
- LinkedIn: [https://www.linkedin.com/in/tariqul-dev/]
- Twitter: [https://x.com/tariqul_420]
- Facebook: [https://www.facebook.com/tariquldev]

---

Made with ❤️ by Tariqul
