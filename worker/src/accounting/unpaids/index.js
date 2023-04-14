const { mergeDeepLeft, omit, pick, times } = require('ramda');

const { gql, gqlClient } = require('../../api');
const { onError } = require('../../utils');

const ALL_VESSEL_CONTROLS = gql`
  query ALL_VESSEL_CONTROLS {
    allVesselControls {
      nodes {
        approval1
        approval2
        dateSent
        id
        isLiquidated
        nodeId
        notes1
        notes2
        shipper {
          id
          shipperName
          vesselControlDaysUntilDue
        }
        unpaids {
          nodes {
            id
            invoiceId
            shipperId
            vesselCode
            isApproved
            isUrgent
            notes
          }
        }
        pallets {
          nodes {
            id
            invoices {
              nodes {
                id
                actualShipDate
                amountOwed
                billingCustomer {
                  id
                  customerName
                }
                truckLoadId
                salesUserCode
                salesUser {
                  userCode
                  personContact {
                    firstName
                    email
                  }
                  id
                }
                invoiceId
                orderId
                paidCode
                flag
                conditionCode
                creditCode
              }
            }
            billOfLading
            palletId
            shipped
            searchText
          }
        }
        vessel {
          id
          arrivalDate
          dischargeDate
          vesselName
          vesselCode
          country {
            id
            countryName
          }
          warehouse {
            id
            warehouseName
          }
        }
      }
    }
  }
`;

const BULK_UPSERT_VESSEL_CONTROLS = gql`
  mutation VESSEL_CONTROLS_UPSERT($vesselControls: [VesselControlInput]!) {
    bulkUpsertVesselControl(input: { vesselControls: $vesselControls }) {
      clientMutationId
    }
  }
`;

const BULK_UPSERT_UNPAIDS = gql`
  mutation UNPAIDS_UPSERT($unpaids: [UnpaidInput]!) {
    bulkUpsertUnpaid(input: { unpaids: $unpaids }) {
      clientMutationId
    }
  }
`;

const emptyUnpaid = {
  isUrgent: false,
  isAlert: false,
  isApproved: false,
  notes: '',
};

const buildVesselControlItems = (vesselControls) =>
  vesselControls
    .map((vesselControl) => {
      const pallets = vesselControl.pallets?.nodes || [];
      const groupedPallets = pallets.reduce((acc, pallet) => {
        const newValues = pallet.invoices.nodes?.reduce(
          (acc2, invoice) => {
            const salesUserCode = invoice?.salesUserCode;
            const orderId = invoice?.orderId;
            const truckLoadId = invoice?.truckLoadId;

            if (
              !salesUserCode ||
              ['HS', 'JJ'].includes(salesUserCode) ||
              !orderId ||
              !truckLoadId
            ) {
              return acc2;
            }

            const info = acc2[salesUserCode]?.[orderId] || { pallets: [] };
            const accInfo =
              info.pallets.length > 0
                ? { pallets: [] }
                : acc[salesUserCode]?.[orderId] || { pallets: [] };
            const currentUnpaid = vesselControl.unpaids.nodes?.find(
              (unpaid) => unpaid && unpaid.invoiceId === invoice?.invoiceId,
            );
            return {
              ...acc2,
              [salesUserCode]: {
                ...acc2[salesUserCode],
                [orderId]: {
                  pallets: [...accInfo.pallets, ...info.pallets, pallet],
                  unpaid:
                    info.unpaid ||
                    (currentUnpaid
                      ? {
                          ...currentUnpaid,
                          orderId: invoice?.orderId,
                          invoice,
                          shipper: vesselControl.shipper,
                          vessel: vesselControl.vessel,
                        }
                      : {
                          ...emptyUnpaid,
                          vesselCode: vesselControl.vessel?.vesselCode,
                          shipperId: vesselControl.shipper?.id,
                          invoiceId: invoice?.invoiceId,
                          orderId: invoice?.orderId,
                          invoice,
                          shipper: vesselControl.shipper,
                          vessel: vesselControl.vessel,
                        }),
                },
              },
            };
          },
          {},
        );

        return mergeDeepLeft(newValues, acc);
      }, {});

      const palletsShipped = pallets.filter((pallet) => pallet.shipped).length;

      return {
        ...omit(['nodeId'], vesselControl),
        groupedPallets,
        palletsReceived: pallets.length,
        palletsShipped,
        id:
          vesselControl.id ===
          `${vesselControl.vessel?.id}${vesselControl.shipper?.id}`
            ? undefined
            : vesselControl.id,
      };
    })
    .filter((vc) => !!vc && !!vc.vessel && !!vc.shipper);

