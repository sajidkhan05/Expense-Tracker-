import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Expense Tracker with Smart Insighter",
  description: "Track your expenses, analyse spending patterns, and save more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" toastOptions={{
          style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontSize: '14px' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }} />
        {children}
      </body>
    </html>
  );
}