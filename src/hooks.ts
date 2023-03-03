import { useMemo } from 'react'
import { JsonValue } from 'type-fest'

import { ValueAnalysis } from './types'
import { compare } from './utils'


type Value = JsonValue | Record<string, unknown> | undefined

export const useAugmentedValue = (left: Value, right: Value): ValueAnalysis | void =>
  useMemo(() => compare(left, right), [left, right])
