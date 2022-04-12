import React, { useState } from 'react';
import { sortBy } from 'ramda';

import api from 'api';
import { BasicModal } from 'components/modal';
import { DataMessage } from 'components/page/message';
import VirtualizedList from 'components/virtualized-list';
import useSearch from 'hooks/use-search';
import { Shipper } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface LineItemProps {
  checked: boolean;
  item: Shipper;
  id: string;
}

const LineItem = ({ checked, item, id }: LineItemProps) => {
  const [hover, setHover] = useState(false);
  const [handleUpdate] = api.useUpdateShipper(id, 'FIRST_NAME_ASC');

  return (
    <l.Div
      mb={th.spacing.md}
      ml={th.spacing.md}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <LineItemCheckbox
        checked={checked}
        label={
          <ty.CaptionText
            bold={hover || checked}
            color={
              hover ? th.colors.brand.primaryAccent : th.colors.brand.primary
            }
            ml={th.spacing.lg}
            nowrap
          >
            ({item.id}) - {item.shipperName}
          </ty.CaptionText>
        }
        onChange={() => {
          handleUpdate({
            variables: {
              id,
              updates: {
                sendProjectionRequest: !item.sendProjectionRequest,
              },
            },
          });
        }}
      />
    </l.Div>
  );
};

const ProjectionSettings = () => {
  const { Search, search } = useSearch({ paramName: 'settingsSearch' });
  const { data, loading, error } = api.useShippers(
    'SHIPPER_NAME_ASC',
    search || undefined,
  );
  const items = data
    ? sortBy(
        (shipper) => (shipper?.sendProjectionRequest ? 'a' : 'b'),
        data.nodes as Shipper[],
      )
    : [];

  return (
    <BasicModal
      title="Shipper Projection Settings"
      content={
        <l.Flex column alignCenter>
          <div>
            <l.Div ml={th.spacing.md}>
              <ty.BodyText mb={th.spacing.md}>
                Send Projection Reminders:
              </ty.BodyText>
              {Search}
            </l.Div>
            <l.Div height={500} mt={th.spacing.lg}>
              {data ? (
                <VirtualizedList
                  height={500}
                  rowCount={items.length}
                  rowHeight={28}
                  rowRenderer={({ key, index, style }) => {
                    const item = items[index];
                    return (
                      item && (
                        <div key={key} style={style}>
                          <LineItem
                            checked={!!item.sendProjectionRequest}
                            id={item.id}
                            item={item}
                          />
                        </div>
                      )
                    );
                  }}
                  width={580}
                />
              ) : (
                <DataMessage
                  data={items}
                  error={error}
                  loading={loading}
                  emptyProps={{
                    header: 'No shippers found',
                    text: 'Modify search parameters to view more results.',
                  }}
                />
              )}
            </l.Div>
          </div>
        </l.Flex>
      }
      cancelText="Close"
      confirmText=""
      handleConfirm={() => {}}
      triggerText="Settings"
    />
  );
};

export default ProjectionSettings;
