import React, { useState } from 'react';
import { pick } from 'ramda';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import HighlightImg from 'assets/images/highlight';
import InfoPanel from 'components/info-panel';
import { CustomerProgram, ShipperProgram } from 'types';
import b from 'ui/button';
import { TextArea } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';

type Props<T extends CustomerProgram | ShipperProgram> = {
  allocatedStartDate: Date;
  allocatedEndDate: Date;
  isCustomers: boolean;
  program: T;
  weekCount: number;
};

const ProgramNotes = <T extends CustomerProgram | ShipperProgram>({
  allocatedStartDate,
  allocatedEndDate,
  isCustomers,
  program,
  weekCount,
}: Props<T>) => {
  const [show, setShow] = useState(false);

  const [programState, setProgramState] = useState(program as T);
  const isDirty = programState.notes !== program.notes;

  const [handleUpsertShipperPrograms, { loading: shipperProgramsLoading }] =
    api.useUpsertShipperPrograms(
      weekCount,
      allocatedStartDate,
      allocatedEndDate,
      true,
    );
  const [handleUpsertCustomerPrograms, { loading: customerProgramsLoading }] =
    api.useUpsertCustomerPrograms(
      weekCount,
      allocatedStartDate,
      allocatedEndDate,
      true,
    );
  const updateLoading = shipperProgramsLoading || customerProgramsLoading;

  const programUpsertVariables = program
    ? {
        [isCustomers ? 'customerPrograms' : 'shipperPrograms']: [
          {
            ...pick(
              [
                'id',
                'arrivalPort',
                'commonSpeciesId',
                'commonVarietyId',
                'commonSizeId',
                'commonPackTypeId',
                'plu',
                'notes',
                'palletCount',
              ],
              programState,
            ),
            customerId: isCustomers
              ? (programState as CustomerProgram).customer?.id
              : undefined,
            shipperId: isCustomers
              ? (programState as ShipperProgram).shipper?.id
              : undefined,
          },
        ],
      }
    : {};

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProgramState({ ...programState, notes: e.target.value });
  };

  const handleReset = () => {
    setProgramState(program);
  };

  const handleSave = () => {
    if (program) {
      if (isCustomers) {
        handleUpsertCustomerPrograms({
          variables: programUpsertVariables,
        });
      } else {
        handleUpsertShipperPrograms({
          variables: programUpsertVariables,
        });
      }
    }
  };

  return (
    <InfoPanel
      content={
        <l.Div p={th.spacing.xs}>
          <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
            <ty.SmallText mr={th.spacing.xs} secondary>
              Notes:
            </ty.SmallText>
            <l.Flex alignCenter ml={th.spacing.lg}>
              {isDirty ? (
                <b.Error
                  ml={th.spacing.sm}
                  onClick={handleReset}
                  small
                  status={th.colors.brand.primaryAccent}
                  mx={th.spacing.sm}
                >
                  Reset
                </b.Error>
              ) : (
                <div />
              )}
              <b.Success
                disabled={updateLoading || !isDirty}
                onClick={handleSave}
                small
                status={th.colors.brand.primaryAccent}
                ml={th.spacing.xs}
              >
                {updateLoading ? (
                  <l.Flex alignCenter justifyCenter>
                    <ClipLoader
                      color={th.colors.brand.secondary}
                      size={th.sizes.xs}
                    />
                  </l.Flex>
                ) : (
                  'Save'
                )}
              </b.Success>
            </l.Flex>
          </l.Flex>
          <TextArea
            autoFocus={!programState.notes}
            fontSize={th.fontSizes.caption}
            onChange={handleChange}
            rows={3}
            value={programState.notes || ''}
            width={`calc(${th.sizes.fill} - ${th.spacing.md} - 2px)`}
          />
        </l.Div>
      }
      customStyles={{
        width: 300,
      }}
      setShow={() => {
        setShow(!show);
      }}
      show={show}
      triggerIcon={
        <l.Div
          background={program.notes ? th.colors.status.warning : undefined}
          borderRadius={th.borderRadii.circle}
          height={20}
          width={20}
        >
          <l.Div
            background={
              program.notes
                ? hexColorWithTransparency(
                    th.colors.background,
                    th.opacities.secondary,
                  )
                : undefined
            }
            borderRadius={th.borderRadii.circle}
            height={th.sizes.xs}
            width={th.sizes.xs}
            ml="2px"
            mt="2px"
          >
            <HighlightImg
              fill={th.colors.brand.secondary}
              height={th.sizes.xs}
              width={th.sizes.xs}
            />
          </l.Div>
        </l.Div>
      }
      visible={true}
    />
  );
};

export default ProgramNotes;
