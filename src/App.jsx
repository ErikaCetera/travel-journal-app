import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import TravelList from './pages/TravelList'
import TravelDetail from './pages/TravelDetail'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TravelList/>} />
          <Route path="travel/:id" element={<TravelDetail />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App