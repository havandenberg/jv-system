import React, { useState } from 'react';
import { sentenceCase } from 'change-case';
import { format, isAfter } from 'date-fns';
import { mapObjIndexed, pick } from 'ramda';
import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-modal';
import RRuleGeneratorTS, { translations } from 'react-rrule-generator-ts';
import { ClipLoader } from 'react-spinners';
import RRule, { Options, RRuleSet, rrulestr } from 'rrule';
// import 'react-rrule-generator-ts/dist/index.css';

import api from 'api';
import { validateItem } from 'components/column-label';
import ModalComponent from 'components/modal';
import EditableCell, { Input } from 'components/editable-cell';
import { modalStyles } from 'components/modal';
import useUpdateItem from 'hooks/use-update-item';
import { CalendarEvent } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import TextInput, { Select, TextArea } from 'ui/input';

import { baseLabels } from './data-utils';

const commonInputStyles = {
  borderRadius: th.borderRadii.default,
  height: th.sizes.icon,
  fontSize: th.fontSizes.body,
  padding: th.spacing.xs,
};
const textInputStyles = { ...commonInputStyles, width: 175 };
const numberInputStyles = {
  ...commonInputStyles,
  width: 60,
};

interface Props {
  event: CalendarEvent;
  handleCancel: () => void;
}

const CalendarEventDetails = ({ event, handleCancel }: Props) => {
  const isNew = event.id === -1;

  const [handleUpdate, { loading: updateLoading }] =
    api.useUpdateCalendarEvent();
  const [handleCreate, { loading: createLoading }] =
    api.useCreateCalendarEvent();
  const saveLoading = updateLoading || createLoading;

  const updateFields = [
    'allDay',
    'title',
    'startDate',
    'endDate',
    'rrule',
    'eventDescription',
  ];
  const updateVariables = isNew ? {} : { id: event.id };

  const [handleDelete, { loading: deleteLoading }] =
    api.useDeleteCalendarEvent();

  const {
    changes,
    editing: updatesEditing,
    handleChange,
    getUpdateActions,
    saveAttempt,
    setSaveAttempt,
  } = useUpdateItem<CalendarEvent>({
    confirmDeleteText: `Are you sure you want to delete 
    ${event.title}?`,
    data: event as CalendarEvent,
    deleteVariables: updateVariables,
    defaultEditing: isNew,
    handleDelete,
    handleUpdate,
    updateFields,
    updateVariables,
    validationLabels: baseLabels,
  });
  const editing = isNew || updatesEditing;

  const recurrence =
    changes.rrule && rrulestr(changes.rrule.replace('\\n', '\n'));
  const recurrenceOptions = recurrence
    ? {
        freq: recurrence.options.freq,
        interval: recurrence.options.interval,
        count: recurrence.options.count,
        until: recurrence.options.until,
        dtstart: recurrence.options.dtstart,
      }
    : {};
  const defaultRRule = new RRule({
    dtstart: changes.startDate,
    freq: RRule.WEEKLY,
    interval: 1,
    count: 10,
    until: changes.endDate,
  });

  const [{ recurrenceIsCount, showRecurrence }, setState] = useState({
    recurrenceIsCount: recurrenceOptions ? !recurrenceOptions.until : true,
    showRecurrence: !!recurrence,
  });

  const setRecurrenceIsCount = (newRecurrenceIsCount: boolean) =>
    setState({ showRecurrence, recurrenceIsCount: newRecurrenceIsCount });

  const setShowRecurrence = (newShowRecurrence: boolean) =>
    setState({ recurrenceIsCount, showRecurrence: newShowRecurrence });

  const displayedRRule = recurrence
    ? editing
      ? new RRule({
          dtstart: changes.startDate,
          freq: recurrenceOptions ? recurrenceOptions.freq : RRule.WEEKLY,
          interval: recurrenceOptions ? recurrenceOptions.interval : 1,
          count: recurrenceIsCount
            ? recurrence.options.count || defaultRRule.options.count
            : null,
          until: !recurrenceIsCount
            ? recurrence.options.until || defaultRRule.options.until
            : null,
        })
      : recurrence
    : new RRule({
        dtstart: changes.startDate,
        freq: defaultRRule.options.freq,
        interval: defaultRRule.options.interval,
        count: recurrenceIsCount ? defaultRRule.options.count : null,
        until: !recurrenceIsCount ? defaultRRule.options.until : null,
      });

  const handleRRuleChange = (key: keyof Options, value: any) => {
    handleChange(
      'rrule',
      new RRule({ ...recurrenceOptions, [key]: value }).toString(),
    );
  };

  const handleDeleteOnce = () => {
    if (recurrence) {
      const rruleSet = new RRuleSet();
      rruleSet.rrule(displayedRRule);
      rruleSet.exdate(event.startDate);
      const updates = mapObjIndexed(
        (value, key) =>
          ['startDate', 'endDate'].includes(key)
            ? (value as Date).toLocaleString()
            : key === 'rrule'
            ? rruleSet.toString()
            : value,
        pick(updateFields, changes),
      );
      handleUpdate({
        variables: {
          updates,
          ...updateVariables,
        },
      }).then(handleCancel);
    }
  };

  const validateRecurrence = () =>
    recurrence
      ? recurrenceIsCount ||
        isAfter(recurrence.options.until || changes.endDate, changes.startDate)
      : true;

  const validate = () =>
    validateItem(changes, baseLabels) && validateRecurrence();

  const cancel = () => {
    setState({
      recurrenceIsCount: !recurrenceOptions.until,
      showRecurrence: !!recurrence,
    });
    handleCancel();
  };

  const updateActions = getUpdateActions({
    onAfterDelete: cancel,
    onCancel: isNew ? cancel : undefined,
  });

  const handleSave = () => {
    setSaveAttempt(true);
    if (validate()) {
      const updates = mapObjIndexed(
        (value, key) =>
          ['startDate', 'endDate'].includes(key)
            ? (value as Date).toLocaleString()
            : key === 'rrule'
            ? showRecurrence
              ? displayedRRule.toString()
              : ''
            : value,
        pick(updateFields, changes),
      );
      if (isNew) {
        return handleCreate({
          variables: { calendarEvent: updates },
        }).then(handleCancel);
      }
      return handleUpdate({
        variables: {
          updates,
          ...updateVariables,
        },
      }).then(handleCancel);
    }
  };

  const getContent = (key: keyof CalendarEvent) =>
    changes
      ? {
          dirty: changes[key] !== event[key],
          value: `${
            changes[key] === undefined ? event[key] || '' : changes[key] || ''
          }`,
        }
      : { dirty: false, value: `${event[key]}` };

  const dateTimePickerProps = {
    calendarIcon: null,
    clearIcon: null,
    disableClock: true,
    locale: 'en-US',
    required: true,
  };

  const validateKey = (key: keyof CalendarEvent) => {
    const validate = baseLabels.find((label) => label.key === key)!.validate;
    return !validate || validate(changes);
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={true}
      onRequestClose={cancel}
      style={modalStyles}
    >
      <l.Div minHeight={500}>
        <l.Flex justifyBetween mb={th.spacing.lg}>
          {editing ? (
            <div>
              <ty.CaptionText mb={th.spacing.sm} secondary>
                Event Title
              </ty.CaptionText>
              <TextInput
                hasError={saveAttempt && !validateKey('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                value={changes.title || ''}
              />
            </div>
          ) : (
            <ty.LargeText bold>{changes.title || ''}</ty.LargeText>
          )}
          <l.Flex>
            {editing
              ? [
                  updateActions.cancelAction,
                  <b.Primary
                    key="saveAction"
                    disabled={updateLoading || (!validate() && saveAttempt)}
                    onClick={handleSave}
                    width={88}
                  >
                    {saveLoading ? (
                      <l.Flex alignCenter justifyCenter>
                        <ClipLoader
                          color={th.colors.brand.secondary}
                          size={th.sizes.xs}
                        />
                      </l.Flex>
                    ) : isNew ? (
                      'Create'
                    ) : (
                      'Save'
                    )}
                  </b.Primary>,
                ]
              : [
                  updateActions.editAction,
                  recurrence ? (
                    <ModalComponent
                      trigger={(show) => (
                        <b.Primary
                          disabled={deleteLoading}
                          onClick={show}
                          ml={th.spacing.md}
                        >
                          {deleteLoading ? (
                            <l.Flex alignCenter justifyCenter>
                              <ClipLoader
                                color={th.colors.brand.secondary}
                                size={th.sizes.xs}
                              />
                            </l.Flex>
                          ) : (
                            'Delete'
                          )}
                        </b.Primary>
                      )}
                    >
                      {({ hide }) => (
                        <>
                          <ty.TitleText>Confirm Delete</ty.TitleText>
                          <ty.BodyText>
                            Are you sure you want to delete {event.title}?
                          </ty.BodyText>
                          <l.Flex justifyCenter mt={th.spacing.xl}>
                            <b.Primary
                              disabled={deleteLoading}
                              mr={th.spacing.md}
                              onClick={hide}
                            >
                              Cancel
                            </b.Primary>
                            <b.Primary
                              disabled={deleteLoading}
                              mr={th.spacing.md}
                              onClick={() =>
                                handleDelete({
                                  variables: updateVariables,
                                }).then(cancel)
                              }
                            >
                              {deleteLoading ? (
                                <l.Flex alignCenter justifyCenter>
                                  <ClipLoader
                                    color={th.colors.brand.secondary}
                                    size={th.sizes.xs}
                                  />
                                </l.Flex>
                              ) : (
                                'Delete All'
                              )}
                            </b.Primary>
                            <b.Primary
                              disabled={updateLoading}
                              onClick={() => {}}
                            >
                              {updateLoading ? (
                                <l.Flex alignCenter justifyCenter>
                                  <ClipLoader
                                    color={th.colors.brand.secondary}
                                    size={th.sizes.xs}
                                  />
                                </l.Flex>
                              ) : (
                                'Delete Once'
                              )}
                            </b.Primary>
                          </l.Flex>
                        </>
                      )}
                    </ModalComponent>
                  ) : (
                    updateActions.deleteAction
                  ),
                ]}
          </l.Flex>
        </l.Flex>
        <l.Flex>
          {editing ? (
            <>
              <l.Div mr={th.spacing.lg}>
                <ty.CaptionText mb={th.spacing.sm} secondary>
                  Start
                </ty.CaptionText>
                <DateTimePicker
                  onChange={(date: Date) => handleChange('startDate', date)}
                  value={changes.startDate}
                  {...dateTimePickerProps}
                />
              </l.Div>
              <div>
                <ty.CaptionText mb={th.spacing.sm} secondary>
                  End
                </ty.CaptionText>
                <l.Flex justifyBetween>
                  <l.Div
                    border={
                      validateKey('endDate') || !saveAttempt
                        ? undefined
                        : th.borders.error
                    }
                  >
                    <DateTimePicker
                      onChange={(date: Date) => handleChange('endDate', date)}
                      value={changes.endDate}
                      {...dateTimePickerProps}
                    />
                  </l.Div>
                </l.Flex>
              </div>
            </>
          ) : (
            <div>
              <ty.CaptionText mb={th.spacing.sm} secondary>
                Date & Time
              </ty.CaptionText>
              <ty.BodyText>
                {format(changes.startDate, 'EE, MMM d, yyyy h:mm a')} -{' '}
                {format(changes.endDate, 'EE, MMM d, yyyy h:mm a')}
              </ty.BodyText>
            </div>
          )}
          <l.Div ml={th.spacing.lg}>
            {(editing || changes.allDay) && (
              <ty.CaptionText mb={th.spacing.sm} secondary>
                All Day
              </ty.CaptionText>
            )}
            <EditableCell
              content={getContent('allDay')}
              defaultChildren={
                changes.allDay && (
                  <Input
                    dirty={false}
                    editing={false}
                    type="checkbox"
                    checked={!!changes.allDay}
                    onChange={() => {}}
                    {...textInputStyles}
                  />
                )
              }
              editing={editing}
              showBorder={false}
              inputProps={textInputStyles}
              isBoolean
              onChange={() => handleChange('allDay', !changes.allDay)}
            />
          </l.Div>
        </l.Flex>
        {(editing || recurrence) && (
          <ty.CaptionText mb={th.spacing.sm} mt={th.spacing.lg} secondary>
            Repeat
          </ty.CaptionText>
        )}
        <RRuleGeneratorTS
          onChange={(rrule: any) => console.log(rrule)}
          config={{
            hideStart: false,
          }}
          translations={translations.english}
          value={displayedRRule.toText()}
        />
        <l.Flex mb={th.spacing.md}>
          <l.Flex
            alignCenter
            cursor={editing ? 'pointer' : 'default'}
            onClick={() => editing && setShowRecurrence(!showRecurrence)}
          >
            {editing && (
              <Input
                dirty={false}
                editing={false}
                type="checkbox"
                checked={showRecurrence}
                mr={th.spacing.md}
                {...textInputStyles}
                width={th.sizes.icon}
              />
            )}
            {(editing || recurrence) && (
              <ty.BodyText>
                {showRecurrence
                  ? sentenceCase(displayedRRule.toText())
                  : 'No repeat'}
              </ty.BodyText>
            )}
          </l.Flex>
        </l.Flex>
        {editing && showRecurrence && (
          <l.Grid
            alignCenter
            gridTemplateColumns="100px 1fr"
            gridRowGap={th.spacing.sm}
            mb={th.spacing.md}
            ml={46}
          >
            <ty.CaptionText secondary>Frequency:</ty.CaptionText>
            <Select
              onChange={(e) =>
                handleRRuleChange('freq', parseInt(e.target.value, 10))
              }
              value={
                recurrence ? recurrence.options.freq : defaultRRule.options.freq
              }
            >
              {['Yearly', 'Monthly', 'Weekly', 'Daily'].map((option, idx) => (
                <option key={idx} value={idx}>
                  {option}
                </option>
              ))}
            </Select>
            <ty.CaptionText secondary>Every:</ty.CaptionText>
            <Input
              dirty={false}
              editing={false}
              type="number"
              min={1}
              value={
                recurrence
                  ? recurrence.options.interval
                  : defaultRRule.options.interval
              }
              onChange={(e) =>
                handleRRuleChange('interval', parseInt(e.target.value, 10))
              }
              textAlign="center"
              {...numberInputStyles}
            />
            <ty.CaptionText
              secondary
              disabled={recurrenceIsCount}
              onClick={() => setRecurrenceIsCount(false)}
            >
              Until:
            </ty.CaptionText>
            <l.Flex>
              <l.Div
                border={
                  validateRecurrence() || !saveAttempt
                    ? undefined
                    : th.borders.error
                }
                onClick={() => setRecurrenceIsCount(false)}
              >
                <DateTimePicker
                  disabled={recurrenceIsCount}
                  onChange={(date: Date) => handleRRuleChange('until', date)}
                  value={
                    recurrence
                      ? recurrence.options.until || defaultRRule.options.until
                      : defaultRRule.options.until
                  }
                  {...dateTimePickerProps}
                />
              </l.Div>
            </l.Flex>
            <ty.CaptionText
              secondary
              disabled={!recurrenceIsCount}
              onClick={() => setRecurrenceIsCount(true)}
            >
              Num occurrances:
            </ty.CaptionText>
            <l.Flex>
              <l.Div onClick={() => setRecurrenceIsCount(true)}>
                <Input
                  disabled={!recurrenceIsCount}
                  dirty={false}
                  editing={false}
                  type="number"
                  min={1}
                  value={
                    recurrence
                      ? recurrence.options.count ||
                        defaultRRule.options.count ||
                        ''
                      : defaultRRule.options.count || ''
                  }
                  onChange={(e) =>
                    handleRRuleChange('count', parseInt(e.target.value, 10))
                  }
                  textAlign="center"
                  {...numberInputStyles}
                />
              </l.Div>
            </l.Flex>
          </l.Grid>
        )}
        <ty.CaptionText mb={th.spacing.sm} mt={th.spacing.lg} secondary>
          Description
        </ty.CaptionText>
        {editing ? (
          <TextArea
            onChange={(e) => handleChange('eventDescription', e.target.value)}
            value={changes.eventDescription || ''}
            rows={10}
            width={400}
          />
        ) : (
          <ty.BodyText>
            {changes.eventDescription || 'No description.'}
          </ty.BodyText>
        )}
      </l.Div>
    </Modal>
  );
};

export default CalendarEventDetails;
