import './globals.css';

export const metadata = {
  title: 'Varo AI — Cyber-Physical Consequence Intelligence',
  description: 'Understand not just what happened, but what it means for your process.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
