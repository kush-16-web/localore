import Layout from './components/Layout/Layout'
import VirtualOffice from './pages/VirtualOffice'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import MapPage from './pages/MapPage'
import Messages from './pages/Messages'
import SubmitGem from './pages/SubmitGem'
import { GemPanelProvider } from './context/GemPanelContext'
import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <GemPanelProvider>
        <Layout>
          <Routes>
            <Route path='/' element={<VirtualOffice />} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/map' element={<MapPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/messages' element={<Messages />} />

            {/* Legacy pages now live as tabs inside Profile */}
            <Route path='/my-gems' element={<Navigate to='/profile?tab=gems' replace />} />
            <Route path='/saved-gems' element={<Navigate to='/profile?tab=saved' replace />} />

            <Route path='/create-gem' element={<SubmitGem />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Layout>
      </GemPanelProvider>
    </BrowserRouter>
  )
}

export default App
