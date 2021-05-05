import { ReactNode, ElementType } from 'react';
import classnames from 'classnames';
import { Box } from '../system';
import * as styles from './typography.css';
import { atoms } from '../system/Box/Box';

const colorMap = {
  neutral: { lightMode: 'gray700', darkMode: 'white' },
  strong: { lightMode: 'gray900', darkMode: 'white' },
  code: { lightMode: 'white' },
  link: { lightMode: 'gray700', darkMode: 'white' },
  secondary: { lightMode: 'gray500', darkMode: 'gray400' },
  highlight: { lightMode: 'pink500' },
} as const;

export interface TextProps {
  component?: ElementType;
  size?: keyof typeof styles.text;
  color?: keyof typeof colorMap;
  weight?: keyof typeof styles.weight;
  baseline?: boolean;
  children: ReactNode;
}

export const useTextStyles = ({
  size = 'standard',
  color = 'neutral',
  weight = 'regular',
  baseline,
}: {
  size?: keyof typeof styles.text;
  color?: keyof typeof colorMap;
  weight?: keyof typeof styles.weight;
  baseline: boolean;
}) =>
  classnames(
    styles.font.body,
    styles.text[size].base,
    atoms({ color: colorMap[color] }),
    styles.weight[weight],
    {
      [styles.text.standard.trims]: baseline,
    },
  );

export default ({
  component = 'span',
  size,
  color,
  weight,
  baseline = true,
  children,
}: TextProps) => {
  return (
    <Box
      component={component}
      display="block"
      className={useTextStyles({ size, color, weight, baseline })}
    >
      {children}
    </Box>
  );
};
