import './App.css'
import { useEffect, useState } from 'react'
import HomeLayout from './components/layout/HomeLayout'
import HomePage from './pages/main/home/HomePage'
import WelcomePage from './pages/main/home/WelcomePage'
import RegisterNamePage from './pages/main/auth/RegisterNamePage'
import RegisterPFPPage from './pages/main/auth/RegisterPFPPage'
import RegisterSuccessPage from './pages/main/auth/RegisterSuccessPage'
import LoginPage from './pages/main/auth/LoginPage'
import SettingsPage from './pages/main/settings/SettingsPage'
import { useNsecs } from './contexts/NsecContext'
import AccountsPage from './pages/main/settings/AccountsPage'
import RelaysPage from './pages/main/settings/RelaysPage'
import ActivityPage from './pages/main/home/ActivityPage'
import RequestPermissionPage from './pages/prompt/RequestPermissionPage'
import { Popup } from './utils/types'

function App() {
  const { getNsecs } = useNsecs()

  const [page, setPage] = useState<string | undefined>()
  const [popup, setPopup] = useState<Popup | undefined>()
  const [component, setComponent] = useState<JSX.Element | null>(null)

  const determinePage = async () => {
    switch (page) {
      case 'home':
        setComponent(<HomeLayout page={page} setPage={setPage}><HomePage setPage={setPage} /></HomeLayout>)
        break
      case 'activity':
        setComponent(<HomeLayout page={page} setPage={setPage}><ActivityPage /></HomeLayout>)
        break
      case 'settings':
        setComponent(<HomeLayout page={page} setPage={setPage}><SettingsPage setPage={setPage} /></HomeLayout>)
        break

      case 'settings-accounts':
        setComponent(<HomeLayout page={page} setPage={setPage}><AccountsPage setPage={setPage} /></HomeLayout>)
        break
      case 'settings-relays':
        setComponent(<HomeLayout page={page} setPage={setPage}><RelaysPage setPage={setPage} /></HomeLayout>)
        break

      case 'welcome':
        setComponent(<WelcomePage setPage={setPage} />)
        break

      case 'login':
        setComponent(<LoginPage setPage={setPage} />)
        break

      case 'register-name':
        setComponent(<RegisterNamePage setPage={setPage} />)
        break
      case 'register-pfp':
        setComponent(<RegisterPFPPage setPage={setPage} />)
        break
      case 'register-success':
        setComponent(<RegisterSuccessPage setPage={setPage} />)
        break

      default:
        return <WelcomePage setPage={setPage} />
    }
  }

  const determinePopup = () => {
    switch (popup?.name) {
      case 'request-signature':
      case 'request-public-key':
        setComponent(<RequestPermissionPage data={popup} />)
        break
    }
  }

  useEffect(() => {
    // Check for a requested popup
    const params = new URLSearchParams(window.location.search)
    if(params.get('request')) {
      setPopup({
        name: `request-${params.get('request')}`,
        request: params.get('request') || 'Unknown Request',
        origin: params.get('origin') || 'Unknown Website',
        action: params.get('action') || 'Unknown Action',
        tabId: parseInt(params.get('tabId') || '0'),
      })
      return
    }

    // Handle page normally
    const checkForNsecs = async () => {
      const nsecs = await getNsecs()
      if(nsecs?.length > 0) {
        setPage('home')
      } else {
        setPage('welcome')
      }
    }
    checkForNsecs()
  }, [])

  useEffect(() => {
    determinePage()
  }, [page])

  useEffect(() => {
    determinePopup()
  }, [popup])

  return (
    <>
      {component}
    </>
  )
}

export default App