const getUnpaidsInfo = (unpaids) =>
  unpaids.reduce(
    (acc, unpaid) => ({
      isAllUrgent: !!acc.isAllUrgent && !!unpaid.isUrgent,
      isAlert: !!acc.isAlert || !!unpaid.invoice?.flag,
      isAllApproved:
        !!acc.isAllApproved &&
        (!!unpaid.isApproved || unpaid.invoice?.paidCode === 'P'),
      isPartialApproved:
        !!acc.isPartialApproved ||
        !!unpaid.isApproved ||
        unpaid.invoice?.paidCode === 'P',
    }),
    {
      isAllUrgent: true,
      isAlert: false,
      isAllApproved: true,
      isPartialApproved: false,
    },
  );

const iterationLimit = 200;

const generateVesselControlsAndUnpaids = () => {
  console.log(
    `\nGenerating vessel controls and unpaids at: ${new Date().toString()}\n`,
  );

  gqlClient
    .request(ALL_VESSEL_CONTROLS)
    .then(async ({ allVesselControls: { nodes } }) => {
      const allVesselControls = buildVesselControlItems(nodes);
      const filteredVesselControls = allVesselControls.map((vesselControl) => ({
        ...pick(
          [
            'approval1',
            'approval2',
            'dateSent',
            'id',
            'isLiquidated',
            'notes1',
            'notes2',
          ],
          vesselControl,
        ),
        shipperId: vesselControl.shipper?.id,
        vesselCode: vesselControl.vessel?.vesselCode,
      }));

      const vcIterationMap = times(
        (iteration) => iteration,
        Math.ceil(filteredVesselControls.length / iterationLimit),
      );

      for (const vcIteration of vcIterationMap) {
        const vesselControls = filteredVesselControls.slice(
          vcIteration * iterationLimit,
          (vcIteration + 1) * iterationLimit,
        );

        await gqlClient
          .request(BULK_UPSERT_VESSEL_CONTROLS, {
            vesselControls,
          })
          .catch(onError);
      }

      console.log(
        `${
          filteredVesselControls.filter((vc) => !vc.id).length
        } new vessel controls generated at ${new Date()}\n`,
      );

      const groupedUnpaids = allVesselControls.reduce(
        (acc, vesselControl) => ({
          ...acc,
          ...Object.keys(vesselControl?.groupedPallets || {}).reduce(
            (acc2, salesUserCode) => {
              const groupedPalletsBySalesUser =
                vesselControl?.groupedPallets?.[salesUserCode] || {};

              const itemKey = `${vesselControl?.vessel?.vesselCode}-${vesselControl?.shipper?.id}-${salesUserCode}`;

              const ups = Object.values(groupedPalletsBySalesUser).map(
                ({ unpaid }) => unpaid,
              );
              const up = ups[0];

              const { isAllApproved, isPartialApproved } = getUnpaidsInfo(ups);

              return up
                ? {
                    ...acc2,
                    [itemKey]: {
                      isAllApproved,
                      isPartialApproved,
                      isLiquidated: up.vesselControl?.isLiquidated,
                      unpaids: ups,
                    },
                  }
                : acc2;
            },
            {},
          ),
        }),
        {},
      );

      const allUnpaids = Object.keys(groupedUnpaids)
        .map((itemKey) => {
          const { unpaids } = groupedUnpaids[itemKey];
          const [vesselCode, shipperId] = itemKey.split('-');
          return unpaids
            .map((up) => ({
              ...pick(
                ['id', 'invoiceId', 'isApproved', 'isUrgent', 'notes'],
                up,
              ),
              vesselCode,
              shipperId,
            }))
            .filter((up) => up.shipperId && up.vesselCode);
        })
        .flat();

      const upIterationMap = times(
        (iteration) => iteration,
        Math.ceil(allUnpaids.length / iterationLimit),
      );

      for (const upIteration of upIterationMap) {
        const unpaids = allUnpaids.slice(
          upIteration * iterationLimit,
          (upIteration + 1) * iterationLimit,
        );

        await gqlClient
          .request(BULK_UPSERT_UNPAIDS, {
            unpaids,
          })
          .catch(onError);
      }

      console.log(
        `${
          allUnpaids.filter((up) => !up.id).length
        } new unpaids generated at ${new Date()}\n`,
      );
    });
};

module.exports = {
  generateVesselControlsAndUnpaids,
  getUnpaidsInfo,
  buildVesselControlItems,
};
