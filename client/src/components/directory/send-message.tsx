import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { groupBy, isEmpty, pluck } from 'ramda';

import Modal from 'components/modal';
import { StyledTab } from 'components/tab-bar';
import usePrevious from 'hooks/use-previous';
import { PersonContact } from 'types';
import b from 'ui/button';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { useDirectorySelectionContext } from './selection-context';

type FinalItemType = 'to' | 'cc' | 'bcc';

interface FinalItem extends PersonContact {
  checked: boolean;
  type: FinalItemType;
}

const TypeTab = ({
  item,
  onClick,
  type,
}: {
  item: FinalItem;
  onClick: () => void;
  type: FinalItemType;
}) => (
  <StyledTab
    disabled={!item.checked}
    borderRadius={th.borderRadii.default}
    mx={th.spacing.xs}
    onClick={onClick}
    padding={`${th.spacing.tn} ${th.spacing.sm}`}
    selected={item.type === type}
  >
    <ty.CaptionText>{type}</ty.CaptionText>
  </StyledTab>
);

interface LineItemProps {
  item: FinalItem;
  setFinalItemType: (type: FinalItemType) => void;
  toggleChecked: () => void;
}

const LineItem = ({ item, setFinalItemType, toggleChecked }: LineItemProps) => (
  <l.Flex alignCenter mb={th.spacing.sm}>
    <l.Div flex={1}>
      {item.email ? (
        <LineItemCheckbox
          checked={item.checked}
          label={
            <ty.CaptionText ml={th.spacing.md}>
              {item.firstName} {item.lastName} - {item.email}
            </ty.CaptionText>
          }
          onChange={toggleChecked}
        />
      ) : (
        <ty.CaptionText color={th.colors.status.error} ml={34}>
          {item.firstName} {item.lastName} - No email on record.
        </ty.CaptionText>
      )}
    </l.Div>
    {item.email && (
      <l.Flex>
        <TypeTab item={item} onClick={() => setFinalItemType('to')} type="to" />
        <TypeTab item={item} onClick={() => setFinalItemType('cc')} type="cc" />
        <TypeTab
          item={item}
          onClick={() => setFinalItemType('bcc')}
          type="bcc"
        />
      </l.Flex>
    )}
  </l.Flex>
);

