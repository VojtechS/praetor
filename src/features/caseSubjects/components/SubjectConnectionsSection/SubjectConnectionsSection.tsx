import { Badge } from '../../../../shared/components/Badge/Badge.tsx';
import type { Connection } from '../../../subjects/api/subjectApi.types.ts';
import { getConnectionTypeLabel } from '../../../subjects/constants/subjectLabels.ts';
import { CaseSubjectDetailSection } from '../CaseSubjectDetailSection/CaseSubjectDetailSection.tsx';
import styles from './SubjectConnectionsSection.module.scss';

export interface SubjectConnectionsSectionProps {
  connections: Connection[];
}

export function SubjectConnectionsSection({
  connections,
}: Readonly<SubjectConnectionsSectionProps>) {
  return (
    <CaseSubjectDetailSection title="Spojení" count={connections.length}>
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
    </CaseSubjectDetailSection>
  );
}
