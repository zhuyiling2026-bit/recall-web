import { Clock } from 'lucide-react';
import styles from './ReminderTag.module.css';

const COLOR_MAP = {
  yellow: 'yellow',
  red: 'red',
  gray: 'gray',
};

export default function ReminderTag({ label, color }) {
  return (
    <span className={`${styles.tag} ${styles[COLOR_MAP[color]]}`}>
      <Clock size={11} />
      {label}
    </span>
  );
}
