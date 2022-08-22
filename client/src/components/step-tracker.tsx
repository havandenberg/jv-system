import React, { Fragment } from 'react';
import styled from '@emotion/styled';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface StepStyledProps {
  backgroundColor?: string;
  completed?: boolean;
  onClick?: () => void;
  selected?: boolean;
  textColor?: string;
}

interface StepProps extends StepStyledProps {
  id: string;
  text: string;
}

const Step = styled(l.Flex)(
  ({
    backgroundColor,
    completed,
    onClick,
    selected,
    textColor,
  }: StepStyledProps) => ({
    alignItems: 'center',
    // background: selected
    //   ? backgroundColor || th.colors.brand.containerBackground
    //   : undefined,
    border: selected ? th.borders.primary : undefined,
    borderRadius: th.borderRadii.default,
    color:
      textColor ||
      th.colors.text.default ||
      (completed
        ? th.colors.status.success
        : selected
        ? th.colors.status.warning
        : th.colors.status.error),
    cursor: onClick ? 'pointer' : 'default',
    fontWeight: selected ? 'bold' : undefined,
    opacity: selected || completed ? 1 : th.opacities.disabled,
    padding: `${th.spacing.xs} ${th.spacing.md}`,
    ':hover': {
      opacity: selected
        ? 1
        : onClick
        ? th.opacities.secondary
        : th.opacities.disabled,
    },
  }),
);

type Props = {
  steps: StepProps[];
  currentStepId: string;
  onSelectStep?: (id: string) => void;
};

const StepTracker = ({ steps, currentStepId, onSelectStep }: Props) => {
  const currentStepIndex = steps.findIndex(({ id }) => id === currentStepId);
  return (
    <l.Flex alignCenter>
      {steps.map(({ backgroundColor, id, textColor, text }, idx) => (
        <Fragment key={id}>
          <Step
            backgroundColor={backgroundColor}
            textColor={textColor}
            onClick={
              onSelectStep
                ? () => {
                    onSelectStep(id);
                  }
                : undefined
            }
            selected={idx === currentStepIndex}
            completed={idx < currentStepIndex}
          >
            {text}
          </Step>
          {idx < steps.length - 1 && (
            <ty.BodyText mx={th.spacing.md}>➜</ty.BodyText>
          )}
        </Fragment>
      ))}
    </l.Flex>
  );
};

export default StepTracker;
