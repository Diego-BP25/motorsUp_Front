import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import ProtectedRoute from '../views/Login/ProtectedRoute.proyecto'
import { useLocalStorage } from 'react-use'
// routes config
import routes from '../routes'

const AppContent = () => {

  const [user, setUser] = useLocalStorage('Empleado')

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
        <Route element={<ProtectedRoute canActivate={user} />}>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                  //element={<ProtectedRoute canActivate={true} router={route.element} />}
                />
              )
            )
          })}
          </Route>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
