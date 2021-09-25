import React, { useState } from 'react';
import { getDay } from 'date-fns';
import { isEmpty, pluck, sortBy } from 'ramda';

import api from 'api';
import AddItem from 'components/add-item';
import { formatDate } from 'components/date-range-picker';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import useDateRange from 'hooks/use-date-range';
import useScrollToTop from 'hooks/use-scroll-to-top';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getDateOfISOWeek } from 'utils/date';

import AgendaItem from './item';
import { AgendaItemUpdate } from './types';

const Agenda = () => {
  useScrollToTop();
  const {
    selectedWeekNumber,
    startDate,
    startDateQuery,
    DateRangePicker,
    ForwardButton,
    BackwardButton,
  } = useDateRange({
    disabledDay: (date: Date) => ![1, 3].includes(getDay(date)),
    hideDefinedRanges: true,
    showLongDate: true,
    singleSelection: true,
    weekChangeType: 'agenda',
  });

  const [changes, setChanges] = useState<AgendaItemUpdate[]>([]);
  const [newItemNextId, setNewItemNextId] = useState(-1);

  const [handleUpdate] = api.useUpdateAgendaItems();
  const [handleDeleteItem] = api.useDeleteAgendaItem();

  const { data, loading, error } = api.useAgendaItems();
  const items = data ? data.nodes : [];

  const allItems = sortBy((i) => i.sortOrder, [
    ...items.filter((it) => it && !pluck('id', changes).includes(it.id)),
    ...changes.filter((it) => it.itemDate === formatDate(startDate)),
  ] as AgendaItemUpdate[]);

  const handleSave = (id: number, onComplete: () => void) => {
    handleUpdate({
      variables: {
        items: changes
          .filter((i) => i.id === id)
          .map((i) => ({
            content: i.content,
            itemDate: i.itemDate,
            sortOrder: i.sortOrder,
            id: i.id < 0 ? undefined : parseInt(i.id, 10),
          })),
      },
    }).then(() => {
      onComplete();
      handleCancel(id);
    });
  };

  const handleCancel = (id: number) => {
    setChanges(changes.filter((i) => i.id !== id));
  };

  const handleChange = (updates: AgendaItemUpdate[]) => {
    let updatedItems = changes;
    updates.forEach((update) => {
      if (changes.find((u) => u.id === update.id)) {
        updatedItems = updatedItems.map((u) =>
          u.id === update.id ? update : u,
        );
      } else {
        updatedItems = [...updatedItems, update];
      }
    });
    setChanges(updatedItems);
  };

  const handleSortChange = (
    item: AgendaItemUpdate,
    direction: 'up' | 'down',
  ) => {
    const adjacentItem = allItems.find(
      (i) =>
        i &&
        i.sortOrder ===
          (direction === 'up' ? item.sortOrder - 1 : item.sortOrder + 1),
    );
    if (adjacentItem) {
      const updatedItems = [
        {
          ...item,
          sortOrder: adjacentItem.sortOrder,
        },
        {
          ...adjacentItem,
          sortOrder: item.sortOrder,
        },
        ...items.filter((i) =>
          i ? ![item.id, adjacentItem.id].includes(i.id) : i,
        ),
      ];
      if (item.id > 0 && adjacentItem.id > 0) {
        handleUpdate({
          variables: {
            items: (updatedItems as AgendaItemUpdate[]).map((i) => ({
              content: i.content,
              itemDate: i.itemDate,
              sortOrder: i.sortOrder,
              id: parseInt(i.id, 10),
            })),
          },
        });
      }
    }
  };

  const handleRemoveItem = (id: number, sortOrder: number) => {
    if (id < 0) {
      setChanges(changes.filter((item) => item.id !== id));
    } else {
      handleDeleteItem({ variables: { id } }).then(() => {});
      const existingItems = items.filter(
        (item) => item && item.sortOrder > sortOrder,
      );
      handleUpdate({
        variables: {
          items: existingItems.map((i) =>
            i
              ? {
                  content: i.content,
                  id: parseInt(i.id, 10),
                  itemDate: i.itemDate,
                  sortOrder: i.sortOrder - 1,
                }
              : i,
          ),
        },
      });
    }
  };

  return (
    <Page
      actions={[
        <l.AreaLink
          key={0}
          to={`/sales/price-sheet?endDate=${startDateQuery}&startDate=${startDateQuery}`}
        >
          <b.Primary>Price Sheet</b.Primary>
        </l.AreaLink>,
      ]}
      extraPaddingTop={86}
      headerChildren={
        <>
          <l.Flex alignCenter>
            {DateRangePicker}
            {BackwardButton}
            {ForwardButton}
          </l.Flex>
          <l.Flex my={th.sizes.icon}>
            <ty.BodyText flex={1}>
              <ty.Span bold>Long Term:</ty.Span> Loading weeks{' '}
              <ty.Span bold>{selectedWeekNumber + 2}</ty.Span>{' '}
              {`(${getDateOfISOWeek(selectedWeekNumber + 2, 'M/d')})`} -{' '}
              <ty.Span bold>{selectedWeekNumber + 3}</ty.Span>{' '}
              {`(${getDateOfISOWeek(selectedWeekNumber + 3, 'M/d')})`}
            </ty.BodyText>
            <ty.BodyText flex={1}>
              <ty.Span bold>Short Term:</ty.Span> Loading weeks{' '}
              <ty.Span bold>{selectedWeekNumber}</ty.Span>{' '}
              {`(${getDateOfISOWeek(selectedWeekNumber, 'M/d')})`} -{' '}
              <ty.Span bold>{selectedWeekNumber + 1}</ty.Span>{' '}
              {`(${getDateOfISOWeek(selectedWeekNumber + 1, 'M/d')})`}
            </ty.BodyText>
          </l.Flex>
        </>
      }
      title="Meeting Agenda"
    >
      {allItems.map((item, idx) => (
        <AgendaItem
          handleChange={handleChange}
          handleRemoveItem={handleRemoveItem}
          handleSave={handleSave}
          handleSortChange={handleSortChange}
          hasChanges={
            !!changes.find(
              (ch) => ch.id === item.id && item.content !== ch.content,
            )
          }
          item={item}
          key={`${item.id}-${item.sortOrder}`}
          selectedWeekNumber={selectedWeekNumber}
          isFirst={idx === 0}
          isLast={idx >= allItems.length - 1}
          onCancel={handleCancel}
        />
      ))}
      {isEmpty(allItems) && (
        <DataMessage
          data={allItems}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No Agenda Items Found',
            text: 'Modify date parameters to view more results.',
          }}
        />
      )}
      <l.Div mb={th.spacing.xxl} mt={th.spacing.lg}>
        <AddItem
          disabled={false}
          onClick={() => {
            handleChange([
              {
                id: newItemNextId,
                content: '',
                itemDate: formatDate(startDate),
                sortOrder: allItems.length,
              },
            ]);
            setNewItemNextId(newItemNextId - 1);
          }}
          text="Add agenda item"
        />
      </l.Div>
    </Page>
  );
};

export default Agenda;
