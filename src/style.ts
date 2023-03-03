import shader from 'shader'
import styled, { css } from 'styled-components'

import { DiffOperation } from './types'


const ArrowRightIcon = `
  <svg
    width="200mm"
    height="200mm"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg">
    <path
        style="fill:none;stroke:#52bd94;stroke-width:25;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
        d="m 75.60726,44.41028 44.12533,44.125337 c 6.35127,6.351268 6.35127,16.577493 1e-5,22.928753 l -44.125343,44.12535"/>
  </svg>
`.replaceAll(/#/g, '%23')

const createShades = (color: string, shades: number = 3) =>
  Array.from({ length: shades }, (_, i) => shader(color, i === 0 ? 0 : i / shades))

const generateBands = (color1: string, color2: string) => css`
  background: repeating-linear-gradient(-45deg, ${color1}, ${color1} 4px, ${color2} 4px, ${color2} 8px);
`
const colors: Partial<Record<DiffOperation, string[]>> = {
  [DiffOperation.Added]: createShades('#0ec080'),
  [DiffOperation.Deleted]: createShades('#ff3232'),
  [DiffOperation.Modified]: createShades('#0e56c0')
}

export const ObjectKey = styled.span`
  font-family: monospace;
  color: #004b7c;
`

export const ArrayIndex = styled(ObjectKey)<{ moved?: boolean }>`
  ${({ moved }) =>
    moved &&
    css`
      background-color: #d3e1ff;
    `}

  &::before,
  &::after {
    color: grey;
  }

  &::before {
    content: '[';
  }

  &::after {
    content: ']';
  }
`

export const PrevArrayIndex = styled(ArrayIndex)`
  background-color: #ff9f9f;
  color: #ab0101;
  text-decoration: line-through;

  &::before,
  &::after {
    color: grey;
  }
`

export const ColonSeparator = styled.span`
  &::after {
    content: ':';
    font-family: monospace;
    margin-right: 1ch;
    color: #343434;
  }
`

export const PrimitiveValue = styled.span<{ rawValue: unknown; diffType?: DiffOperation }>`
  position: relative;
  font-family: monospace;
  display: inline-block;
  margin: 1px;

  ${({ diffType }) =>
    diffType &&
    css`
      ${generateBands(shader(colors[diffType]![0], 0.7), shader(colors[diffType]![2], 0.7))}
      background-attachment: scroll;

      ${diffType === DiffOperation.Deleted &&
      css`
        text-decoration: line-through;
      `}
    `}

  ${({ rawValue }) =>
    typeof rawValue === 'string' &&
    css`
      color: #8b3f00;
      &::before,
      &::after {
        content: '"';
        color: #c9986a;
      }
    `}

  ${({ rawValue }) =>
    typeof rawValue === 'number' &&
    css`
      color: #015dd2;
    `}
  
  ${({ rawValue }) =>
    typeof rawValue === 'boolean' &&
    css`
      color: #7c01b7;
    `}
  
  ${({ rawValue }) =>
    (typeof rawValue === 'undefined' || rawValue === null) &&
    css`
      color: grey;
    `}
`

export const ToggleObjectButton = styled.button`
  background: none;
  border: none;
  outline: none;
  position: absolute;
  left: -1em;
  width: 1em;
  height: 1em;
  padding: 0;
`

export const HighlightDecoration = styled.div`
  width: 5px;
  background: #428cdc;
  display: block;
  position: absolute;
  left: -19px;
  top: 0;
  bottom: 0;
`

export const DefaultToggleIcon = styled.div<{ collapsed: boolean }>`
  height: 100%;
  width: 100%;
  background: center / 100% no-repeat url('data:image/svg+xml;utf8,${ArrowRightIcon}');

  ${({ collapsed }) =>
    !collapsed &&
    css`
      transform: rotate(45deg);
    `}
`

export const LabelDecorations = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
`

export const CollapsedIndicator = styled.span`
  position: relative;

  &::before {
    content: '...';
    color: #838383;
  }
`

export const BracketDecoration = styled.span`
  display: inline-block;
  position: relative;
  font-family: monospace;
  color: #969696;
  font-style: italic;

  /* the opening bracket should have just margin-top, and closing bracket should have just margin-bottom */
  margin-top: 1px;
  & ~ & {
    margin-top: 0;
    margin-bottom: 1px;
  }
`

export const ItemList = styled.ol`
  padding: 0 0 0 20px;
  margin: 0;
  list-style: none;
  position: relative;

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    inset: 0.5ch 0 0.5ch 0.3ch;
    border-right: 1px solid #dfdfdf;
  }
`

export const DiffOverlay = styled.div<{ dimmingFactor: number; diffType?: DiffOperation }>`
  position: relative;
  z-index: 2;
  display: inline-block;

  ${({ diffType, dimmingFactor }) =>
    typeof diffType !== 'undefined' &&
    diffType in colors &&
    css`
      &::before,
      &::after {
        content: '';
        display: block;
        position: absolute;
        inset: 0px -4px 0px -2px;
        border: 1px solid #fff;
        border-radius: 4px;
        transition: 0.2s opacity ease-in;
      }

      /* this "backdrop" prevents mixing of colors across mutiple diff highlight layers */
      /* this also prevents mixing of the layer color with the background color of container */
      &::before {
        z-index: -1;
        background-color: #fff;
        opacity: ${dimmingFactor > 0.5 ? 1 : 0};
      }

      &::after {
        z-index: -1;
        opacity: ${0.3 * dimmingFactor};
        border-color: ${colors[diffType]![0]};
        background: repeating-linear-gradient(
          -45deg,
          ${colors[diffType]![0]},
          ${colors[diffType]![0]} 4px,
          ${colors[diffType]![2]} 4px,
          ${colors[diffType]![2]} 8px
        );
        background-attachment: scroll;
      }
    `}
`

export const Item = styled.li`
  margin: 2px 0;
  padding-right: 4px;
`
