import Layout from './components/Layout/Layout'
import Explore from './pages/Explore'
import MyGems from './pages/MyGems'
import SubmitGem from './pages/SubmitGem'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/my-gems' element={<MyGems />} />
          <Route path='/create-gem' element={<SubmitGem />} />
          
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