const SendEmailModal = () => {
  const [selectedItems] = useDirectorySelectionContext();
  const previousSelectedItems = usePrevious(selectedItems);

  const getFlattenedItems = useCallback(() => {
    let flattenedItems: FinalItem[] = [];
    flattenedItems = flattenedItems.concat(
      selectedItems.internal.map((item) => ({
        ...item,
        checked: !!item.email,
        type: 'to',
      })),
    );
    flattenedItems = flattenedItems.concat(
      selectedItems.customers
        .map((customer) =>
          customer.selectedContacts.map((item) => ({
            ...item,
            checked: !!item.email,
            type: 'to',
          })),
        )
        .flat() as FinalItem[],
    );
    flattenedItems = flattenedItems.concat(
      selectedItems.shippers
        .map((shipper) =>
          shipper.selectedContacts.map((item) => ({
            ...item,
            checked: !!item.email,
            type: 'to',
          })),
        )
        .flat() as FinalItem[],
    );
    flattenedItems = flattenedItems.concat(
      selectedItems.warehouses
        .map((warehouse) =>
          warehouse.selectedContacts.map((item) => ({
            ...item,
            checked: !!item.email,
            type: 'to',
          })),
        )
        .flat() as FinalItem[],
    );
    flattenedItems = flattenedItems.concat(
      selectedItems.groups
        .map((group) =>
          group.selectedContacts.map((item) => ({
            ...item,
            checked: !!item.email,
            type: 'to',
          })),
        )
        .flat() as FinalItem[],
    );
    return flattenedItems;
  }, [selectedItems]);

  const [finalItems, setFinalItems] = useState(getFlattenedItems());
  const groupedFinalItems = groupBy(
    (item) => item.type,
    finalItems.filter((item) => item.email),
  );
  const isValid = groupedFinalItems.to;

  const getFinalItem = (item: PersonContact) =>
    finalItems.find((it) => it.id === item.id);

  const toggleChecked = (finalItem: FinalItem) => {
    setFinalItems([
      ...finalItems.filter((it) => it.id !== finalItem.id),
      { ...finalItem, checked: !!finalItem.email && !finalItem.checked },
    ]);
  };

  const setFinalItemType = (finalItem: FinalItem, type: FinalItemType) => {
    setFinalItems([
      ...finalItems.filter((it) => it.id !== finalItem.id),
      { ...finalItem, type },
    ]);
  };

  const getMailToLink = () => {
    const { to, cc, bcc } = groupedFinalItems;
    return `mailto:${
      to ? pluck('email', to).join(';') + (cc || bcc ? '?' : '') : ''
    }${cc ? 'cc=' + pluck('email', cc).join(';') + (bcc ? '&' : '') : ''}${
      bcc ? 'bcc=' + pluck('email', bcc).join(';') : ''
    }`;
  };

  useEffect(() => {
    if (previousSelectedItems !== selectedItems) {
      setFinalItems(getFlattenedItems());
    }
  }, [getFlattenedItems, previousSelectedItems, selectedItems]);

  return (
    <Modal
      trigger={(show) => (
        <b.Primary disabled={isEmpty(finalItems)} onClick={show}>
          Send Message
        </b.Primary>
      )}
    >
      {({ hide }) => (
        <>
          <ty.TitleText>Send New Message</ty.TitleText>
          <ty.BodyText mb={th.spacing.sm}>
            You have selected the following contacts to send an email to. You
            may edit your selection below and continue when ready.
          </ty.BodyText>
          <l.Flex height={19} justifyCenter mb={th.spacing.sm}>
            <ty.BodyText color={th.colors.status.error}>
              {isValid ? '' : 'Select at least one "to" email.'}
            </ty.BodyText>
          </l.Flex>
          <l.Flex column maxHeight={500} overflowY="auto">
            <>
              {!isEmpty(selectedItems.internal) && (
                <l.Div mb={th.spacing.lg}>
                  <ty.BodyText mb={th.spacing.md}>Internal</ty.BodyText>
                  {selectedItems.internal.map((item) => {
                    const finalItem = getFinalItem(item);
                    return (
                      finalItem && (
                        <LineItem
                          item={finalItem}
                          key={item.id}
                          setFinalItemType={(type: FinalItemType) =>
                            setFinalItemType(finalItem, type)
                          }
                          toggleChecked={() => toggleChecked(finalItem)}
                        />
                      )
                    );
                  })}
                </l.Div>
              )}
              {!isEmpty(selectedItems.customers) && (
                <l.Div mb={th.spacing.lg}>
                  <ty.BodyText>Customers</ty.BodyText>
                  {selectedItems.customers.map(
                    (customer) =>
                      !isEmpty(customer.selectedContacts) && (
                        <Fragment key={customer.id}>
                          <ty.CaptionText bold my={th.spacing.md}>
                            {customer.customerName}
                          </ty.CaptionText>
                          {customer.selectedContacts.map((item) => {
                            const finalItem = getFinalItem(item);
                            return (
                              finalItem && (
                                <LineItem
                                  item={finalItem}
                                  key={item.id}
                                  setFinalItemType={(type: FinalItemType) =>
                                    setFinalItemType(finalItem, type)
                                  }
                                  toggleChecked={() => toggleChecked(finalItem)}
                                />
                              )
                            );
                          })}
                        </Fragment>
                      ),
                  )}
                </l.Div>
              )}
              {!isEmpty(selectedItems.shippers) && (
                <l.Div mb={th.spacing.lg}>
                  <ty.BodyText>Shippers</ty.BodyText>
                  {selectedItems.shippers.map(
                    (shipper) =>
                      !isEmpty(shipper.selectedContacts) && (
                        <Fragment key={shipper.id}>
                          <ty.CaptionText bold my={th.spacing.md}>
                            {shipper.shipperName}
                          </ty.CaptionText>
                          {shipper.selectedContacts.map((item) => {
                            const finalItem = getFinalItem(item);
                            return (
                              finalItem && (
                                <LineItem
                                  item={finalItem}
                                  key={item.id}
                                  setFinalItemType={(type: FinalItemType) =>
                                    setFinalItemType(finalItem, type)
                                  }
                                  toggleChecked={() => toggleChecked(finalItem)}
                                />
                              )
                            );
                          })}
                        </Fragment>
                      ),
                  )}
                </l.Div>
              )}
              {!isEmpty(selectedItems.warehouses) && (
                <l.Div mb={th.spacing.lg}>
                  <ty.BodyText>Warehouses</ty.BodyText>
                  {selectedItems.warehouses.map(
                    (warehouse) =>
                      !isEmpty(warehouse.selectedContacts) && (
                        <Fragment key={warehouse.id}>
                          <ty.CaptionText bold my={th.spacing.md}>
                            {warehouse.warehouseName}
                          </ty.CaptionText>
                          {warehouse.selectedContacts.map((item) => {
                            const finalItem = getFinalItem(item);
                            return (
                              finalItem && (
                                <LineItem
                                  item={finalItem}
                                  key={item.id}
                                  setFinalItemType={(type: FinalItemType) =>
                                    setFinalItemType(finalItem, type)
                                  }
                                  toggleChecked={() => toggleChecked(finalItem)}
                                />
                              )
                            );
                          })}
                        </Fragment>
                      ),
                  )}
                </l.Div>
              )}
              {!isEmpty(selectedItems.groups) && (
                <l.Div mb={th.spacing.lg}>
                  <ty.BodyText>Groups</ty.BodyText>
                  {selectedItems.groups.map(
                    (group) =>
                      !isEmpty(group.selectedContacts) && (
                        <Fragment key={group.id}>
                          <ty.CaptionText bold my={th.spacing.md}>
                            {group.groupName}
                          </ty.CaptionText>
                          {group.selectedContacts.map((item) => {
                            const finalItem = getFinalItem(item);
                            return (
                              finalItem && (
                                <LineItem
                                  item={finalItem}
                                  key={item.id}
                                  setFinalItemType={(type: FinalItemType) =>
                                    setFinalItemType(finalItem, type)
                                  }
                                  toggleChecked={() => toggleChecked(finalItem)}
                                />
                              )
                            );
                          })}
                        </Fragment>
                      ),
                  )}
                </l.Div>
              )}
            </>
          </l.Flex>
          <l.Flex justifyCenter mt={th.spacing.xl}>
            <b.Primary
              mr={th.spacing.md}
              onClick={() => {
                setFinalItems(getFlattenedItems());
                hide();
              }}
            >
              Cancel
            </b.Primary>
            <l.Anchor href={isValid ? getMailToLink() : '#'}>
              <b.Primary disabled={!isValid}>Continue</b.Primary>
            </l.Anchor>
          </l.Flex>
        </>
      )}
    </Modal>
  );
};

export default SendEmailModal;
