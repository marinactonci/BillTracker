# Bill Tracker - Personal Bill Tracking and Management App

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://rachuni.vercel.app/)

Bill Tracker is a web application designed to help you manage and track your personal bills with ease. Whether you're keeping an eye on rent, utilities, or subscription services, Rachuni gives you a streamlined solution for organizing your finances.

### Live Demo
Check out the live demo of the app [here](https://rachuni.vercel.app/).

---

## Features

- **Bill Tracking**: Track due dates, payment history, and upcoming bills.
- **User Authentication**: Secure sign-in and sign-up using Supabase authentication.
- **Responsive Design**: Optimized for all devices, from mobile to desktop.
- **Modern UI/UX**: Built using Tailwind CSS and Ant Design for a sleek, intuitive interface.
- **Real-time Updates**: Manage bills and see updates instantly using Supabase as the backend.
- **Categorization**: Organize your bills by type for easy reference.

---

## Tech Stack

- **Next.js**: React framework for building performant, server-rendered web applications.
- **Tailwind CSS**: Utility-first CSS framework for styling the app.
- **Ant Design**: UI library for polished, ready-to-use components.
- **Supabase**: Backend service for database management and user authentication.

---

## Getting Started

### Prerequisites

To run the project locally, you need:

- [Node.js](https://nodejs.org/en/download/) v14 or higher
- [npm](https://www.npmjs.com/get-npm)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/rachuni.git
cd rachuni
```

2. Install the dependencies:

```bash
npm install
```

3. Set up your environment variables:

Create a .env.local file in the root directory and add your Supabase credentials:

```makefile
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SECRET_KEY=generate-your-secret-with-ssh
```

4. Start the development server:

```bash
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

Project Structure
```bash
├── components        # Reusable components
├── app               # Next.js app router
├── public            # Static assets
└──  utils             # Utility functions and helpers
```

## Contributing
Feel free to open an issue or submit a pull request for any bugs or feature requests.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements
[Next.js](https://nextjs.org/)
[Tailwind CSS](https://tailwindcss.com/)
[Ant Design](https://ant.design/)
[Supabase](https://supabase.com/)

Enjoy using Bill Tracker and happy billing!
