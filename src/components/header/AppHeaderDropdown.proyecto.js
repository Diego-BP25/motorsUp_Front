import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket} from '@fortawesome/free-solid-svg-icons'


import avatar8 from './../../assets/images/avatars/logo1.jpg'

const AppHeaderDropdown = () => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
  <CAvatar src={avatar8} size="md" />
</CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
      <CDropdownItem href="#/login">
  <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: '10px' }} />
  Cerrar Sesión
</CDropdownItem>

      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown