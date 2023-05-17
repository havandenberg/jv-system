import React, { Fragment, useEffect, useState } from 'react';
import { MutationFunction, OperationVariables } from '@apollo/client';
import { equals, pick } from 'ramda';
import { ClipLoader } from 'react-spinners';

import { LabelInfo, validateItem } from 'components/column-label';
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
  defaultEditing?: boolean;
  handleDelete?: MutationFunction;
  handleUpdate: MutationFunction;
  transformChangesOnUpdate?: (changes: Partial<T>) => any;
  updateFields: string[];
  updateVariables: OperationVariables;
  validationLabels?: LabelInfo<T>[];
}

const useUpdateItem = <T,>({
  confirmDeleteText,
  data,
  deleteVariables,
  defaultEditing = false,
  handleDelete,
  handleUpdate,
  transformChangesOnUpdate,
  updateFields,
  updateVariables,
  validationLabels = [],
}: Props<T>) => {
  const previousData = usePrevious(data);

  const [editing, setEditing] = useState(defaultEditing);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<T>(data as T);
  const hasChanges = !equals(changes, data);

  const handleCancel = (onCancel?: () => void) => {
    setChanges(data as T);
    setEditing(false);
    setSaveAttempt(false);
    onCancel && onCancel();
  };

  const handleChange = (field: keyof T, value: any) => {
    setChanges({ ...changes, [field]: value } as T);
  };

  const handleChanges = (updates: Partial<T>) => {
    setChanges({ ...changes, ...updates } as T);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const validate = () =>
    changes && validationLabels && validateItem(changes, validationLabels);

  const isValid = validate();

  const handleSave = (onSave?: () => void) => {
    setSaveAttempt(true);
    if (validate()) {
      setUpdateLoading(true);
      handleUpdate({
        variables: {
          updates: transformChangesOnUpdate
            ? transformChangesOnUpdate(changes)
            : pick(updateFields, changes),
          ...updateVariables,
        },
      }).then(() => {
        setUpdateLoading(false);
        handleCancel();
      });
      onSave && onSave();
    }
  };

  const deleteItem = (onAfterDelete?: () => void) => {
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

  const getUpdateActions = (props?: {
    onAfterDelete?: () => void;
    onCancel?: () => void;
    onSave?: () => void;
    shouldConfirmCancel?: boolean;
  }) => {
    const { onAfterDelete, onCancel, onSave, shouldConfirmCancel } =
      props || {};
    const cancelAction = (
      <BasicModal
        key="cancelAction"
        title="Confirm Discard Changes"
        content={<ty.BodyText>You will lose all unsaved changes.</ty.BodyText>}
        confirmText="Discard"
        handleConfirm={() => {
          handleCancel(onCancel);
        }}
        shouldConfirm={!!(hasChanges || shouldConfirmCancel)}
        triggerProps={{
          mr: th.spacing.md,
          status: th.colors.status.error,
          width: 88,
        }}
        triggerText="Cancel"
      />
    );
    const saveAction = (
      <b.Success
        key="saveAction"
        disabled={updateLoading || (saveAttempt && !isValid)}
        onClick={() => {
          handleSave(onSave);
        }}
        width={88}
      >
        {updateLoading ? (
          <l.Flex alignCenter justifyCenter>
            <ClipLoader color={th.colors.brand.secondary} size={th.sizes.xs} />
          </l.Flex>
        ) : (
          'Save'
        )}
      </b.Success>
    );
    const editAction = (
      <b.Warning key="editAction" onClick={handleEdit} width={88}>
        Edit
      </b.Warning>
    );
    const deleteAction = handleDelete && (
      <BasicModal
        key="deleteAction"
        title="Confirm Delete"
        content={
          <ty.BodyText>
            {confirmDeleteText || 'Are you sure you want to delete item?'}
          </ty.BodyText>
        }
        confirmText="Confirm Delete"
        confirmLoading={deleteLoading}
        handleConfirm={() => {
          deleteItem(onAfterDelete);
        }}
        triggerProps={{
          ml: th.spacing.md,
          status: th.colors.status.error,
        }}
        triggerText="Delete"
      />
    );
    const defaultActions = [
      editing ? (
        <Fragment key={0}>
          {cancelAction}
          {saveAction}
        </Fragment>
      ) : (
        <Fragment key={0}>
          {editAction}
          {deleteAction}
        </Fragment>
      ),
    ];
    return {
      defaultActions,
      cancelAction,
      saveAction,
      editAction,
      deleteAction,
    };
  };

  return {
    changes,
    editing,
    handleChange,
    handleChanges,
    handleEdit,
    getUpdateActions,
    saveAttempt,
    setSaveAttempt,
    setUpdateLoading,
    setDeleteLoading,
    handleCancel,
    isValid: validate(),
  };
};

export default useUpdateItem;
