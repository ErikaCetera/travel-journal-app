import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import TravelList from './pages/TravelList'
import TravelDetail from './pages/TravelDetail'
import CreateTravel from './pages/CreateTravel'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
   <ScrollToTop />
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TravelList/>} />
          <Route path="travel/:id" element={<TravelDetail />} />
          <Route path="create" element={<CreateTravel />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App