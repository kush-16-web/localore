import Layout from './components/Layout/Layout'
import Explore from './pages/Explore'
import MyGems from './pages/MyGems'
import SubmitGem from './pages/SubmitGem'
import { GemPanelProvider } from './context/GemPanelContext'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <GemPanelProvider>
        <Layout>
          <Routes>
            <Route path='/' element={<Explore />} />
            <Route path='/my-gems' element={<MyGems />} />
            <Route path='/create-gem' element={<SubmitGem />} />
          </Routes>
        </Layout>
      </GemPanelProvider>
    </BrowserRouter>
  )
}

export default App
