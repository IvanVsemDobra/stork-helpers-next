import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Мій день</h1>
          <p>
            Застосунок для підтримки під час вагітності:
            відстежуйте завдання, емоції та щоденні нотатки.
          </p>
        </div>

        <div className={styles.ctas}>
          <a href="/login" className={styles.primary}>
            Увійти
          </a>
          <a href="/register" className={styles.secondary}>
            Створити акаунт
          </a>
        </div>
      </main>
    </div>
  );
}