import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import { Spinner } from './components'

const Home = lazy(() => import('./pages/Home'))
const EventList = lazy(() => import('./pages/EventList'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Calendar = lazy(() => import('./pages/Calendar'))
const MapPage = lazy(() => import('./pages/MapPage'))
const Directions = lazy(() => import('./pages/Directions'))
const Login = lazy(() => import('./pages/Login'))
const KakaoCallback = lazy(() => import('./pages/KakaoCallback'))
const Terms = lazy(() => import('./pages/Terms'))
const MyBookmarks = lazy(() => import('./pages/MyBookmarks'))
const MyReviews = lazy(() => import('./pages/MyReviews'))
const MyProfile = lazy(() => import('./pages/MyProfile'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<EventList />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="events/:id/directions" element={<Directions />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="map" element={<MapPage />} />
          <Route path="auth/login" element={<Login />} />
          <Route path="auth/kakao/callback" element={<KakaoCallback />} />
          <Route path="auth/terms" element={<Terms />} />
          <Route path="my" element={<MyBookmarks />} />
          <Route path="my/bookmarks" element={<MyBookmarks />} />
          <Route path="my/reviews" element={<MyReviews />} />
          <Route path="my/profile" element={<MyProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
