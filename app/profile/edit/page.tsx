import OnboardingForm from "@/components/OnboardingForm/OnboardingForm"
import styles from "./OnboardingPage.module.css"

export default function EditProfilePage() {
  return (
    <div className={styles.page}>

      <main className={styles.formSide}>
        <div className={styles.container}>
          <div className={styles.header}>
           <svg width="105" height="45" className={styles.header}>
            <use href="/images/symbol-defs.svg#icon-Company-Logo"></use>
           </svg>
          </div>
          <div className={styles.wrapper}>
            <h1 className={styles.title}>Давайте познайомимось ближче</h1>
            <OnboardingForm />
          </div>
        </div>
      </main>

      <aside className={styles.imageSide}>
        <div className={styles.imageWrapper}>
          <img
            src="/images/onboarding-image.jpg"
            alt="Onboarding"
            className={styles.image}
          />
        </div>
      </aside>
    </div>
  )
}