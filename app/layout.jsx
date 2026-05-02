import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'UniWolfe Route',
  description: 'Student-verified commute routes and safety ratings',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
      </head>
      <body>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
