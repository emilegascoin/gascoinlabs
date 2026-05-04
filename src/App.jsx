import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Ask from './pages/Ask'
import Work from './pages/Work'
import Elecdes from './pages/work/Elecdes'
import Gascoinlabs from './pages/work/Gascoinlabs'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/elecdes" element={<Elecdes />} />
        <Route path="/work/gascoinlabs" element={<Gascoinlabs />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
