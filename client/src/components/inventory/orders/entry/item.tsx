import React, { ChangeEvent, useState } from 'react';
import { ApolloError } from '@apollo/client';
import { differenceInDays, format } from 'date-fns';
import { sortBy } from 'ramda';

import HighlightImg from 'assets/images/highlight';
import PlusInCircle from 'assets/images/plus-in-circle';
import EditableCell from 'components/editable-cell';
import { reducePalletData } from 'components/inventory/inventory/utils';
import useItemSelector from 'components/item-selector';
import ItemLinkRow, { ItemLink } from 'components/item-selector/link';
import { BasicModal } from 'components/modal';
import {
  CommonSpecies,
  InventoryItem,
  OrderEntryItem,
  Shipper,
  Vessel,
  Warehouse,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns } from '.';
import { itemListLabels } from './data-utils';
import { isDateLessThanOrEqualTo } from 'utils/date';

type Props = {
  commonSpecieses: CommonSpecies[];
  currentItem: OrderEntryItem;
  duplicateIds: number[];
  editing: boolean;
  error?: ApolloError;
  fobDate?: string;
  handleChange: (
    key: keyof OrderEntryItem,
    value: string | number | boolean | null,
  ) => void;
  handleNewItem: (updatedItem: OrderEntryItem) => void;
  handleRemoveItem: (id: number) => void;
  inventoryItems: InventoryItem[];
  loading: boolean;
  originalItem?: OrderEntryItem;
  saveAttempt: boolean;
  shippers: Shipper[];
  showRemoveIcon: boolean;
  updatedItem: OrderEntryItem;
  vessels: Vessel[];
  warehouses: Warehouse[];
};

type FilterKey =
  | 'label'
  | 'locationId'
  | 'packType'
  | 'palletCount'
  | 'plu'
  | 'shipperId'
  | 'size'
  | 'species'
  | 'variety'
  | 'vesselCode'
  | 'unitSellPrice'
  | 'deliveryCharge'
  | 'notes';

