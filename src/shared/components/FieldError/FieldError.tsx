import styles from './FieldError.module.scss';

export interface FieldErrorProps {
  id: string;
  message?: string;
}

export function FieldError({ id, message }: Readonly<FieldErrorProps>) {
  if (!message) return null;

  return (
    <p id={id} className={styles.fieldError} role="alert">
      {message}
    </p>
  );
}
