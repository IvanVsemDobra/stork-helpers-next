import ProfileAvatar from '@/components/ProfilePage/ProfileAvatar/ProfileAvatar'
import ProfileEditForm from '@/components/ProfilePage/ProfileEditForm/ProfileEditForm'
import styles from './ProfilePage.module.css'
export default function ProfilePage() {
  return (
    <div className={styles.profilePage}>
      <ProfileAvatar />
      <ProfileEditForm />
    </div>
  )
}
