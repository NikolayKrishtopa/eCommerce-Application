import { useState } from 'react'
import { ReactComponent as SvgEye } from '@/assets/icons/eye.svg'
import { ReactComponent as SvgEyeSlash } from '@/assets/icons/eye-slash.svg'
import TextInputHiddenProps from './TextInputHidden.props'
import TextInput from '../TextInput'

export default function TextInputHidden(props: TextInputHiddenProps) {
  const { visible: initVisible = false, onIconClick, ...textInputProps } = props

  const [visible, setVisible] = useState(initVisible)
  const Icon = visible ? SvgEyeSlash : SvgEye

  return (
    <TextInput
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...textInputProps}
      type={visible ? 'text' : 'password'}
      icon={<Icon fill="currentColor" />}
      onIconClick={() => {
        const nextVisible = !visible
        setVisible(nextVisible)
        if (onIconClick) onIconClick(nextVisible)
      }}
    />
  )
}
