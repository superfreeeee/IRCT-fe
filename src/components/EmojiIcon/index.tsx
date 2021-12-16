import styled from 'styled-components';

export enum EmojiIconType {
  Man = '1f468',
  OfficeChair = '1f4ba',
  Computer = '1f4bb',
  Coffee = '2615',
  Golf = '26f3',
  Pencil = '270d',
  Tool = '26cf',
  Tools = '1f6e0',
  Wrench = '1f527', // 扳手
  Hammer = '1f528', // 榔头
  Book = '1f4d2',
  Noodles = '1f35c',
}

export const EMOJI_PREFIX = '__emoji-';

const sizeStyle = (size?: number | 'xs' | 'sm' | 'md' | 'lg') => {
  if (!size) {
    return '16px';
  }
  if (typeof size === 'number') {
    return `${size}px`;
  }
  const sizeStyle = {
    xs: '16px',
    sm: '24px',
    md: '30px',
    lg: '40px',
  };
  return sizeStyle[size];
};

interface EmojiIconProps {
  type: EmojiIconType;
  size?: number | 'xs' | 'sm' | 'md' | 'lg';
}

const EmojiIcon = styled.i<EmojiIconProps>`
  font-style: normal;

  &::before {
    content: '\0${(props) => props.type}';
    font-size: ${(props) => sizeStyle(props.size)};
  }
`;

export default EmojiIcon;
