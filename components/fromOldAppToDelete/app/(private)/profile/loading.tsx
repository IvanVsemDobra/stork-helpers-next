'use client'
import styles from './ProfilePage.module.css'

export default function Loading() {
  return (
    <div className={styles.profilePage}>
      <div
        style={{
          width: '320px',
          height: '380px',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: '24px',
          animation: 'pulse 1.5s infinite ease-in-out',
        }}
      ></div>
      <div
        style={{
          flex: 1,
          height: '500px',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: '24px',
          animation: 'pulse 1.5s infinite ease-in-out',
        }}
      ></div>
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}
