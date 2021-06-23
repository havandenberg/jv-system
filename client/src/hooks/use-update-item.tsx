import React, { Fragment, useEffect, useState } from 'react';
import { MutationFunction, OperationVariables } from '@apollo/client';
import { equals, pick } from 'ramda';
import { ClipLoader } from 'react-spinners';

import { BasicModal } from 'components/modal';
import usePrevious from 'hooks/use-previous';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface Props<T> {
  confirmDeleteText?: string;
  data: T;
  deleteVariables?: OperationVariables;
  handleDelete?: MutationFunction;
  handleUpdate: MutationFunction;
  onAfterDelete?: () => void;
  updateFields: string[];
  updateVariables: OperationVariables;
}

const useUpdateItem = <T,>({
  confirmDeleteText,
  data,
  deleteVariables,
  handleDelete,
  handleUpdate,
  onAfterDelete,
  updateFields,
  updateVariables,
}: Props<T>) => {
  const previousData = usePrevious(data);

  const [editing, setEditing] = useState(false);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [changes, setChanges] = useState<T>(data as T);
  const hasChanges = !equals(changes, data);

  const handleCancel = () => {
    setChanges(data as T);
    setEditing(false);
  };

  const handleChange = (field: keyof T, value: any) => {
    setChanges({ ...changes, [field]: value } as T);
  };

  const handleSave = () => {
    setUpdateLoading(true);
    handleUpdate({
      variables: {
        updates: pick(updateFields, changes),
        ...updateVariables,
      },
    }).then(() => {
      setUpdateLoading(false);
      handleCancel();
    });
  };

  const deleteItem = () => {
    if (handleDelete) {
      setDeleteLoading(true);
      handleDelete({ variables: deleteVariables }).then(() => {
        setDeleteLoading(false);
        onAfterDelete && onAfterDelete();
      });
    }
  };

  useEffect(() => {
    if (data !== previousData) {
      setChanges(data as T);
    }
  }, [data, previousData, setChanges]);

  const updateActions = [
    editing ? (
      <Fragment key={0}>
        <BasicModal
          title="Confirm Discard Changes"
          content={
            <ty.BodyText>You will lose all unsaved changes.</ty.BodyText>
          }
          confirmText="Discard"
          handleConfirm={handleCancel}
          shouldConfirm={hasChanges}
          triggerStyles={{
            mr: th.spacing.md,
            width: 88,
          }}
          triggerText="Cancel"
        />
        <b.Primary disabled={updateLoading} onClick={handleSave} width={88}>
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
        </b.Primary>
      </Fragment>
    ) : (
      <Fragment key={0}>
        <b.Primary
          key={0}
          onClick={() => {
            setEditing(true);
          }}
          width={88}
        >
          Edit
        </b.Primary>
        {handleDelete && (
          <Fragment key={1}>
            <BasicModal
              title="Confirm Delete"
              content={
                <ty.BodyText>
                  {confirmDeleteText || 'Are you sure you want to delete item?'}
                </ty.BodyText>
              }
              confirmText="Confirm Delete"
              confirmLoading={deleteLoading}
              handleConfirm={deleteItem}
              triggerStyles={{
                ml: th.spacing.md,
              }}
              triggerText="Delete"
            />
          </Fragment>
        )}
      </Fragment>
    ),
  ];

  return {
    changes,
    editing,
    handleChange,
    updateActions,
  };
};

export default useUpdateItem;
