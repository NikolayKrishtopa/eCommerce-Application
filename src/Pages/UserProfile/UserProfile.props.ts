import { UserUpdatePayloadType } from '@/Models/Models'

export default interface UserProfileProps {
  onUserUpdate: (userData: UserUpdatePayloadType) => void
  onPasswordChange: (newPassword: string, currentPassword: string) => void
}
