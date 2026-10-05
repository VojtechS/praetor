import { Badge } from '../../../../shared/components/Badge/Badge.tsx';
import type { Connection } from '../../api/subjectApi/subjectApi.types.ts';
import { getConnectionTypeLabel } from '../../constants/subjectLabels.ts';
import { DetailSection } from '../../../../shared/components/DetailSection/DetailSection.tsx';
import styles from './SubjectConnectionsSection.module.scss';

export interface SubjectConnectionsSectionProps {
  connections: Connection[];
}

export function SubjectConnectionsSection({
  connections,
}: Readonly<SubjectConnectionsSectionProps>) {
  return (
    <DetailSection title="Spojení" count={connections.length}>
      {connections.length === 0 && <p className="emptyState">Žádná spojení</p>}
      <ul className={styles.subjectConnectionsSection__list}>
        {connections.map((connection) => (
          <li key={connection.id}>
            <p>
              <span className={styles.subjectConnectionsSection__type}>
                {getConnectionTypeLabel(connection.type)}
              </span>{' '}
              {connection.value}{' '}
              {connection.isPreferred && <Badge variant="primary">Preferované</Badge>}
            </p>
            {connection.note && (
              <p className={styles.subjectConnectionsSection__note}>{connection.note}</p>
            )}
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}
