import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import ChatWidget from './ChatWidget'
import { Analytics } from "@vercel/analytics/react"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <Outlet />
      <Footer />
      <ChatWidget />
      <Analytics />
    </>
  )
}
