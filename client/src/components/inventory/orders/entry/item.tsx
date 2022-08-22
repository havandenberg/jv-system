import React from 'react';
import { sortBy } from 'ramda';

import { CommonSpecies, InventoryItem, OrderEntryItem, Shipper, Vessel, Warehouse } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

type Props = {
  inventoryItems: InventoryItem[];
  currentItem: OrderEntryItem;
  updatedItem: OrderEntryItem;
  commonSpecieses: CommonSpecies[];
  items: InventoryItem[];
  shippers: Shipper[];
  vessels: Vessel[];
  warehouses: Warehouse[];
  loading: boolean;
};

interface Option {
  text: string;
  value: string | number;
}

type FilterKey =
  | 'location'
  | 'shipper'
  | 'vessel'
  | 'label'
  | 'species'
  | 'variety'
  | 'size'
  | 'packType'
  | 'plu';

const NewOrderEntryItem = ({
  currentItem,
  inventoryItems,
  updatedItem,
}: Props) => {
  const editableCellProps = {
    bypassLocalValue: true,
    content: {
      dirty: isValueDirty('customer'),
      value: getSelectorValue('customer'),
    },
    defaultChildren: null,
    editing,
    error:
      isDuplicate ||
      !!(getSelectorValue('customer') && !getSelectorProduct('customer')),
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      handleChange('customerId', e.target.value);
    },
    warning: false,
  };

  const getFilter = (key: FilterKey, optionList: Option[]) => (
    <EditableCell {...editableCellProps} />
    <div key={key}>
      <ty.SmallText mb={th.spacing.xs} secondary>
        {capitalCase(key)}
      </ty.SmallText>
      <Select
        mr={th.spacing.md}
        onChange={(e) => {
          if (key === 'species') {
            setQuery({
              ...selectedFilters,
              [key]: e.target.value || undefined,
              variety: undefined,
              size: undefined,
              packType: undefined,
            });
          } else {
            setQuery({
              ...selectedFilters,
              [key]: e.target.value || undefined,
            });
          }
        }}
        value={selectedFilters[key] || ''}
        width={selectWidth}
      >
        {optionList.map(({ text, value }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </Select>
    </div>
  );

  const getOptions = (options: Option[]) => [
    { text: 'Any', value: '' },
    ...sortBy(
      (opt) => (opt.text === 'Other' ? 'zzzzzzz' : opt.text.toLowerCase()),
      options,
    ),
  ];

  const locationOptions = [] as Option[];
  const countryOptions = [] as Option[];
  const shipperOptions = [] as Option[];
  const labelOptions = [] as Option[];
  const speciesOptions = [] as Option[];
  const varietyOptions = [] as Option[];
  const sizeOptions = [] as Option[];
  const packTypeOptions = [] as Option[];
  const pluOptions = [] as Option[];

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
  });

  const [{ startDate = formatDate(new Date()) }] = useDateRangeQueryParams();
  const selectedWeekNumber = getWeekNumber(
    new Date(startDate.replace(/-/g, '/')),
  );
  const currentStartOfWeek = new Date(startDate.replace(/-/g, '/'));

  const {
    species,
    variety,
    size,
    label,
    packType,
    sizePackType,
    speciesTag,
    varietyTag,
    sizeTag,
    packTypeTag,
    plu,
    location,
    shipper,
    countryOfOrigin,
    detailsIndex,
  } = selectedFilters;

  const inventoryStartDateIndex = getInventoryStartDayIndex(startDate);
  const isStorage = parseInt(detailsIndex) === 13 - inventoryStartDateIndex;
  const isTotal = parseInt(detailsIndex) === 14 - inventoryStartDateIndex;

  const filteredItems = items.filter((orderMaster) => {
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
      countryName: 'Other',
      commonSpeciesTags: { nodes: [] },
      commonVarietyTags: { nodes: [] },
      commonSizeTags: { nodes: [] },
      commonPackTypeTags: { nodes: [] },
    };
    const orderItems = (orderMaster.items.nodes || []) as OrderItem[];

    const filteredOrderItems = orderItems.filter((orderItem) => {
      const item = orderItem.inventoryItem;

      if (!item) {
        return false;
      }

      const itemSpecies = item.product?.species || otherCategory;
      const itemVariety = item.product?.variety || otherCategory;
      const itemSize = item.product?.sizes?.nodes[0] || otherCategory;
      const itemPackType = item.product?.packType || otherCategory;

      const commonSpecies = commonSpecieses.find(
        (cs) => cs && cs.productSpeciesId === itemSpecies?.id,
      );
      const commonSpeciesTags = (commonSpecies?.commonSpeciesTags?.nodes ||
        []) as CommonProductTag[];
      const commonVarietyTags = (commonSpecies?.commonVarieties?.nodes.find(
        (cv) => cv && cv.productVarietyId === itemVariety?.id,
      )?.commonVarietyTags?.nodes || []) as CommonProductTag[];
      const commonSizeTags = (commonSpecies?.commonSizes?.nodes.find(
        (cs) => cs && cs.productSizeId === itemSize?.id,
      )?.commonSizeTags?.nodes || []) as CommonProductTag[];
      const commonPackTypeTags = (commonSpecies?.commonPackTypes?.nodes.find(
        (cpt) => cpt && cpt.packMasterId === itemPackType?.id,
      )?.commonPackTypeTags?.nodes || []) as CommonProductTag[];

      const detailsValid =
        !detailsIndex ||
        (isStorage
          ? item.vessel &&
            isBefore(
              new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
              currentStartOfWeek,
            )
          : isTotal
          ? true
          : isWithinDateInterval(
              item,
              parseInt(detailsIndex, 10),
              currentStartOfWeek,
            ));

      if (
        !locationOptions.find(({ value }) => value === item.warehouse?.id) &&
        detailsValid &&
        item.warehouse
      ) {
        locationOptions.push({
          text: `${item.warehouse.warehouseName} (${item.warehouse.id})`,
          shortText: item.warehouse.warehouseName,
          value: item.warehouse.id,
        });
      }

      if (
        !countryOptions.find(({ value }) => value === item.country?.id) &&
        detailsValid &&
        item.country
      ) {
        countryOptions.push({
          text: `${item.country.countryName} (${item.country.id})`,
          shortText: item.country.countryName,
          value: item.country.id,
        });
      }

      if (
        (!selectedFilters.countryOfOrigin ||
          item.country?.id === selectedFilters.countryOfOrigin) &&
        !shipperOptions.find(({ value }) => value === item.shipper?.id) &&
        detailsValid &&
        item.shipper
      ) {
        shipperOptions.push({
          text: `${item.shipper.shipperName} (${item.shipper.id})`,
          shortText: item.shipper.shipperName,
          value: item.shipper.id,
        });
      }

      if (
        (!selectedFilters.species ||
          itemSpecies?.id === selectedFilters.species) &&
        !labelOptions.find(
          ({ value }) => value === itemPackType?.label?.labelCode,
        ) &&
        detailsValid &&
        itemPackType?.label
      ) {
        labelOptions.push({
          text: `${itemPackType.label.labelName}`,
          shortText: `${itemPackType.label.labelName}`,
          value: `${itemPackType.label.labelCode}`,
        });
      }

      if (
        (!selectedFilters.species ||
          itemSpecies?.id === selectedFilters.species) &&
        !pluOptions.find(({ value }) => value === `${item.plu}`) &&
        detailsValid
      ) {
        pluOptions.push({
          text: `${item.plu}`,
          shortText: `${item.plu}`,
          value: `${item.plu}`,
        });
      }

      if (
        !speciesOptions.find(({ value }) => value === itemSpecies?.id) &&
        detailsValid &&
        itemSpecies
      ) {
        speciesOptions.push({
          text: `${itemSpecies.speciesDescription} (${itemSpecies.id})`,
          shortText: `${itemSpecies.speciesDescription}`,
          value: itemSpecies.id,
        });
      }

      if (
        itemSpecies.id === selectedFilters.species &&
        !varietyOptions.find(({ value }) => value === itemVariety?.id) &&
        detailsValid &&
        itemVariety
      ) {
        varietyOptions.push({
          text: `${itemVariety.varietyDescription}`,
          shortText: `${itemVariety.varietyDescription}`,
          value: itemVariety.id,
        });
      }

      if (
        itemSpecies.id === selectedFilters.species &&
        !sizeOptions.find(({ value }) => value === itemSize?.id) &&
        detailsValid &&
        itemSize
      ) {
        sizeOptions.push({
          text: `${itemSize.combineDescription}`,
          shortText: `${itemSize.combineDescription}`,
          value: itemSize.id,
        });
      }

      if (
        itemSpecies.id === selectedFilters.species &&
        !packTypeOptions.find(
          ({ value }) => value === itemPackType?.packDescription,
        ) &&
        detailsValid &&
        itemPackType
      ) {
        packTypeOptions.push({
          text: `${itemPackType.packDescription}`,
          shortText: `${itemPackType.packDescription}`,
          value: `${itemPackType?.packDescription}`,
        });
      }

      return (
        selectedFilters.coast === item.coast &&
        (!location || location === item.warehouse?.id) &&
        (!shipper || shipper === item.shipper?.id) &&
        (!countryOfOrigin || countryOfOrigin === item.country?.id) &&
        (species
          ? speciesTag
            ? pluck('tagText', commonSpeciesTags).includes(speciesTag)
            : ['total', itemSpecies?.id].includes(species)
          : !speciesTag ||
            pluck('tagText', commonSpeciesTags).includes(speciesTag)) &&
        (variety
          ? varietyTag
            ? pluck('tagText', commonVarietyTags).includes(varietyTag)
            : ['total', itemVariety?.id].includes(variety)
          : !varietyTag ||
            pluck('tagText', commonVarietyTags).includes(varietyTag)) &&
        (size
          ? sizeTag
            ? pluck('tagText', commonSizeTags).includes(sizeTag)
            : ['total', itemSize?.combineDescription].includes(size)
          : !sizeTag || pluck('tagText', commonSizeTags).includes(sizeTag)) &&
        (!label || ['total', itemPackType?.label?.labelCode].includes(label)) &&
        (packType
          ? packTypeTag
            ? commonPackTypeTags.includes(packTypeTag)
            : ['total', itemPackType?.packDescription].includes(packType)
          : !packTypeTag || commonPackTypeTags.includes(packTypeTag)) &&
        (!sizePackType ||
          [
            'total',
            `${itemSize?.id} - ${itemPackType?.packDescription}`,
          ].includes(sizePackType)) &&
        (!plu || ['total', item.plu ? 'true' : 'false'].includes(plu)) &&
        detailsValid
      );
    });

    return filteredOrderItems.some((val) => val);
  });

  const detailsDateRange = `${format(
    getDateInterval(detailsIndex, currentStartOfWeek).start,
    'M/dd',
  )} - ${format(
    add(getDateInterval(detailsIndex, currentStartOfWeek).end, {
      days: -1,
    }),
    'M/dd',
  )} (Week ${getWeekNumber(
    getDateInterval(detailsIndex, currentStartOfWeek).start,
  )})`;

  const detailsDateText = isStorage
    ? `Storage - older than ${format(currentStartOfWeek, 'M/dd')}`
    : isTotal
    ? 'All Dates'
    : detailsDateRange;

  const filterOptions = {
    location: locationOptions,
    countryOfOrigin: countryOptions,
    shipper: shipperOptions,
    species: speciesOptions,
    variety: varietyOptions,
    size: sizeOptions,
    packType: packTypeOptions,
    label: labelOptions,
    plu: pluOptions,
  };

  const locationSelect = getFilter('location', getOptions(locationOptions));
  const countrySelect = getFilter(
    'countryOfOrigin',
    getOptions(countryOptions),
    150,
  );
  const shipperSelect = getFilter('shipper', getOptions(shipperOptions));
  const labelSelect = getFilter('label', getOptions(labelOptions), 120);
  const pluSelect = getFilter('plu', getOptions(pluOptions), 90);
  const speciesSelect = getFilter('species', getOptions(speciesOptions));
  const varietySelect = getFilter('variety', getOptions(varietyOptions));
  const sizeSelect = getFilter('size', getOptions(sizeOptions));
  const packTypeSelect = getFilter('packType', getOptions(packTypeOptions));

  return (
    <l.Grid
      alignCenter
      key={program.id}
      gridColumnGap={th.spacing.xs}
      gridTemplateColumns={`repeat(2, 1fr) repeat(3, 0.7fr)${
        isCustomers ? '' : ' 1fr'
      }`}
      ml={52}
      relative
    >
      {editing && (
        <>
          <BasicModal
            title="Confirm Remove Product"
            content={
              <ty.BodyText mb={th.spacing.md}>
                Are you sure you want to remove this product? This action cannot
                be undone.
              </ty.BodyText>
            }
            handleConfirm={() => {
              handleRemoveItem(
                isCustomers ? 'customerPrograms' : 'shipperPrograms',
                id,
              );
            }}
            shouldConfirm={program.id >= 0}
            triggerProps={{
              position: 'absolute',
              left: -45,
            }}
            triggerType="remove-icon"
          />
          <l.HoverButton
            onClick={() => {
              handleNewProgram(updatedProgram);
            }}
            position="absolute"
            left={-22}
          >
            <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
          </l.HoverButton>
        </>
      )}
      {!editing && (
        <l.Div
          cursor="pointer"
          position="absolute"
          left={-32}
          top={th.spacing.xs}
        >
          <ProgramNotes
            allocatedStartDate={allocatedStartDate}
            allocatedEndDate={allocatedEndDate}
            isCustomers={isCustomers}
            program={program}
            weekCount={weekCount}
          />
        </l.Div>
      )}
      {editing ? (
        SpeciesSelector
      ) : showSpecies ? (
        <Cell
          {...pick(
            ['error', 'warning'],
            speciesLinkSelectorProps.editableCellProps,
          )}
          warning={!!commonSpeciesIdQuery}
          onClick={
            commonSpeciesId
              ? () => {
                  setProgramsQueryParams({ commonSpeciesId });
                }
              : undefined
          }
          width={95}
        >
          <ty.CaptionText
            bold
            ellipsis
            title={program.commonSpecies?.speciesName}
          >
            {program.commonSpecies?.speciesName}
          </ty.CaptionText>
        </Cell>
      ) : (
        <div />
      )}
      {commonSpecies && (
        <>
          {editing ? (
            VarietySelector
          ) : showVariety ? (
            <Cell
              {...pick(
                ['error', 'warning'],
                varietyLinkSelectorProps.editableCellProps,
              )}
              warning={!!commonVarietyIdQuery}
              onClick={
                commonSpeciesId && commonVarietyId
                  ? () => {
                      setProgramsQueryParams({
                        commonSpeciesId,
                        commonVarietyId,
                      });
                    }
                  : undefined
              }
              width={95}
            >
              <ty.CaptionText
                ellipsis
                title={program.commonVariety?.varietyName}
              >
                {program.commonVariety?.varietyName}
              </ty.CaptionText>
            </Cell>
          ) : (
            <div />
          )}
          {editing ? (
            SizeSelector
          ) : (
            <Cell
              {...pick(
                ['error', 'warning'],
                sizeLinkSelectorProps.editableCellProps,
              )}
              warning={!!commonSizeIdQuery}
              onClick={
                commonSpecies && commonSizeId
                  ? () => {
                      setProgramsQueryParams({
                        commonSpeciesId,
                        commonSizeId,
                      });
                    }
                  : undefined
              }
              width={64}
            >
              <ty.CaptionText ellipsis title={program.commonSize?.sizeName}>
                {program.commonSize?.sizeName}
              </ty.CaptionText>
            </Cell>
          )}
          {editing ? (
            PackTypeSelector
          ) : (
            <Cell
              {...pick(
                ['error', 'warning'],
                packTypeLinkSelectorProps.editableCellProps,
              )}
              warning={!!commonPackTypeIdQuery}
              onClick={
                commonSpeciesId && commonPackTypeId
                  ? () => {
                      setProgramsQueryParams({
                        commonSpeciesId,
                        commonPackTypeId,
                      });
                    }
                  : undefined
              }
              width={64}
            >
              <ty.CaptionText
                ellipsis
                title={program.commonPackType?.packTypeName}
              >
                {program.commonPackType?.packTypeName}
              </ty.CaptionText>
            </Cell>
          )}
          <EditableCell
            content={{ dirty: plu !== program.plu, value: plu || '' }}
            defaultChildren={
              <Cell
                warning={!!pluQuery}
                onClick={
                  commonSpeciesId && plu
                    ? () => {
                        setProgramsQueryParams({
                          commonSpeciesId,
                          plu,
                        });
                      }
                    : undefined
                }
                width={64}
              >
                <ty.CaptionText>{plu}</ty.CaptionText>
              </Cell>
            }
            editing={!!editing}
            error={isDuplicate}
            onChange={(e) => {
              handleChange('plu', e.target.value);
            }}
            showBorder={false}
          />
          {isCustomers ? null : editing ? (
            CustomerSelector
          ) : (
            <Cell
              {...pick(
                ['error', 'warning'],
                customerLinkSelectorProps.editableCellProps,
              )}
              warning={!!customerIdQuery}
              onClick={
                customerId
                  ? () => {
                      setProgramsQueryParams({
                        customerIdFilter: customerId,
                      });
                    }
                  : undefined
              }
              width={95}
            >
              <ty.CaptionText
                ellipsis
                title={
                  program.customer
                    ? `${program.customer?.id} - ${program.customer?.customerName}`
                    : ''
                }
              >
                {program.customer ? program.customer?.customerName : ''}
              </ty.CaptionText>
            </Cell>
          )}
        </>
      )}
    </l.Grid>
  );
};

export default NewOrderEntryItem;
