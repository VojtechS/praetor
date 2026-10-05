import { Badge } from '../../../../../shared/components/Badge/Badge.tsx';
import type { Connection } from '../../../api/subjectApi/subjectApi.types.ts';
import { CONNECTION_TYPE_LABELS } from '../../../constants/subjectLabels.ts';
import { DetailSection } from '../../../../../shared/components/DetailSection/DetailSection.tsx';
import styles from './SubjectConnectionsDetail.module.scss';

export interface SubjectConnectionsDetailProps {
  connections: Connection[];
}

export function SubjectConnectionsDetail({ connections }: Readonly<SubjectConnectionsDetailProps>) {
  return (
    <DetailSection title="Spojení" count={connections.length}>
      {connections.length === 0 && <p className="emptyState">Žádná spojení</p>}
      <ul className={styles.subjectConnectionsDetail__list}>
        {connections.map((connection) => (
          <li key={connection.id}>
            <p>
              <span className={styles.subjectConnectionsDetail__type}>
                {CONNECTION_TYPE_LABELS[connection.type]}
              </span>{' '}
              {connection.value}{' '}
              {connection.isPreferred && <Badge variant="primary">Preferované</Badge>}
            </p>
            {connection.note && (
              <p className={styles.subjectConnectionsDetail__note}>{connection.note}</p>
            )}
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}
