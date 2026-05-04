import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import ChatWidget from './ChatWidget'
import { Analytics } from "@vercel/analytics/next"

export default function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
      <ChatWidget />
    </>
  )
}
