import styles from './Skeleton.module.css';

export default function Skeleton({ width, height, borderRadius, className = '' }) {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <Skeleton width="40px" height="40px" borderRadius="10px" />
      <div style={{ flex: 1 }}>
        <Skeleton height="20px" width="60px" borderRadius="6px" />
        <Skeleton height="14px" width="100px" borderRadius="6px" style={{ marginTop: 8 }} />
      </div>
    </div>
  );
}
