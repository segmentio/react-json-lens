import { JsonValue } from 'type-fest'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useAugmentedValue } from './hooks'
import { ArrayDiffOperation, DiffOperation, ObjectDiffOperation, ValueAnalysis } from './types'
import {
  ArrayIndex,
  BracketDecoration,
  ObjectKey,
  Item,
  ItemList,
  PrimitiveValue,
  ToggleObjectButton,
  DefaultToggleIcon,
  LabelDecorations,
  ColonSeparator,
  DiffOverlay,
  CollapsedIndicator,
  PrevArrayIndex,
  HighlightDecoration
} from './style'


export type ToggleObjectButtonProps = {
  collapsed: boolean
}

export type NodeAddress = {
  depth: number
  key?: string
  index?: number
  previousIndex?: number
}

export type LeafNode = {
  diffType?: DiffOperation
  address: NodeAddress
  contents: { value?: JsonValue; oldValue?: JsonValue }
  highlighted: boolean
  toggleHighlight: () => void
}

export type BranchNode = LeafNode & {
  contents: ValueAnalysis
  expanded: boolean
  toggleExpansionState: () => void
}

export type JsonViewProps = {
  value: JsonValue | Record<string, unknown> | undefined
  oldValue?: JsonValue | Record<string, unknown> | undefined
  expandButtonIcon?: React.FC<ToggleObjectButtonProps>
  onNodeSpawned?: (node: BranchNode | LeafNode) => void
  onNodeDestroyed?: (nodeAddress: NodeAddress) => void
}

type NodeProps = JsonViewProps & {
  address: NodeAddress
  diffType?: DiffOperation
  onToggleDiffNode?: (nodeDepth: number, expanded: boolean) => void
}

const ADDRESS_KEYS_PATTERN = /previousIndex|index|key/

const Node = ({
  value,
  oldValue,
  address,
  onToggleDiffNode,
  onNodeSpawned,
  onNodeDestroyed,
  diffType,
  expandButtonIcon: ToggleIcon = DefaultToggleIcon
}: NodeProps) => {
  const [isCollapsed, setIsCollapsed] = useState(address.depth !== 1)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [didExpandOnce, setDidExpandOnce] = useState(!isCollapsed)
  const augmentedValue = useAugmentedValue(oldValue, value)
  const isObjectLike = typeof augmentedValue?.type !== 'undefined'
  const nodeHandle = useRef<LeafNode | BranchNode>()
  const [dimmingState, setDimmingState] = useState<number[]>([])
  const dimmingFactor = useMemo<number>(
    () =>
      !diffType || isCollapsed
        ? 1
        : Math.max(
            0.1,
            dimmingState.reduce(
              (factor, refCount, nodeDepth) => (refCount > 0 ? factor - nodeDepth / 1.5 : factor),
              0.6
            )
          ),
    [diffType, isCollapsed, dimmingState]
  )

  const handleToggleDiffNode = (nodeDepth: number, expanded: boolean) => {
    setDimmingState((prevState) => {
      const newState = prevState.slice()
      newState[nodeDepth] = Math.max(0, (prevState[nodeDepth] ?? 0) + (expanded ? 1 : -1))
      return newState
    })

    onToggleDiffNode?.(nodeDepth, expanded)
  }

  const toggleExpansionState = () => {
    if (diffType) {
      onToggleDiffNode?.(address.depth, isCollapsed)
      dimmingState.forEach((refCount, nodeDepth) => refCount > 0 && onToggleDiffNode?.(nodeDepth, isCollapsed))
    }

    if (isCollapsed) {
      setDidExpandOnce(true)
    }

    setIsCollapsed(!isCollapsed)
  }

  const toggleHighlight = () => setIsHighlighted(!isHighlighted)

  const nodePropsFromDiffItem = (item: ObjectDiffOperation | ArrayDiffOperation): NodeProps => ({
    address: {
      ...Object.fromEntries(Object.entries(item).filter(([k]) => ADDRESS_KEYS_PATTERN.test(k))),
      depth: address.depth + 1
    },
    value: 'value' in item ? item.value : void 0,
    oldValue: 'oldValue' in item ? item.oldValue : void 0,
    diffType: 'diffType' in item ? item.diffType : void 0,
    onToggleDiffNode: handleToggleDiffNode,
    onNodeSpawned,
    onNodeDestroyed
  })

  const leafNode: Partial<LeafNode> = {
    address,
    diffType,
    highlighted: isHighlighted,
    toggleHighlight
  }

  // We must use Object.assign so there's only one object reference instead of (re)creating a new reference
  Object.assign(
    (nodeHandle.current ??= {} as BranchNode),
    isObjectLike
      ? ({
          ...leafNode,
          contents: augmentedValue,
          expanded: !isCollapsed,
          toggleExpansionState
        } as BranchNode)
      : ({
          ...leafNode,
          contents: { value, oldValue }
        } as LeafNode)
  )

  useEffect(() => {
    onNodeSpawned?.(nodeHandle.current!)
    return () => onNodeDestroyed?.(address)
  }, [JSON.stringify(address)])

  return (
    <DiffOverlay diffType={diffType} dimmingFactor={dimmingFactor}>
      {isHighlighted && <HighlightDecoration />}
      {Object.keys(address).some((k) => ADDRESS_KEYS_PATTERN.test(k)) && (
        <LabelDecorations>
          {isObjectLike && (
            <ToggleObjectButton onClick={toggleExpansionState}>
              <ToggleIcon collapsed={isCollapsed} />
            </ToggleObjectButton>
          )}
          {'previousIndex' in address && <PrevArrayIndex>{address.previousIndex}</PrevArrayIndex>}
          {'index' in address && <ArrayIndex moved={'previousIndex' in address}>{address.index}</ArrayIndex>}
          {'key' in address && <ObjectKey>{address.key}</ObjectKey>}
          <ColonSeparator />
        </LabelDecorations>
      )}

      {isObjectLike && typeof augmentedValue !== 'undefined' && (
        <>
          <BracketDecoration>{augmentedValue.decorations[0]}</BracketDecoration>
          {isCollapsed && <CollapsedIndicator />}
          {didExpandOnce && (
            <div style={{ display: isCollapsed ? 'none' : 'block' }}>
              <ItemList>
                {augmentedValue.items.map((item: ObjectDiffOperation | ArrayDiffOperation, i: number) => (
                  <Item key={i}>
                    <Node {...nodePropsFromDiffItem(item)} />
                  </Item>
                ))}
              </ItemList>
            </div>
          )}
          <BracketDecoration>{augmentedValue.decorations[1]}</BracketDecoration>
        </>
      )}

      {!isObjectLike && diffType === DiffOperation.Modified && (
        <>
          <PrimitiveValue diffType={DiffOperation.Deleted} rawValue={oldValue}>
            {oldValue?.toString()}
          </PrimitiveValue>
          <PrimitiveValue diffType={DiffOperation.Added} rawValue={value}>
            {value?.toString()}
          </PrimitiveValue>
        </>
      )}

      {!isObjectLike && diffType !== DiffOperation.Modified && (
        <PrimitiveValue rawValue={value ?? oldValue}>{(value ?? oldValue)?.toString()}</PrimitiveValue>
      )}
    </DiffOverlay>
  )
}

export const JSONView = (props: JsonViewProps) => <Node address={{ depth: 1 }} {...props} />
