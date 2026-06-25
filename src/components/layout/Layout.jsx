import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import ChatWidget from './ChatWidget'
import MotionObserver from './MotionObserver'
import SiteDotField from './SiteDotField'
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
      <SiteDotField />
      <MotionObserver />
      <div className="relative z-10">
        <Nav />
        <Outlet />
        <Footer />
      </div>
      <ChatWidget />
      <Analytics />
    </>
  )
}
