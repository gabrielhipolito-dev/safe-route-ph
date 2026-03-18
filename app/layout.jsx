import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'SafeRoute PH',
  description: 'Student-verified commute routes and safety ratings',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
