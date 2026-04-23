import styles from './PageLayout.module.css';

export default function PageLayout({ actions, children }) {
  return (
    <div className={styles.page}>
      {actions && <div className={styles.actions}>{actions}</div>}
      {children}
    </div>
  );
}
