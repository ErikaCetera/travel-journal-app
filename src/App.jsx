import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import TravelList from './pages/TravelList'
import TravelDetail from './pages/TravelDetail'
import TravelCreate from './pages/TravelCreate'
import TravelEdit from './pages/TravelEdit'
import ScrollToTop from './components/ScrollToTop'

const App = () => {

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TravelList />} />
          <Route path="travel/:id" element={<TravelDetail />} />
          <Route path="create" element={<TravelCreate />} />
          <Route path="/edit/:id" element={<TravelEdit />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App