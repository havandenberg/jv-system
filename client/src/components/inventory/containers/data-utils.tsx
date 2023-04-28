import { omit, pluck, sortBy, uniq, uniqBy } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  Container,
  ContainerTreatment,
  Pallet,
  Shipper,
  Vendor,
  Vessel,
  Warehouse,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { LineItemCheckbox } from 'ui/checkbox';
import { formatShortDate } from 'utils/date';
import { Fragment } from 'react';

export type ContainerLabelInfo = LabelInfo<Container>;

export const listLabels: ContainerLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'containerId',
    label: 'ID',
    sortable: true,
  },
  {
    key: 'dischargeDate',
    label: 'Avail Date',
    getValue: ({ dischargeConfirmed, dischargeDate }) => (
      <ty.BodyText
        color={
          dischargeConfirmed || !dischargeDate
            ? undefined
            : th.colors.status.errorAlt
        }
      >
        {dischargeDate
          ? formatShortDate(new Date(dischargeDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
    sortable: true,
  },
  {
    key: 'vesselCode',
    label: 'Vessel',
    getValue: ({ vessel }) => (
      <ty.BodyText>
        {vessel ? `${vessel.vesselCode} - ${vessel.vesselName}` : ''}
      </ty.BodyText>
    ),
  },
  {
    key: 'warehouseId',
    label: 'Warehouse',
    getValue: ({ warehouse }) => (
      <ty.BodyText>{warehouse ? warehouse.warehouseName : ''}</ty.BodyText>
    ),
  },
  {
    key: 'containerDescription',
    label: 'Description',
    getValue: ({ containerDescription }) => (
      <ty.BodyText>{containerDescription || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'isAvailable',
    label: 'Avail',
    getValue: ({ isAvailable }) => (
      <LineItemCheckbox
        checked={!!isAvailable}
        disabled
        onChange={() => ({})}
      />
    ),
  },
];

export const baseLabels: (
  vessels: Vessel[],
  warehouses: Warehouse[],
  vendors: Vendor[],
  bulkEditContainers?: Container[],
  updateFields?: string[],
) => ContainerLabelInfo[] = (
  vessels,
  warehouses,
  vendors,
  bulkEditContainers,
  updateFields,
) => [
  {
    key: 'containerId',
    label: 'ID',
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => `${c.containerId}`).join(`
`)
        : undefined,
    validate: ({ containerId }) => !!containerId,
    readOnly: true,
  },
  {
    key: 'vesselCode',
    label: 'Vessel',
    itemSelectorQueryProps: {
      customOptions: vessels,
      customSearchKeys: ['vesselCode', 'vesselName'],
      errorLabel: 'vessels',
      nameKey: 'vesselCode',
      getItemContent: ({ vesselCode, vesselName }: Vessel) => (
        <ty.BodyText pl={th.spacing.sm}>
          {vesselCode} - {vesselName}
        </ty.BodyText>
      ),
      width: 300,
    },
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => `${c.containerId} (${c.vesselCode})`)
            .join(`
`)
        : undefined,
    getValue: ({ vessel, vesselCode }) =>
      vessel ? (
        <ty.LinkText
          hover="false"
          to={`/inventory/vessels/${vessel.vesselCode}?isPre=0&vesselView=containers`}
        >
          {vessel.vesselCode} - {vessel.vesselName}
        </ty.LinkText>
      ) : vesselCode ? (
        <ty.BodyText>{vesselCode}</ty.BodyText>
      ) : (
        ''
      ),
    readOnly: true,
    validate: ({ vesselCode }) => !!vesselCode,
  },
  {
    key: 'warehouseId',
    label: 'Warehouse',
    editablCellProps: {
      warning: updateFields?.includes('warehouseId'),
    },
    itemSelectorQueryProps: {
      customOptions: warehouses,
      customSearchKeys: ['id', 'warehouseName'],
      errorLabel: 'warehouses',
      getItemContent: ({ id, warehouseName }: Warehouse) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {warehouseName}
        </ty.BodyText>
      ),
      width: 300,
    },
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map(
            (c) =>
              `${c.containerId} - ${c.warehouse?.warehouseName || '-'} (${
                c.warehouse?.id || '-'
              })`,
          ).join(`
`)
        : undefined,
    getValue: ({ warehouse }) =>
      warehouse ? (
        <ty.LinkText hover="false" to={`/directory/warehouses/${warehouse.id}`}>
          {warehouse.warehouseName}
        </ty.LinkText>
      ) : (
        ''
      ),
    validate: ({ warehouseId }) =>
      !warehouseId || !!warehouses.find(({ id }) => id === warehouseId),
  },
  {
    key: 'vendorId',
    label: 'Vendor',
    editablCellProps: {
      warning: updateFields?.includes('vendorId'),
    },
    itemSelectorQueryProps: {
      customOptions: vendors,
      customSearchKeys: ['id', 'vendorName'],
      errorLabel: 'vendors',
      getItemContent: ({ id, vendorName }: Vendor) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {vendorName}
        </ty.BodyText>
      ),
      width: 300,
    },
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map(
            (c) =>
              `${c.containerId} - ${c.vendor?.vendorName || '-'} (${
                c.vendor?.id || '-'
              })`,
          ).join(`
`)
        : undefined,
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.LinkText hover="false" to={`/directory/vendors/${vendor.id}`}>
          {vendor.vendorName}
        </ty.LinkText>
      ) : (
        ''
      ),
    validate: ({ vendorId }) =>
      !vendorId || !!vendors.find(({ id }) => id === vendorId),
  },
  {
    key: 'containerDescription',
    label: 'Description',
    editablCellProps: {
      warning: updateFields?.includes('containerDescription'),
    },
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map(
            (c) => `${c.containerId} - ${c.containerDescription || '-'}`,
          ).join(`
`)
        : undefined,
    getValue: ({ containerDescription }) => (
      <ty.BodyText>{containerDescription || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'dischargeDate',
    label: 'Available Date',
    getValue: ({ dischargeConfirmed, dischargeDate }) => (
      <ty.BodyText
        color={
          dischargeConfirmed || !dischargeDate
            ? undefined
            : th.colors.status.errorAlt
        }
      >
        {dischargeDate
          ? formatShortDate(new Date(dischargeDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map(
            (c) =>
              `${c.containerId} - ${
                c.dischargeDate
                  ? formatShortDate(
                      new Date(c.dischargeDate.replace(/-/g, '/')),
                    )
                  : '-'
              }`,
          ).join(`
`)
        : undefined,
    isDate: true,
  },
  {
    key: 'releaseDate',
    confirmKey: 'releaseConfirmed',
    label: 'Release Date',
    editablCellProps: {
      warning: updateFields?.includes('releaseDate'),
    },
    getValue: ({ releaseConfirmed, releaseDate }) => (
      <ty.BodyText
        color={
          releaseConfirmed || !releaseDate
            ? undefined
            : th.colors.status.errorAlt
        }
      >
        {releaseDate
          ? formatShortDate(new Date(releaseDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map(
            (c) =>
              `${c.containerId} - ${
                c.releaseDate
                  ? formatShortDate(new Date(c.releaseDate.replace(/-/g, '/')))
                  : '-'
              }`,
          ).join(`
`)
        : undefined,
    isDate: true,
  },
  {
    key: 'notes1',
    label: 'Notes 1',
    editablCellProps: {
      warning: updateFields?.includes('notes1'),
    },
    getValue: ({ notes1 }) => <ty.BodyText>{notes1 || '-'}</ty.BodyText>,
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => `${c.containerId} - ${c.notes1}`).join(`
`)
        : undefined,
  },
  {
    key: 'notes2',
    label: 'Notes 2',
    editablCellProps: {
      warning: updateFields?.includes('notes2'),
    },
    getValue: ({ notes2 }) => <ty.BodyText>{notes2 || '-'}</ty.BodyText>,
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => `${c.containerId} - ${c.notes2}`).join(`
`)
        : undefined,
  },
  {
    key: 'notes3',
    label: 'Notes 3',
    editablCellProps: {
      warning: updateFields?.includes('notes3'),
    },
    getValue: ({ notes3 }) => <ty.BodyText>{notes3 || '-'}</ty.BodyText>,
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => `${c.containerId} - ${c.notes3}`).join(`
`)
        : undefined,
  },
  {
    key: 'dischargeConfirmed',
    label: 'Available Confirmed',
    editablCellProps: {
      warning: updateFields?.includes('dischargeConfirmed'),
    },
    getValue: ({ dischargeConfirmed }) => (
      <LineItemCheckbox
        checked={!!dischargeConfirmed}
        disabled
        onChange={() => ({})}
      />
    ),
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map(
            (c) => `${c.containerId} - ${c.dischargeConfirmed}`,
          ).join(`
`)
        : undefined,
    isBoolean: true,
  },

  {
    key: 'releaseConfirmed',
    label: 'Release Confirmed',
    editablCellProps: {
      warning: updateFields?.includes('releaseConfirmed'),
    },
    getValue: ({ releaseConfirmed }) => (
      <LineItemCheckbox
        checked={!!releaseConfirmed}
        disabled
        onChange={() => ({})}
      />
    ),
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map(
            (c) => `${c.containerId} - ${c.releaseConfirmed}`,
          ).join(`
`)
        : undefined,
    isBoolean: true,
  },
  {
    key: 'sentConfirmed',
    label: 'Sent Confirmed',
    editablCellProps: {
      warning: updateFields?.includes('sentConfirmed'),
    },
    getValue: ({ sentConfirmed }) => (
      <LineItemCheckbox
        checked={!!sentConfirmed}
        disabled
        onChange={() => ({})}
      />
    ),
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => `${c.containerId} - ${c.sentConfirmed}`)
            .join(`
`)
        : undefined,
    isBoolean: true,
  },
  {
    key: 'isAvailable',
    label: 'Available',
    editablCellProps: {
      warning: updateFields?.includes('isAvailable'),
    },
    getValue: ({ isAvailable }) => (
      <LineItemCheckbox
        checked={!!isAvailable}
        disabled
        onChange={() => ({})}
      />
    ),
    title: () =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => `${c.containerId} - ${c.isAvailable}`)
            .join(`
`)
        : undefined,
    isBoolean: true,
  },
];

export type ContainerTreatmentLabelInfo = LabelInfo<ContainerTreatment>;

export const treatmentListLabels: (
  bulkEditContainers?: Container[],
  updateFields?: string[],
) => ContainerTreatmentLabelInfo[] = (bulkEditContainers, updateFields) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'treatmentType',
    label: 'Type',
    sortable: true,
    editablCellProps: {
      warning: updateFields?.includes('treatmentType'),
    },
    itemSelectorQueryProps: {
      customOptions: [
        { id: 'Cold Treatment' },
        { id: 'Fumigation' },
        { id: 'Inspection' },
        { id: '2% Inspection' },
        { id: 'Vacis Exam' },
      ],
      getItemContent: ({ id }: { id: string }) => (
        <ty.BodyText fontSize={th.fontSizes.caption} pl={th.spacing.sm}>
          {id}
        </ty.BodyText>
      ),
      errorLabel: 'types',
    },
    title: ({ treatmentType }) =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => {
            const currentTreatment = c.containerTreatments?.nodes.find(
              (ct) => ct?.treatmentType === treatmentType,
            );
            return `${c.containerId} - ${currentTreatment?.treatmentType}`;
          }).join(`
`)
        : undefined,
    allowOverflow: true,
    validate: ({ treatmentType }) => !!treatmentType,
  },
  {
    key: 'treatmentDate',
    label: 'Date',
    sortable: true,
    editablCellProps: {
      warning: updateFields?.includes('treatmentDate'),
    },
    getValue: ({ treatmentDate }) => (
      <ty.BodyText>
        {treatmentDate
          ? formatShortDate(new Date(treatmentDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
    title: ({ treatmentType }) =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => {
            const currentTreatment = c.containerTreatments?.nodes.find(
              (ct) => ct?.treatmentType === treatmentType,
            );
            return `${c.containerId} - ${
              currentTreatment?.treatmentDate
                ? formatShortDate(
                    new Date(currentTreatment.treatmentDate.replace(/-/g, '/')),
                  )
                : '-'
            }`;
          }).join(`
`)
        : undefined,
    isDate: true,
    allowOverflow: true,
  },
  {
    key: 'treatmentResult',
    label: 'Result',
    editablCellProps: {
      warning: updateFields?.includes('treatmentResult'),
    },
    itemSelectorQueryProps: {
      customOptions: [{ id: 'PASS' }, { id: 'FAIL' }],
      getItemContent: ({ id }: { id: string }) => (
        <ty.BodyText fontSize={th.fontSizes.caption} pl={th.spacing.sm}>
          {id}
        </ty.BodyText>
      ),
      errorLabel: 'results',
    },
    allowOverflow: true,
    getValue: ({ treatmentResult }) => (
      <ty.BodyText>{treatmentResult || '-'}</ty.BodyText>
    ),
    title: ({ treatmentType }) =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => {
            const currentTreatment = c.containerTreatments?.nodes.find(
              (ct) => ct?.treatmentType === treatmentType,
            );
            return `${c.containerId} - ${currentTreatment?.treatmentResult}`;
          }).join(`
`)
        : undefined,
  },
  {
    key: 'treatmentNotes',
    label: 'Notes',
    editablCellProps: {
      warning: updateFields?.includes('treatmentNotes'),
    },
    getValue: ({ treatmentNotes }) => (
      <ty.BodyText>{treatmentNotes || '-'}</ty.BodyText>
    ),
    title: ({ treatmentType }) =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => {
            const currentTreatment = c.containerTreatments?.nodes.find(
              (ct) => ct?.treatmentType === treatmentType,
            );
            return `${c.containerId} - ${currentTreatment?.treatmentNotes}`;
          }).join(`
`)
        : undefined,
  },
  {
    key: 'treatmentConfirmed',
    label: 'Completed',
    editablCellProps: {
      warning: updateFields?.includes('treatmentConfirmed'),
    },
    getValue: ({ treatmentConfirmed }) => (
      <LineItemCheckbox
        checked={!!treatmentConfirmed}
        disabled
        onChange={() => ({})}
      />
    ),
    title: ({ treatmentType }) =>
      bulkEditContainers
        ? bulkEditContainers.map((c) => {
            const currentTreatment = c.containerTreatments?.nodes.find(
              (ct) => ct?.treatmentType === treatmentType,
            );
            return `${c.containerId} - ${currentTreatment?.treatmentConfirmed}`;
          }).join(`
`)
        : undefined,
    isBoolean: true,
  },
];

export const getContainerShippers = (container: Container) =>
  sortBy(
    ({ shipperName }) => (shipperName || '').toLowerCase(),
    uniqBy(
      ({ id }) => id,
      ((container.pallets?.nodes || []) as Pallet[]).map(
        ({ shipper }) => shipper,
      ) as Shipper[],
    ) as Shipper[],
  );

const getTreatmentShortName = (treatmentType: string) => {
  switch (treatmentType) {
    case 'Cold Treatment':
      return 'CT';
    case 'Fumigation':
      return 'Fum';
    case 'Inspection':
      return 'Insp';
    case '2% Inspection':
      return '2%';
    case 'Vacis Exam':
      return 'Vac';
    default:
      return treatmentType;
  }
};

const getTreatmentDescription = (
  { treatmentType, treatmentDate }: ContainerTreatment,
  category: string,
  showDate?: boolean,
) =>
  `${getTreatmentShortName(treatmentType)}${
    (category === 'PEND' || showDate) && treatmentDate
      ? ' (' + formatShortDate(new Date(treatmentDate.replace(/-/g, '/'))) + ')'
      : ''
  }`;

export const getContainerTreatmentStatus = ({
  containerTreatments,
}: Container) => {
  const treatments = (containerTreatments?.nodes || []) as ContainerTreatment[];
  const pendingTreatments = treatments.filter(
    ({ treatmentConfirmed }) => !treatmentConfirmed,
  );
  const failedTreatments = treatments.filter(
    ({ treatmentConfirmed, treatmentResult }) =>
      treatmentConfirmed && treatmentResult === 'FAIL',
  );
  const passedTreatments = treatments.filter(
    ({ treatmentConfirmed, treatmentResult }) =>
      treatmentConfirmed && treatmentResult === 'PASS',
  );
  const completedTreatments = treatments.filter(
    ({ treatmentConfirmed, treatmentResult }) =>
      treatmentConfirmed &&
      treatmentResult &&
      !['PASS', 'FAIL'].includes(treatmentResult),
  );

  const statusList = [
    {
      header: 'PEND: ',
      value:
        pendingTreatments.length > 0
          ? pendingTreatments
              .map((t) => getTreatmentDescription(t, 'PEND', true))
              .join(', ')
          : '-',
    },
    {
      header: 'FAIL: ',
      value:
        failedTreatments.length > 0
          ? failedTreatments
              .map((t) => getTreatmentDescription(t, 'FAIL', true))
              .join(', ')
          : '-',
    },
    {
      header: 'PASS: ',
      value:
        passedTreatments.length > 0
          ? passedTreatments
              .map((t) => getTreatmentDescription(t, 'PASS', true))
              .join(', ')
          : '-',
    },
    {
      header: 'OTH: ',
      value:
        completedTreatments.length > 0
          ? completedTreatments
              .map((t) => getTreatmentDescription(t, 'OTH', true))
              .join(', ')
          : '-',
    },
  ];

  const status = statusList
    .filter(({ value }) => value !== '-')
    .map(({ header, value }) => `${header}${value}`)
    .join(', ');
  const statusTitle = statusList.map(({ header, value }) => `${header}${value}`)
    .join(`
`);

  return {
    status,
    components: (
      <ty.BodyText ellipsis title={statusTitle}>
        {pendingTreatments.length > 0 ? (
          <>
            <ty.Span color={th.colors.status.warning}>PEND&nbsp;</ty.Span>
            {pendingTreatments.map((t) => (
              <ty.Span key={t.id}>
                {getTreatmentDescription(t, 'PEND')}
                {', '}
              </ty.Span>
            ))}
          </>
        ) : (
          ''
        )}
        {failedTreatments.length > 0 ? (
          <>
            <ty.Span color={th.colors.status.errorAlt}>FAIL&nbsp;</ty.Span>
            {failedTreatments.map((t) => (
              <ty.Span key={t.id}>
                {getTreatmentDescription(t, 'FAIL')}
                {', '}
              </ty.Span>
            ))}
          </>
        ) : (
          ''
        )}
        {passedTreatments.length > 0 ? (
          <>
            <ty.Span color={th.colors.status.success}>PASS&nbsp;</ty.Span>
            {passedTreatments.map((t) => (
              <ty.Span key={t.id}>
                {getTreatmentDescription(t, 'PASS')}
                {', '}
              </ty.Span>
            ))}
          </>
        ) : (
          ''
        )}
        {completedTreatments.length > 0 ? (
          <>
            <ty.Span>OTH&nbsp;</ty.Span>
            {completedTreatments.map((t) => (
              <ty.Span key={t.id}>
                {getTreatmentDescription(t, 'OTH')}
                {', '}
              </ty.Span>
            ))}
          </>
        ) : (
          ''
        )}
      </ty.BodyText>
    ),
  };
};

export const scheduleListLabels: ContainerLabelInfo[] = [
  {
    key: 'vendorId',
    label: 'Trucker',
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.LinkText hover="false" to={`/directory/vendors/${vendor.id}`}>
          {vendor.vendorName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'containerId',
    label: 'ID',
    getValue: ({ containerId }) => (
      <ty.BodyText>{containerId || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'pallets',
    label: 'Shipper',
    getValue: (container) => {
      const shippers = getContainerShippers(container);
      return shippers.length > 0 ? (
        <l.Flex>
          {shippers.map(({ id, shipperName }, idx) => (
            <Fragment key={id}>
              {idx > 0 && <ty.Span>, </ty.Span>}
              <ty.LinkText hover="false" to={`/directory/shippers/${id}`}>
                {shipperName || 'UNK'}
              </ty.LinkText>
            </Fragment>
          ))}
        </l.Flex>
      ) : (
        ''
      );
    },
  },
  {
    key: 'containerTreatments',
    label: 'Pass CT',
    getValue: ({ containerTreatments }) => {
      const coldTreatment = (
        (containerTreatments?.nodes || []) as ContainerTreatment[]
      ).find(({ treatmentType }) => treatmentType === 'Cold Treatment');
      const isFail = coldTreatment?.treatmentResult === 'FAIL';
      const isPass = coldTreatment?.treatmentResult === 'PASS';
      return (
        <ty.BodyText
          color={
            isFail
              ? th.colors.status.errorAlt
              : isPass
              ? th.colors.status.success
              : undefined
          }
        >
          {coldTreatment
            ? isFail
              ? 'FAIL'
              : isPass
              ? coldTreatment.treatmentDate
                ? formatShortDate(
                    new Date(coldTreatment.treatmentDate.replace(/-/g, '/')),
                  )
                : 'PASS'
              : '-'
            : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'containerDescription',
    label: 'Description',
    getValue: ({ containerDescription }) => (
      <ty.BodyText>{containerDescription || '-'}</ty.BodyText>
    ),
    title: ({ containerDescription }) => containerDescription || '-',
  },
  {
    key: 'releaseDate',
    label: 'Release Date',
    getValue: ({ releaseConfirmed, releaseDate }) => (
      <ty.BodyText
        color={
          releaseConfirmed || !releaseDate
            ? undefined
            : th.colors.status.errorAlt
        }
      >
        {releaseDate
          ? formatShortDate(new Date(releaseDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'containerTreatments',
    label: 'Status',
    getValue: (container) => getContainerTreatmentStatus(container).components,
  },
  {
    key: 'dischargeDate',
    label: 'Available Date',
    getValue: ({ dischargeConfirmed, dischargeDate, vessel }) => (
      <ty.BodyText
        color={
          dischargeConfirmed || !dischargeDate
            ? dischargeDate !== vessel?.dischargeDate
              ? th.colors.status.warningSecondary
              : undefined
            : th.colors.status.errorAlt
        }
        title={
          dischargeDate !== vessel?.dischargeDate && vessel?.dischargeDate
            ? `Vessel available: ${formatShortDate(
                new Date(vessel.dischargeDate.replace(/-/g, '/')),
              )}`
            : undefined
        }
      >
        {dischargeDate
          ? formatShortDate(new Date(dischargeDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'warehouseId',
    label: 'Warehouse',
    getValue: ({ warehouse }) =>
      warehouse ? (
        <ty.LinkText hover="false" to={`/directory/warehouses/${warehouse.id}`}>
          {warehouse.warehouseName || ''}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'sentConfirmed',
    label: 'Sent',
    getValue: ({ sentConfirmed }) => (
      <LineItemCheckbox
        checked={!!sentConfirmed}
        disabled
        onChange={() => ({})}
      />
    ),
    isBoolean: true,
  },
  {
    key: 'notes1',
    label: 'Notes 1',
    getValue: ({ notes1 }) => <ty.BodyText>{notes1 || '-'}</ty.BodyText>,
  },
  {
    key: 'notes2',
    label: 'Notes 2',
    getValue: ({ notes2 }) => <ty.BodyText>{notes2 || '-'}</ty.BodyText>,
  },
  {
    key: 'notes3',
    label: 'Notes 3',
    getValue: ({ notes3 }) => <ty.BodyText>{notes3 || '-'}</ty.BodyText>,
  },
];

export const transformChangesOnUpdate = (
  changes: Container,
  treatments: ContainerTreatment[],
) => ({
  ...omit(
    [
      'containerTreatments',
      'pallets',
      'warehouse',
      'vendor',
      'vessel',
      '__typename',
    ],
    changes,
  ),
  isNew: false,
  containerTreatmentsUsingId: {
    create: ((changes.containerTreatments?.nodes || []) as ContainerTreatment[])
      .filter(({ id }) => id < 0)
      .map(({ id, ...rest }) => rest),
    updateById: (
      (changes.containerTreatments?.nodes || []) as ContainerTreatment[]
    )
      .filter(({ id }) => id > 0)
      .map(({ id, __typename, ...rest }) => ({ patch: rest, id })),
    deleteById: treatments
      .filter(
        ({ id }) =>
          !pluck(
            'id',
            (changes.containerTreatments?.nodes || []) as ContainerTreatment[],
          ).includes(id),
      )
      .map(({ id }) => ({ id: `${id}` })),
  },
});

export const validationLabels = (baseLabels: ContainerLabelInfo[]) =>
  baseLabels.concat({
    key: 'containerTreatments',
    label: 'ContainerTreatments',
    validate: ({ containerTreatments }) =>
      ((containerTreatments?.nodes || []) as ContainerTreatment[]).every(
        ({ treatmentType }) => !!treatmentType,
      ),
  });

export const getCombinedContainer = (containers: Container[]) =>
  containers.reduce((acc, container) => {
    const accTreatments = (acc.containerTreatments.nodes ||
      []) as ContainerTreatment[];
    const containerTreatments = (container.containerTreatments.nodes ||
      []) as ContainerTreatment[];
    return {
      nodeId: '',
      id: '',
      vesselCode:
        acc['vesselCode'] === container['vesselCode']
          ? acc['vesselCode']
          : 'MULTIPLE',
      vessel:
        acc['vesselCode'] === container['vesselCode']
          ? acc['vessel']
          : undefined,
      containerId:
        acc['containerId'] === container['containerId']
          ? acc['containerId']
          : 'MULTIPLE',
      vendorId:
        acc['vendorId'] === container['vendorId']
          ? acc['vendorId']
          : 'MULTIPLE',
      warehouseId:
        acc['warehouseId'] === container['warehouseId']
          ? acc['warehouseId']
          : 'MULTIPLE',
      containerDescription:
        acc['containerDescription'] === container['containerDescription']
          ? acc['containerDescription']
          : 'MULTIPLE',
      releaseDate:
        acc['releaseDate'] === container['releaseDate']
          ? acc['releaseDate']
          : null,
      releaseConfirmed:
        acc['releaseConfirmed'] === container['releaseConfirmed']
          ? acc['releaseConfirmed']
          : false,
      dischargeDate:
        acc['dischargeDate'] === container['dischargeDate']
          ? acc['dischargeDate']
          : null,
      dischargeConfirmed:
        acc['dischargeConfirmed'] === container['dischargeConfirmed']
          ? acc['dischargeConfirmed']
          : false,
      sentConfirmed:
        acc['sentConfirmed'] === container['sentConfirmed']
          ? acc['sentConfirmed']
          : false,
      notes1:
        acc['notes1'] === container['notes1'] ? acc['notes1'] : 'MULTIPLE',
      notes2:
        acc['notes2'] === container['notes2'] ? acc['notes2'] : 'MULTIPLE',
      notes3:
        acc['notes3'] === container['notes3'] ? acc['notes3'] : 'MULTIPLE',
      containerTreatments: {
        nodes: accTreatments
          .filter(
            (t) =>
              t &&
              pluck('treatmentType', containerTreatments).includes(
                t.treatmentType,
              ),
          )
          .map((t, idx) => {
            const containerTreatment = containerTreatments.find(
              (ct) => ct.treatmentType === t.treatmentType,
            );
            return containerTreatment
              ? {
                  nodeId: '',
                  id: idx,
                  treatmentType: t.treatmentType || 'UNK',
                  treatmentDate:
                    t.treatmentDate === containerTreatment.treatmentDate
                      ? t.treatmentDate
                      : null,
                  treatmentResult:
                    t.treatmentResult === containerTreatment.treatmentResult
                      ? t.treatmentResult
                      : 'MULTIPLE',
                  treatmentConfirmed:
                    t.treatmentConfirmed ===
                    containerTreatment.treatmentConfirmed
                      ? t.treatmentConfirmed
                      : false,
                  treatmentNotes:
                    t.treatmentNotes === containerTreatment.treatmentNotes
                      ? t.treatmentNotes
                      : 'MULTIPLE',
                }
              : t;
          }),
        edges: [],
        totalCount: 0,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
      pallets: {
        nodes: [] as Pallet[],
        edges: [],
        totalCount: 0,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    } as Container;
  }, containers[0]);

export const getUpdatedSheetData = (
  vessels: Vessel[],
  containers: Container[],
) =>
  JSON.stringify(
    [
      [
        [
          'ETA',
          'Trucker',
          'Vessel',
          'Shipper',
          'Pass CT',
          'Commodity',
          'Release',
          'Inspect',
          'Arrived',
          'Ship WH',
          '',
          '',
          '',
          'Original ETA',
        ],
      ],
      ...vessels.map((v) => [
        [],
        [v.arrivalDate, `#${v.vesselCode}`, v.vesselName],
        ...containers
          .filter((c) => c.vessel?.vesselCode === v.vesselCode)
          .map((c, idx) => {
            const coldTreatment = (
              (c.containerTreatments?.nodes || []) as ContainerTreatment[]
            ).find(({ treatmentType }) => treatmentType === 'Cold Treatment');
            const ctIsFail = coldTreatment?.treatmentResult === 'FAIL';
            const ctIsPass = coldTreatment?.treatmentResult === 'PASS';
            const passCTVal = coldTreatment
              ? ctIsFail
                ? 'FAIL'
                : ctIsPass
                ? coldTreatment.treatmentDate
                  ? formatShortDate(
                      new Date(coldTreatment.treatmentDate.replace(/-/g, '/')),
                    )
                  : 'PASS'
                : '-'
              : '-';

            return [
              idx === 0 ? v.warehouse?.warehouseName || '' : '',
              c.vendor?.vendorName,
              c.containerId,
              uniq((c.pallets?.nodes || []).map((p) => p?.shipper?.shipperName))
                .filter((val) => !!val)
                .join(', '),
              passCTVal,
              c.containerDescription,
              c.releaseDate
                ? formatShortDate(new Date(c.releaseDate.replace(/-/g, '/')))
                : '',
              getContainerTreatmentStatus(c).status,
              c.dischargeDate
                ? formatShortDate(new Date(c.dischargeDate.replace(/-/g, '/')))
                : '',
              c.warehouse?.warehouseName,
              c.sentConfirmed ? 'sent' : '',
              c.notes1,
              c.notes2,
              c.notes3,
            ];
          }),
      ]),
    ].flat(),
  );
