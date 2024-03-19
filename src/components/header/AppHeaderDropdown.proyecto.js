import React from 'react'
import {
  CAvatar,
  CDropdown,
} from '@coreui/react'

import avatar8 from './../../assets/images/avatars/logo1.jpg'

const AppHeaderDropdown = () => { 
  return (
    <CDropdown variant="nav-item">
  <CAvatar src={avatar8} size="md" />
    </CDropdown>
  )
}

export default AppHeaderDropdown