const NewOrderEntryItem = ({
  commonSpecieses,
  currentItem,
  duplicateIds,
  editing,
  error,
  fobDate,
  handleChange,
  handleNewItem,
  handleRemoveItem,
  inventoryItems,
  loading,
  originalItem,
  saveAttempt,
  shippers,
  showRemoveIcon,
  updatedItem,
  vessels,
  warehouses,
}: Props) => {
  const {
    id,
    species,
    variety,
    size,
    packType,
    plu,
    shipperId,
    locationId,
    vesselCode,
    label,
    palletCount,
    unitSellPrice,
    deliveryCharge,
  } = updatedItem;

  const isDuplicate = duplicateIds.includes(parseInt(id, 10));

  const commonSpecies = commonSpecieses.find(
    (sp) => sp && sp.productSpeciesId === species,
  );
  const commonVariety = commonSpecies?.commonVarieties.nodes.find(
    (v) => v && v.productVarietyId === variety,
  );
  const commonSize = commonSpecies?.commonSizes.nodes.find(
    (sz) => sz && sz.productSizeId === size,
  );
  const commonPackType = commonSpecies?.commonPackTypes.nodes.find(
    (pt) => pt && pt.packMaster?.packDescription === packType,
  );
  const shipper = shippers.find((s) => s && s.id === shipperId);
  const vessel = vessels.find((v) => v && v.vesselCode === vesselCode);
  const warehouse = warehouses.find((w) => w && w.id === locationId);

  const getSelectorValue = (type: FilterKey) => {
    switch (type) {
      case 'species':
        return commonSpecies?.speciesName || species || '';
      case 'variety':
        return commonVariety?.varietyName || variety || '';
      case 'size':
        return commonSize?.sizeName || size || '';
      case 'packType':
        return commonPackType?.packTypeName || packType || '';
      case 'shipperId':
        return shipper?.shipperName || shipperId || '';
      case 'vesselCode':
        return vessel?.vesselName || vesselCode || '';
      case 'locationId':
        return warehouse?.warehouseName || locationId || '';
      case 'plu':
        return plu || '';
      case 'label':
        return label || '';
      default:
        return '';
    }
  };

  const isValueDirty = (type: FilterKey) => {
    switch (type) {
      case 'species':
        return species !== currentItem.species;
      case 'variety':
        return variety !== currentItem.variety;
      case 'size':
        return size !== currentItem.size;
      case 'packType':
        return packType !== currentItem.packType;
      case 'shipperId':
        return shipperId !== currentItem.shipperId;
      case 'vesselCode':
        return vesselCode !== currentItem.vesselCode;
      case 'locationId':
        return locationId !== currentItem.locationId;
      case 'plu':
        return plu !== currentItem.plu;
      case 'label':
        return label !== currentItem.label;
      case 'palletCount':
        return palletCount !== currentItem.palletCount;
      case 'deliveryCharge':
        return deliveryCharge !== currentItem.deliveryCharge;
      case 'unitSellPrice':
        return unitSellPrice !== currentItem.unitSellPrice;
      default:
        return true;
    }
  };

  const locationOptions = [] as ItemLink[];
  const shipperOptions = [] as ItemLink[];
  const labelOptions = [] as ItemLink[];
  const speciesOptions = [] as ItemLink[];
  const varietyOptions = [] as ItemLink[];
  const sizeOptions = [] as ItemLink[];
  const packTypeOptions = [] as ItemLink[];
  const pluOptions = [] as ItemLink[];
  const vesselOptions = [] as ItemLink[];

  const filteredItems = inventoryItems.filter((item) => {
    const otherCategory = {
      id: 'other',
      speciesDescription: 'Other',
      varietyDescription: 'Other',
      sizeDescription: 'Other',
      combineDescription: 'Other',
      packDescription: 'Other',
      label: {
        labelCode: 'other',
        labelName: 'Other',
      },
      shipperName: 'Other',
    };

    if (!item) {
      return false;
    }

    const itemSpecies = item.product?.species || otherCategory;
    const itemVariety = item.product?.variety || otherCategory;
    const itemSize = item.product?.sizes?.nodes[0] || otherCategory;
    const itemPackType = item.product?.packType || otherCategory;

    const dateValid =
      !fobDate ||
      (item.vessel &&
        isDateLessThanOrEqualTo(
          new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
          new Date(fobDate.replace(/-/g, '/')),
        ));

    const isValid =
      dateValid &&
      (!warehouse ||
        `${item.warehouse?.warehouseName}`.includes(`${locationId}`) ||
        ['Any', item.warehouse?.id].includes(locationId || undefined)) &&
      (!shipper ||
        `${item.shipper?.shipperName}`.includes(`${shipperId}`) ||
        ['Any', item.shipper?.id].includes(shipperId || undefined)) &&
      (!species ||
        `${itemSpecies?.speciesDescription}`.includes(species) ||
        [itemSpecies?.id].includes(species)) &&
      (!variety ||
        `${itemVariety?.varietyDescription}`.includes(variety) ||
        ['Any', itemVariety?.id].includes(variety)) &&
      (!size ||
        `${itemSize?.combineDescription}`.includes(size) ||
        ['Any', itemSize?.id].includes(size)) &&
      (!packType ||
        `${itemPackType?.packDescription}`.includes(packType) ||
        ['Any', itemPackType?.id].includes(packType)) &&
      (!vesselCode ||
        `${item?.vessel?.vesselCode}`.includes(vesselCode) ||
        ['Any', item?.vessel?.vesselCode].includes(vesselCode)) &&
      (!label ||
        `${itemPackType?.label?.labelCode}`.includes(label) ||
        ['Any', itemPackType?.label?.labelCode].includes(label)) &&
      (!plu ||
        (item.plu ? 'PLU' : 'No PLU').includes(plu) ||
        ['Any', item.plu ? 'PLU' : 'No PLU'].includes(plu));

    if (isValid) {
      if (
        !locationOptions.find(({ id }) => id === item.warehouse?.id) &&
        item.warehouse
      ) {
        locationOptions.push({
          text: `${item.warehouse.warehouseName} (${item.warehouse.id})`,
          id: item.warehouse.id,
        });
      }

      if (
        !vesselOptions.find(({ id }) => id === item.vessel?.vesselCode) &&
        item.vessel
      ) {
        const dischargeDate = new Date(
          item.vessel.dischargeDate.replace(/-/g, '/'),
        );
        const dayCount = differenceInDays(
          dischargeDate,
          fobDate ? new Date(fobDate.replace(/-/g, '/')) : new Date(),
        );
        vesselOptions.push({
          text: `${item.vessel.vesselName}|${item.vessel.vesselCode}|${format(
            dischargeDate,
            'MMM dd',
          )}|${dayCount >= 0 ? '+' : ''}${dayCount}d|${item.palletsAvailable}`,
          id: item.vessel.vesselCode,
        });
      }

      if (
        !shipperOptions.find(({ id }) => id === item.shipper?.id) &&
        item.shipper
      ) {
        shipperOptions.push({
          text: `${item.shipper.shipperName} (${item.shipper.id})`,
          id: item.shipper.id,
        });
      }

      if (
        !labelOptions.find(({ id }) => id === itemPackType?.label?.labelCode) &&
        itemPackType?.label
      ) {
        labelOptions.push({
          text: `${itemPackType.label.labelName}`,
          id: `${itemPackType.label.labelCode}`,
        });
      }

      if (!pluOptions.find(({ id }) => id === (item.plu ? 'PLU' : 'No PLU'))) {
        pluOptions.push({
          text: item.plu ? 'PLU' : 'No PLU',
          id: item.plu ? 'PLU' : 'No PLU',
        });
      }

      if (
        !speciesOptions.find(({ id }) => id === itemSpecies?.id) &&
        itemSpecies
      ) {
        speciesOptions.push({
          text: `${itemSpecies.speciesDescription} (${itemSpecies.id})`,
          id: itemSpecies.id,
        });
      }

      if (
        !varietyOptions.find(({ id }) => id === itemVariety?.id) &&
        itemVariety
      ) {
        varietyOptions.push({
          text: `${itemVariety.varietyDescription}`,
          id: itemVariety.id,
        });
      }

      if (!sizeOptions.find(({ id }) => id === itemSize?.id) && itemSize) {
        sizeOptions.push({
          text: `${itemSize.combineDescription}`,
          id: itemSize.id,
        });
      }

      if (
        !packTypeOptions.find(
          ({ id }) => id === itemPackType?.packDescription,
        ) &&
        itemPackType
      ) {
        packTypeOptions.push({
          text: `${itemPackType.packDescription}`,
          id: `${itemPackType?.packDescription}`,
        });
      }
    }

    return isValid;
  });

  const noItemsFound = !loading && filteredItems.length === 0;

  const getOptions = (options: ItemLink[], allowAny: boolean = true) => [
    ...(allowAny ? [{ text: 'Any', id: 'Any' }] : []),
    ...sortBy(
      (opt) => (opt.text === 'Other' ? 'zzzzzzz' : opt.text.toLowerCase()),
      options,
    ),
  ];

  const commonSelectorProps = {
    closeOnSelect: true,
    error,
    height: 150,
    loading,
    panelGap: 0,
    width: 250,
  };

  const filterOptions = {
    locationId: locationOptions,
    vesselCode: vesselOptions,
    shipperId: shipperOptions,
    species: speciesOptions,
    variety: varietyOptions,
    size: sizeOptions,
    packType: packTypeOptions,
    label: labelOptions,
    plu: pluOptions,
    palletCount: [],
    unitSellPrice: [],
    deliveryCharge: [],
    notes: [],
  };

  const getVesselItemContent = (item: ItemLink) => {
    const isAny = item.id === 'Any';
    const isLabels = item.id === 'labels';

    const textArray = item.text.split('|');
    const nameText = textArray[0];
    const codeText = textArray[1];
    const dateText = textArray[2];
    const daysText = textArray[3];
    const days = parseInt(daysText, 10);
    const palletsAvailableText = textArray[4];
    const palletsAvailable = parseInt(palletsAvailableText, 10);

    const isActive = item.id === updatedItem.vesselCode;

    return (
      <l.Grid
        alignCenter
        gridTemplateColumns="1fr 35px 50px 35px 35px"
        gridColumnGap={th.spacing.md}
        px={th.spacing.sm}
        py={th.spacing.md}
        width={th.sizes.fill}
      >
        <ty.CaptionText
          bold={!isLabels && isActive}
          nowrap
          overflow="hidden"
          secondary={isLabels}
          textOverflow="ellipsis"
          title={item.text}
        >
          {isAny ? item.text : nameText}
        </ty.CaptionText>
        {!isAny && (
          <ty.CaptionText bold={!isLabels && isActive} secondary={isLabels}>
            {codeText}
          </ty.CaptionText>
        )}
        {dateText !== undefined && !isAny ? (
          <ty.CaptionText bold={!isLabels && isActive} secondary={isLabels}>
            {dateText}
          </ty.CaptionText>
        ) : null}
        {dateText && !isAny ? (
          <ty.CaptionText
            bold={!isLabels && (days === 0 || isActive)}
            color={
              isLabels
                ? th.colors.text.default
                : days > -1
                ? th.colors.status.success
                : days > -10
                ? th.colors.status.warning
                : th.colors.status.error
            }
            secondary={isLabels}
          >
            {daysText}
          </ty.CaptionText>
        ) : null}
        {palletsAvailable !== undefined && !isAny ? (
          <ty.CaptionText
            bold={!isLabels && isActive}
            color={
              isLabels
                ? th.colors.text.default
                : palletsAvailable > 0
                ? th.colors.status.success
                : palletsAvailable < 0
                ? th.colors.status.error
                : th.colors.status.warning
            }
            secondary={isLabels}
          >
            {palletsAvailableText}
          </ty.CaptionText>
        ) : null}
      </l.Grid>
    );
  };

  const getItemSelectorProps = (type: FilterKey, allowAny?: boolean) => {
    const value = getSelectorValue(type);
    const isDirty = isValueDirty(type);

    const getItemContent =
      type === 'vesselCode'
        ? getVesselItemContent
        : (link: ItemLink) => (
            <ItemLinkRow active={link.id === updatedItem[type]} link={link} />
          );

    const selectItem = ({ id }: ItemLink) => {
      handleChange(type, id === '-1' ? null : id);
    };

    const validate = itemListLabels.find(({ key }) => key === type)?.validate;
    const isValid = validate ? validate(updatedItem) : true;

    const allItems = getOptions(filterOptions[type], allowAny);

    return {
      ...commonSelectorProps,
      allItems:
        type === 'vesselCode'
          ? [
              { id: 'Any', text: 'Any' },
              {
                id: 'labels',
                text: 'Name|Code|Arrival|Age|Avail',
                disabled: true,
              },
              ...sortBy(
                ({ text }) => {
                  const textArray = text.split('|');
                  const dateText = textArray[2];
                  const date = new Date(dateText);
                  return date;
                },
                allItems.filter(({ id }) => id !== 'Any'),
              ),
            ]
          : allItems,
      editableCellProps: {
        bypassLocalValue: true,
        content: { dirty: isDirty, value },
        defaultChildren: null,
        editing,
        error: editing && saveAttempt && (isDuplicate || !isValid),
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          handleChange(type, e.target.value);
        },
        warning: noItemsFound,
      },
      getItemContent,
      nameKey: 'text' as keyof ItemLink,
      selectItem,
      width:
        type === 'vesselCode'
          ? 400
          : type === 'locationId'
          ? 283
          : commonSelectorProps.width,
    };
  };

  const { ItemSelector: SpeciesSelector } = useItemSelector({
    errorLabel: 'species',
    ...getItemSelectorProps('species', false),
  });

  const { ItemSelector: VarietySelector } = useItemSelector({
    errorLabel: 'varieties',
    ...getItemSelectorProps('variety'),
  });

  const { ItemSelector: SizeSelector } = useItemSelector({
    errorLabel: 'sizes',
    ...getItemSelectorProps('size'),
  });

  const { ItemSelector: PackTypeSelector } = useItemSelector({
    errorLabel: 'pack types',
    ...getItemSelectorProps('packType'),
  });

  const { ItemSelector: ShipperSelector } = useItemSelector({
    errorLabel: 'shippers',
    ...getItemSelectorProps('shipperId'),
  });

  const { ItemSelector: WarehouseSelector } = useItemSelector({
    errorLabel: 'warehouses',
    ...getItemSelectorProps('locationId'),
  });

  const { ItemSelector: VesselSelector } = useItemSelector({
    errorLabel: 'vessels',
    ...getItemSelectorProps('vesselCode'),
  });

  const { ItemSelector: LabelSelector } = useItemSelector({
    errorLabel: 'labels',
    ...getItemSelectorProps('label'),
  });

  const { ItemSelector: PluSelector } = useItemSelector({
    errorLabel: 'plu options',
    ...getItemSelectorProps('plu'),
  });

  const { palletsAvailable, palletsOnHand, palletsReceived } =
    reducePalletData(filteredItems);

  const validatePalletCount = itemListLabels.find(
    ({ key }) => key === 'palletCount',
  )?.validate;
  const isPalletCountValid = validatePalletCount
    ? validatePalletCount(updatedItem)
    : true;

  const { ItemSelector: PalletCountSelector } = useItemSelector({
    errorLabel: 'plus',
    ...commonSelectorProps,
    allItems: [
      { text: 'Available', id: '-1', disabled: true },
      {
        text: `Total: ${palletsAvailable.total}`,
        id: `${palletsAvailable.total}`,
        disabled: true,
      },
      {
        text: `Pre: ${palletsAvailable.pre}`,
        id: '-2',
        disabled: true,
      },
      {
        text: `Real: ${palletsAvailable.real}`,
        id: '-2',
        disabled: true,
      },
      { text: `On Hand: ${palletsOnHand.total}`, id: '-1', disabled: true },
      { text: `Received: ${palletsReceived.total}`, id: '-1', disabled: true },
    ],
    editableCellProps: {
      bypassLocalValue: true,
      content: {
        dirty: isValueDirty('palletCount'),
        value: updatedItem.palletCount === '' ? '' : updatedItem.palletCount,
      },
      defaultChildren: null,
      editing,
      error: editing && saveAttempt && (isDuplicate || !isPalletCountValid),
      inputProps: {
        type: 'number',
        min: 1,
        ml: th.spacing.sm,
        width: 50,
      },
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        handleChange('palletCount', e.target.value);
      },
      warning:
        noItemsFound ||
        palletsAvailable.total - (parseInt(updatedItem.palletCount, 10) || 0) <
          0,
    },
    getItemContent: (link: ItemLink) => {
      const updatedTotal =
        parseInt(link.id, 10) - parseInt(updatedItem.palletCount, 10) || 0;
      return (
        <l.Div ml={th.spacing.sm}>
          {link.id === '-1' ? (
            <ty.CaptionText secondary>{link.text}</ty.CaptionText>
          ) : link.id === '-2' ? (
            <ty.CaptionText ml={th.spacing.md}>{link.text}</ty.CaptionText>
          ) : (
            <l.Flex ml={th.spacing.md}>
              <ty.CaptionText>{link.text}</ty.CaptionText>
              <ty.CaptionText
                color={
                  updatedTotal >= 0
                    ? th.colors.status.success
                    : th.colors.status.error
                }
                ml={th.spacing.lg}
              >
                {updatedTotal}
              </ty.CaptionText>
            </l.Flex>
          )}
        </l.Div>
      );
    },
    nameKey: 'text' as keyof ItemLink,
    selectItem: ({ id }: ItemLink) => {
      handleChange('palletCount', id);
    },
  });

  const validateUnitSellPrice = itemListLabels.find(
    ({ key }) => key === 'unitSellPrice',
  )?.validate;
  const isUnitSellPriceValid = validateUnitSellPrice
    ? validateUnitSellPrice(updatedItem)
    : true;

  const validateDeliveryCharge = itemListLabels.find(
    ({ key }) => key === 'deliveryCharge',
  )?.validate;
  const isDeliveryChargeValid = validateDeliveryCharge
    ? validateDeliveryCharge(updatedItem)
    : true;

  const [showNotes, setShowNotes] = useState(!!updatedItem?.notes);

  const toggleNotes = () => setShowNotes(!!updatedItem?.notes || !showNotes);

  return (
    <>
      <l.Grid
        alignCenter
        gridColumnGap={th.spacing.xs}
        gridTemplateColumns={gridTemplateColumns}
        ml={52}
        relative
      >
        <>
          {showRemoveIcon && (
            <BasicModal
              title="Confirm Remove Product"
              content={
                <ty.BodyText mb={th.spacing.md}>
                  Are you sure you want to remove this product? This action
                  cannot be undone.
                </ty.BodyText>
              }
              handleConfirm={() => {
                handleRemoveItem(id);
              }}
              shouldConfirm={updatedItem.id >= 0}
              triggerProps={{
                position: 'absolute',
                left: -45,
              }}
              triggerType="remove-icon"
            />
          )}
          <l.HoverButton
            onClick={() => {
              handleNewItem(updatedItem);
            }}
            position="absolute"
            left={-22}
          >
            <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
          </l.HoverButton>
        </>
        <l.Flex alignCenter>
          <ty.CaptionText ml={th.spacing.xs} mr="6px">
            {updatedItem.lineId}
          </ty.CaptionText>
          <l.HoverButton
            active={showNotes}
            borderRadius={th.borderRadii.circle}
            height={th.sizes.xs}
            onClick={toggleNotes}
            width={th.sizes.xs}
          >
            <HighlightImg
              fill={th.colors.brand.primary}
              height={th.sizes.xs}
              width={th.sizes.xs}
            />
          </l.HoverButton>
        </l.Flex>
        {SpeciesSelector}
        {VarietySelector}
        {SizeSelector}
        {PackTypeSelector}
        {PluSelector}
        {LabelSelector}
        {ShipperSelector}
        {VesselSelector}
        {WarehouseSelector}
        {PalletCountSelector}
        <l.Flex alignCenter>
          <ty.CaptionText mr={th.spacing.xs}>$</ty.CaptionText>
          <EditableCell
            bypassLocalValue
            content={{
              dirty: isValueDirty('unitSellPrice'),
              value: updatedItem.unitSellPrice || '',
            }}
            defaultChildren={null}
            editing={editing}
            error={
              editing && saveAttempt && (isDuplicate || !isUnitSellPriceValid)
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange('unitSellPrice', e.target.value);
            }}
            warning={noItemsFound}
          />
        </l.Flex>
        <l.Flex alignCenter>
          <ty.CaptionText mr={th.spacing.xs}>$</ty.CaptionText>
          <EditableCell
            bypassLocalValue
            content={{
              dirty: isValueDirty('deliveryCharge'),
              value: updatedItem.deliveryCharge || '',
            }}
            defaultChildren={null}
            editing={editing}
            error={
              editing && saveAttempt && (isDuplicate || !isDeliveryChargeValid)
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange('deliveryCharge', e.target.value);
            }}
            warning={noItemsFound}
          />
        </l.Flex>
      </l.Grid>
      {showNotes && (
        <l.Flex alignCenter>
          <ty.BodyText ml={82} mr={th.spacing.md} secondary>
            ↳
          </ty.BodyText>
          <EditableCell
            bypassLocalValue
            content={{
              dirty: isValueDirty('notes'),
              value: updatedItem.notes || '',
            }}
            defaultChildren={null}
            editing={editing}
            inputProps={{
              autoFocus: true,
              borderColor: th.borders.disabled,
              width: 868,
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange('notes', e.target.value);
            }}
            warning={noItemsFound}
          />
        </l.Flex>
      )}
    </>
  );
};

export default NewOrderEntryItem;
