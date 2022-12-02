import React, { ChangeEvent, useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';
import { differenceInDays, format } from 'date-fns';
import { equals, sortBy } from 'ramda';

import HighlightImg from 'assets/images/highlight';
import PlusInCircle from 'assets/images/plus-in-circle';
import ResetItem from 'assets/images/reset-item';
import EditableCell from 'components/editable-cell';
import { reducePalletData } from 'components/inventory/inventory/utils';
import useItemSelector from 'components/item-selector';
import ItemLinkRow, { ItemLink } from 'components/item-selector/link';
import { BasicModal } from 'components/modal';
import usePrevious from 'hooks/use-previous';
import {
  CommonPackType,
  CommonSize,
  CommonSpecies,
  InventoryItem,
  OrderEntryItem,
  Shipper,
  TruckRate,
  Vessel,
  Warehouse,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { isDateLessThanOrEqualTo } from 'utils/date';

import { gridTemplateColumns } from '.';
import {
  getOrderEntryItemEstimatedFreight,
  itemListLabels,
} from './data-utils';

type Props = {
  coast: string;
  commonSpecieses: CommonSpecies[];
  currentItem: OrderEntryItem;
  defaultTruckRate?: TruckRate;
  duplicateIds: number[];
  editing: boolean;
  error?: ApolloError;
  fob: boolean;
  fobDate?: string;
  handleAutoFill: () => void;
  handleChange: (updatedItem: OrderEntryItem) => void;
  handleNewItem: (updatedItem: OrderEntryItem) => void;
  handleRemoveItem: (id: number) => void;
  handleResetItem: () => void;
  inventoryItems: InventoryItem[];
  isReview: boolean;
  loading: boolean;
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
  | 'countryOfOrigin'
  | 'unitSellPrice'
  | 'deliveryCharge'
  | 'notes';

const NewOrderEntryItem = ({
  coast,
  commonSpecieses,
  currentItem,
  defaultTruckRate,
  duplicateIds,
  editing,
  error,
  fob,
  fobDate,
  handleAutoFill,
  handleChange,
  handleNewItem,
  handleResetItem,
  handleRemoveItem,
  inventoryItems,
  isReview,
  loading,
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
    countryOfOrigin,
    palletCount,
    unitSellPrice,
    deliveryCharge,
  } = updatedItem;
  const previousUpdatedItem = usePrevious(updatedItem);

  const isDuplicate = duplicateIds.includes(parseInt(id, 10));

  const commonSpecies = commonSpecieses.find(
    (sp) => sp && sp.productSpeciesId === species,
  );
  const commonVariety = commonSpecies?.commonVarieties.nodes.find(
    (v) => v && v.productVarietyId === variety,
  );
  const commonSizes = commonSpecies?.commonSizes.nodes.filter(
    (sz) => sz && size?.split(',').includes(sz.productSizeId),
  );
  const commonPackType = commonSpecies?.commonPackTypes.nodes.find(
    (pt) => pt && [pt.id, pt.packMaster?.packDescription].includes(packType),
  );
  const shipper = shippers.find((s) => s && s.id === shipperId);
  const vessel = vessels.find((v) => v && v.vesselCode === vesselCode);
  const warehouse = warehouses.find((w) => w && w.id === locationId);

  const repackPackTypes = (
    (commonSpecies?.commonPackTypes.nodes || []) as CommonPackType[]
  ).filter((pt) => !!pt?.isRepack);
  const repackPackType = repackPackTypes.find((pt) => pt && pt.id === packType);

  const getSelectorValue = (type: FilterKey) => {
    switch (type) {
      case 'species':
        return commonSpecies?.speciesName || species || '';
      case 'variety':
        return commonVariety?.varietyName || variety || '';
      case 'size':
        return (
          ((commonSizes || []) as CommonSize[])
            .map((s) => s.sizeName)
            .join(', ') ||
          size ||
          ''
        );
      case 'packType':
        return commonPackType
          ? commonPackType.isRepack
            ? `Rp - ${commonPackType.packTypeName}`
            : commonPackType.packTypeName || ''
          : packType || '';
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
      case 'countryOfOrigin':
        return countryOfOrigin || '';
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
      case 'countryOfOrigin':
        return countryOfOrigin !== currentItem.countryOfOrigin;
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
  const packTypeOptions = repackPackTypes.map((pt) => ({
    color: th.colors.brand.primaryAccent,
    id: pt?.id || pt?.packMasterId,
    text: `Repack - ${pt?.packTypeName}`,
  })) as ItemLink[];
  const pluOptions = [] as ItemLink[];
  const countryOptions = [] as ItemLink[];
  let vesselOptions = [] as ItemLink[];

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

    const coastValid = item.vessel && item.vessel.coast === coast;

    const dateValid =
      !fobDate ||
      (item.vessel &&
        isDateLessThanOrEqualTo(
          new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
          new Date(fobDate.replace(/-/g, '/')),
        ));

    const isValid =
      coastValid &&
      dateValid &&
      (!warehouse ||
        `${item.warehouse?.warehouseName}`
          .toLowerCase()
          .includes(`${locationId}`.toLowerCase()) ||
        ['Any', item.warehouse?.id].includes(locationId || undefined)) &&
      (!shipper ||
        `${item.shipper?.shipperName}`
          .toLowerCase()
          .includes(`${shipperId}`.toLowerCase()) ||
        ['Any', item.shipper?.id].includes(shipperId || undefined)) &&
      (!species ||
        `${itemSpecies?.speciesDescription}`
          .toLowerCase()
          .includes(species.toLowerCase()) ||
        [itemSpecies?.id].includes(species)) &&
      (!variety ||
        `${itemVariety?.varietyDescription}`
          .toLowerCase()
          .includes(variety.toLowerCase()) ||
        ['Any', itemVariety?.id].includes(variety)) &&
      (!size ||
        `${itemSize?.combineDescription}`
          .toLowerCase()
          .includes(size.toLowerCase()) ||
        ['Any', itemSize?.id].some((val) =>
          (size || '').split(',').includes(val),
        )) &&
      (!packType ||
        packType.includes('Repack -') ||
        `${itemPackType?.packDescription}`
          .toLowerCase()
          .includes(packType.toLowerCase()) ||
        ['Any', itemPackType?.packDescription].includes(packType)) &&
      (!vesselCode ||
        `${item?.vessel?.vesselCode}`
          .toLowerCase()
          .includes(vesselCode.toLowerCase()) ||
        ['Any', item?.vessel?.vesselCode].includes(vesselCode)) &&
      (!label ||
        `${itemPackType?.label?.labelCode}`
          .toLowerCase()
          .includes(label.toLowerCase()) ||
        ['Any', itemPackType?.label?.labelCode].includes(label)) &&
      (!plu ||
        (item.plu ? 'PLU' : 'No PLU').includes(plu) ||
        ['Any', item.plu ? 'PLU' : 'No PLU'].includes(plu)) &&
      (!countryOfOrigin ||
        `${item.country?.id}`
          .toLowerCase()
          .includes(countryOfOrigin.toLowerCase()) ||
        ['Any', item.country?.id].includes(countryOfOrigin));

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

      if (item.vessel) {
        const currentVesselOptions = vesselOptions.filter(
          ({ id }) => id === item.vessel?.vesselCode,
        );
        const currentPalletsAvailable = currentVesselOptions.reduce(
          (acc, { text }) => {
            const textArray = text.split('|');
            const palletsAvailableText = textArray[4];
            const palletsAvailable = parseInt(palletsAvailableText, 10);
            return acc + palletsAvailable;
          },
          0,
        );
        const dischargeDate = new Date(
          item.vessel.dischargeDate.replace(/-/g, '/'),
        );
        const dayCount = differenceInDays(
          dischargeDate,
          fobDate ? new Date(fobDate.replace(/-/g, '/')) : new Date(),
        );
        vesselOptions = vesselOptions
          .filter((option) => option.id !== item.vessel?.vesselCode)
          .concat({
            text: `${item.vessel.vesselName}|${item.vessel.vesselCode}|${format(
              dischargeDate,
              'MMM dd',
            )}|${dayCount >= 0 ? '+' : ''}${dayCount}d|${
              parseInt(item.palletsAvailable, 10) + currentPalletsAvailable
            }`,
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

      if (!countryOptions.find(({ id }) => id === item.country?.id)) {
        if (item.country) {
          countryOptions.push({
            text: item.country.id,
            id: item.country.id,
          });
        }
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

    if (
      species &&
      (`${itemSpecies?.speciesDescription}`
        .toLowerCase()
        .includes(species.toLowerCase()) ||
        [itemSpecies?.id].includes(species)) &&
      !sizeOptions.find(({ id }) => id === itemSize?.id) &&
      itemSize
    ) {
      sizeOptions.push({
        text: `${itemSize.combineDescription}`,
        id: itemSize.id,
      });
    }

    return isValid;
  });

  const noItemsFound = !loading && filteredItems.length === 0;

  const getOptions = (options: ItemLink[], allowAny: boolean = true) => [
    ...(allowAny ? [{ text: 'Any', id: 'Any' }] : []),
    ...sortBy(
      (opt) =>
        opt.text === 'Other'
          ? 'zzzzzzz'
          : opt.text.includes('Repack -')
          ? `0-${opt.text.toLowerCase()}`
          : opt.text.toLowerCase(),
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
    countryOfOrigin: countryOptions,
    reviewLocationId: locationOptions,
    reviewVesselCode: vesselOptions,
    reviewShipperId: shipperOptions,
    reviewSpecies: speciesOptions,
    reviewVariety: varietyOptions,
    reviewSize: sizeOptions,
    reviewPackType: packTypeOptions,
    reviewLabel: labelOptions,
    reviewPlu: pluOptions,
    reviewCountryOfOrigin: countryOptions,
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
          <ty.CaptionText secondary={isLabels}>{dateText}</ty.CaptionText>
        ) : null}
        {dateText && !isAny ? (
          <ty.CaptionText
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

  const getItemSelectorProps = (
    type: FilterKey,
    allowAny?: boolean,
    isMultiSelect?: boolean,
  ) => {
    const value = getSelectorValue(type);
    const values = isMultiSelect ? value.split(',') : [];
    const isDirty = isValueDirty(type);

    const getItemContent = ['vesselCode', 'reviewVesselCode'].includes(type)
      ? getVesselItemContent
      : (link: ItemLink) => (
          <ItemLinkRow active={link.id === updatedItem[type]} link={link} />
        );

    const selectItem = ({ id }: ItemLink) => {
      const newValues = isMultiSelect
        ? id === 'Any'
          ? [id]
          : values.includes(id)
          ? values.filter((val) => val !== id)
          : [...values.filter((v) => v !== 'Any'), id]
        : [id];
      const newValue = isMultiSelect
        ? newValues.filter((v) => !!v).join(',')
        : newValues[0];
      handleChange({ ...updatedItem, [type]: id === '-1' ? null : newValue });
    };

    const validate = itemListLabels(fob).find(
      ({ key }) => key === type,
    )?.validate;
    const isValid = validate ? validate(updatedItem) : true;

    const allItems = getOptions(filterOptions[type], allowAny);

    return {
      ...commonSelectorProps,
      allItems: () =>
        ['vesselCode', 'reviewVesselCode'].includes(type)
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
          handleChange({ ...updatedItem, [type]: e.target.value });
        },
        warning: !loading && noItemsFound,
      },
      getItemContent,
      isMultiSelect,
      nameKey: 'text' as keyof ItemLink,
      offset: ['vesselCode', 'reviewVesselCode'].includes(type)
        ? -150
        : undefined,
      selectItem,
      selectedItem: updatedItem[type],
      width: ['vesselCode', 'reviewVesselCode'].includes(type)
        ? 400
        : ['locationId', 'reviewLocationId'].includes(type)
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
    ...getItemSelectorProps('size', true, true),
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
    ...getItemSelectorProps('locationId', !fob),
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

  const { ItemSelector: CountrySelector } = useItemSelector({
    errorLabel: 'country options',
    ...getItemSelectorProps('countryOfOrigin'),
  });

  const { palletsAvailable, palletsOnHand, palletsReceived } =
    reducePalletData(filteredItems);

  const validatePalletCount = itemListLabels(fob).find(
    ({ key }) => key === 'palletCount',
  )?.validate;
  const isPalletCountValid = validatePalletCount
    ? validatePalletCount(updatedItem)
    : true;

  const { ItemSelector: PalletCountSelector } = useItemSelector({
    errorLabel: 'plus',
    ...commonSelectorProps,
    allItems: () => [
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
        width: 60,
      },
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        handleChange({ ...updatedItem, palletCount: e.target.value });
      },
      warning:
        !loading &&
        (noItemsFound ||
          palletsAvailable.total -
            (parseInt(updatedItem.palletCount, 10) || 0) <
            0),
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
      handleChange({ ...updatedItem, palletCount: id });
    },
  });

  const validateUnitSellPrice = itemListLabels(fob).find(
    ({ key }) => key === 'unitSellPrice',
  )?.validate;
  const isUnitSellPriceValid = validateUnitSellPrice
    ? validateUnitSellPrice(updatedItem)
    : true;

  const [shouldEstimateDeliveryCharge, setShouldEstimateDeliveryCharge] =
    useState(deliveryCharge ? false : true);
  const validateDeliveryCharge = itemListLabels(fob).find(
    ({ key }) => key === 'deliveryCharge',
  )?.validate;
  const isDeliveryChargeValid = validateDeliveryCharge
    ? validateDeliveryCharge(updatedItem)
    : true;

  const [showNotes, setShowNotes] = useState(isReview || !!updatedItem?.notes);

  const toggleNotes = () => setShowNotes(!!updatedItem?.notes || !showNotes);

  const getItemDefaultPalletQuantity = (it?: InventoryItem) =>
    it &&
    (it.product?.packType?.defaultPalletQuantity ||
      it?.product?.packType?.commonPackType?.boxCount);

  const boxCountItem = (filteredItems || []).find((it) =>
    getItemDefaultPalletQuantity(it),
  );
  const boxCount =
    getItemDefaultPalletQuantity(boxCountItem) || repackPackType?.boxCount || 1;

  const updatedDeliveryCharge =
    shouldEstimateDeliveryCharge &&
    previousUpdatedItem &&
    previousUpdatedItem.deliveryCharge === updatedItem.deliveryCharge
      ? getOrderEntryItemEstimatedFreight(
          updatedItem,
          defaultTruckRate,
          boxCount,
        )
      : updatedItem.deliveryCharge;

  const palletWeight =
    commonPackType?.palletWeight || commonSpecies?.palletWeight || 0;

  useEffect(() => {
    if (!equals(previousUpdatedItem, updatedItem)) {
      handleChange({
        ...updatedItem,
        deliveryCharge: updatedDeliveryCharge,
        boxCount,
        palletWeight,
      });
    }
  }, [
    boxCount,
    handleChange,
    palletWeight,
    previousUpdatedItem,
    updatedDeliveryCharge,
    updatedItem,
  ]);

  useEffect(() => {
    if (
      updatedItem &&
      commonSpecies &&
      inventoryItems.length > 0 &&
      (updatedItem.boxCount === undefined ||
        updatedItem.palletWeight === undefined)
    ) {
      handleChange({
        ...updatedItem,
        boxCount,
        palletWeight,
      });
    }
  }, [
    boxCount,
    commonSpecies,
    handleChange,
    inventoryItems.length,
    palletWeight,
    updatedItem,
  ]);

  return (
    <>
      <l.Grid
        alignCenter
        gridColumnGap={th.spacing.xs}
        gridTemplateColumns={gridTemplateColumns(fob)}
        ml={52}
        relative
      >
        {!isReview && (
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
        )}
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
        {isReview ? (
          <>
            <ty.CaptionText ellipsis>
              {commonSpecies ? commonSpecies.speciesName : updatedItem.species}
            </ty.CaptionText>
            <ty.CaptionText ellipsis secondary={updatedItem.variety === 'Any'}>
              {commonVariety ? commonVariety.varietyName : updatedItem.variety}
            </ty.CaptionText>
            <ty.CaptionText ellipsis secondary={updatedItem.size === 'Any'}>
              {commonSizes
                ? ((commonSizes || []) as CommonSize[])
                    .map((s) => s.sizeName)
                    .join(', ')
                : updatedItem.size}
            </ty.CaptionText>
            <ty.CaptionText ellipsis secondary={updatedItem.packType === 'Any'}>
              {commonPackType
                ? commonPackType.isRepack
                  ? `Rp - ${commonPackType.packTypeName}`
                  : commonPackType.packTypeName || ''
                : updatedItem.packType}
            </ty.CaptionText>
            <ty.CaptionText ellipsis secondary={updatedItem.plu === 'Any'}>
              {updatedItem.plu}
            </ty.CaptionText>
            <ty.CaptionText
              ellipsis
              secondary={updatedItem.countryOfOrigin === 'Any'}
            >
              {updatedItem.countryOfOrigin}
            </ty.CaptionText>
            <ty.CaptionText ellipsis secondary={updatedItem.label === 'Any'}>
              {updatedItem.label}
            </ty.CaptionText>
            {updatedItem.warehouse ? (
              <ty.LinkText
                ellipsis
                hover="false"
                to={`/directory/warehouses/${updatedItem.locationId}`}
              >
                {updatedItem.warehouse.warehouseName}
              </ty.LinkText>
            ) : (
              <ty.CaptionText
                ellipsis
                secondary={updatedItem.locationId === 'Any'}
              >
                {updatedItem.locationId}
              </ty.CaptionText>
            )}
            {updatedItem.shipper ? (
              <ty.LinkText
                ellipsis
                hover="false"
                to={`/directory/shippers/${updatedItem.shipperId}`}
              >
                {updatedItem.shipper.shipperName}
              </ty.LinkText>
            ) : (
              <ty.CaptionText
                ellipsis
                secondary={updatedItem.shipperId === 'Any'}
              >
                {updatedItem.shipperId}
              </ty.CaptionText>
            )}
            {updatedItem.vessel ? (
              <ty.LinkText
                ellipsis
                hover="false"
                to={`/inventory/vessels/${updatedItem.vessel.vesselCode}`}
              >
                {updatedItem.vessel.vesselCode}
              </ty.LinkText>
            ) : (
              <ty.CaptionText
                ellipsis
                secondary={updatedItem.vesselCode === 'Any'}
              >
                {updatedItem.vesselCode}
              </ty.CaptionText>
            )}
          </>
        ) : (
          <>
            {SpeciesSelector}
            {VarietySelector}
            {SizeSelector}
            {PackTypeSelector}
            {PluSelector}
            {CountrySelector}
            {LabelSelector}
            {WarehouseSelector}
            {ShipperSelector}
            {VesselSelector}
          </>
        )}
        {isReview ? (
          <ty.CaptionText ml={th.spacing.xs} mr="6px">
            {updatedItem.palletCount}
          </ty.CaptionText>
        ) : (
          PalletCountSelector
        )}
        {isReview ? (
          <ty.CaptionText ml={th.spacing.xs} mr="6px">
            $ {updatedItem.unitSellPrice}
          </ty.CaptionText>
        ) : (
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
                handleChange({
                  ...updatedItem,
                  unitSellPrice: parseFloat(e.target.value),
                });
              }}
              warning={noItemsFound}
            />
          </l.Flex>
        )}
        {!fob &&
          (isReview ? (
            <ty.CaptionText ml={th.spacing.xs} mr="6px">
              $ {updatedItem.deliveryCharge}
            </ty.CaptionText>
          ) : (
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
                  editing &&
                  saveAttempt &&
                  (isDuplicate || !isDeliveryChargeValid)
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setShouldEstimateDeliveryCharge(e.target.value === '');
                  handleChange({
                    ...updatedItem,
                    deliveryCharge: e.target.value,
                  });
                }}
                warning={noItemsFound}
              />
            </l.Flex>
          ))}
        <l.HoverButton
          disabled={!isReview && !species}
          onClick={
            isReview ? handleResetItem : species ? handleAutoFill : undefined
          }
        >
          <ResetItem height={th.sizes.xs} width={th.sizes.xs} />
        </l.HoverButton>
      </l.Grid>
      {isReview && (
        <l.Grid
          alignCenter
          gridColumnGap={th.spacing.xs}
          gridTemplateColumns={gridTemplateColumns(fob)}
          ml={52}
          mt={th.spacing.xs}
          relative
        >
          <div />
          {SpeciesSelector}
          {VarietySelector}
          {SizeSelector}
          {PackTypeSelector}
          {PluSelector}
          {CountrySelector}
          {LabelSelector}
          {WarehouseSelector}
          {ShipperSelector}
          {VesselSelector}
          <ty.CaptionText color={th.colors.status.success} ml={th.spacing.xs}>
            Avail: {palletsAvailable.total - palletCount}
          </ty.CaptionText>
          <div />
        </l.Grid>
      )}
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
              autoFocus: !isReview,
              borderColor: th.borders.disabled,
              width: 868,
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange({ ...updatedItem, notes: e.target.value });
            }}
            warning={noItemsFound}
          />
        </l.Flex>
      )}
    </>
  );
};

export default NewOrderEntryItem;
