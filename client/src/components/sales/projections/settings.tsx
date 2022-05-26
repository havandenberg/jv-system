import React, { useState } from 'react';
import styled from '@emotion/styled';
import { sortBy } from 'ramda';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import DateTimePicker from 'components/date-time-picker';
import { BasicModal } from 'components/modal';
import { DataMessage } from 'components/page/message';
import VirtualizedList from 'components/virtualized-list';
import useSearch from 'hooks/use-search';
import { Shipper } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export const gridTemplateColumns = '3fr 1fr 1fr';

const LocalDateTimePicker = styled(DateTimePicker)({
  fontSize: th.fontSizes.caption,
  width: 110,
  input: {
    color: th.colors.text.default,
  },
  '.react-datetime-picker__wrapper': {
    height: 22,
    padding: 0,
  },
  '.react-datetime-picker__inputGroup': {
    width: 'auto',
  },
});

interface LineItemProps {
  checked: boolean;
  item: Shipper;
  id: string;
}

const LineItem = ({ checked, item, id }: LineItemProps) => {
  const [hover, setHover] = useState(false);
  const [handleUpdate] = api.useUpdateShipper(id, 'FIRST_NAME_ASC');

  const dateTimePickerProps = {
    calendarIcon: null,
    clearIcon: null,
    disableClock: true,
    locale: 'en-US',
    format: 'y-MM-dd',
    dayPlaceholder: '',
    monthPlaceholder: '',
    yearPlaceholder: '',
  };

  const projectionRequestStartDate = item.projectionRequestStartDate
    ? new Date(item.projectionRequestStartDate.replace(/-/g, '/'))
    : null;

  const projectionRequestEndDate = item.projectionRequestEndDate
    ? new Date(item.projectionRequestEndDate.replace(/-/g, '/'))
    : null;

  return (
    <l.Grid
      gridTemplateColumns={gridTemplateColumns}
      mb={th.spacing.md}
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
            bold={
              hover ||
              (checked &&
                projectionRequestStartDate &&
                projectionRequestEndDate)
            }
            color={
              hover ? th.colors.brand.primaryAccent : th.colors.brand.primary
            }
            ml={th.spacing.md}
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
      <l.Div mr={th.spacing.sm}>
        <LocalDateTimePicker
          maxDate={projectionRequestEndDate || undefined}
          onChange={(date: Date) =>
            handleUpdate({
              variables: {
                id,
                updates: {
                  projectionRequestStartDate: formatDate(date),
                },
              },
            })
          }
          value={projectionRequestStartDate}
          {...dateTimePickerProps}
        />
      </l.Div>
      <LocalDateTimePicker
        minDate={projectionRequestStartDate || undefined}
        onChange={(date: Date) =>
          handleUpdate({
            variables: {
              id,
              updates: {
                projectionRequestEndDate: formatDate(date),
              },
            },
          })
        }
        value={projectionRequestEndDate}
        {...dateTimePickerProps}
      />
    </l.Grid>
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
            <l.Div>
              <ty.BodyText mb={th.spacing.md}>
                Send Projection Reminders:
              </ty.BodyText>
              {Search}
            </l.Div>
            <l.Grid
              gridTemplateColumns={gridTemplateColumns}
              mr={items.length > 17 ? th.spacing.md : 0}
              mb={th.spacing.md}
              mt={th.spacing.lg}
            >
              <ty.CaptionText secondary>Shipper Name</ty.CaptionText>
              <ty.CaptionText secondary>Start Date</ty.CaptionText>
              <ty.CaptionText secondary>End Date</ty.CaptionText>
            </l.Grid>
            <l.Div height={500}>
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
