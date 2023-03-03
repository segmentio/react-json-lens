import { JsonArray, JsonObject, JsonValue } from 'type-fest'
import isObject from 'is-object'
import mapObject from 'map-obj'

import {
  AddedArrayItem,
  AddedObjectItem,
  ArrayDiffOperation,
  ValueAnalysis,
  DeletedArrayItem,
  DeletedObjectItem,
  DiffOperation,
  ModifiedArrayItem,
  ModifiedObjectItem,
  MovedArrayItem,
  ObjectDiffOperation,
  UnchangedObjectItem
} from './types'


const isRecord = (v: unknown): v is Record<string, unknown> => isObject(v) && !Array.isArray(v)
const hash = (v: JsonValue) => JSON.stringify(v)
const difference = <T>(a: T[], b: T[]) => a.filter((k) => !b.includes(k))
const intersection = <T>(a: T[], b: T[]) => a.filter((hash) => b.includes(hash))
const isSameValueType = <T>(v1: T, v2: unknown): v2 is T =>
  (isRecord(v1) && isRecord(v2)) || (Array.isArray(v1) && Array.isArray(v2)) || typeof v1 === typeof v2

const compareArrays = <L extends JsonArray, R extends JsonArray>(left: L, right: R): ArrayDiffOperation[] | void => {
  if (Array.isArray(left) && Array.isArray(right)) {
    const hashedLeft = left.map(hash)
    const hashedRight = right.map(hash)
    const additions = difference(hashedRight, hashedLeft).map((hash) => hashedRight.indexOf(hash))
    const deletions = difference(hashedLeft, hashedRight).map((hash) => hashedLeft.indexOf(hash))
    const moves = intersection(hashedRight, hashedLeft)
      .map((hash) => [hashedLeft.indexOf(hash), hashedRight.indexOf(hash)])
      .filter(([indexInLeft, indexInRight]) => indexInLeft !== indexInRight)
    const modifications = deletions.reduce(
      (acc, index) =>
        additions.includes(index) && isSameValueType(left[index], right[index])
          ? [
              ...acc,
              {
                diffType: DiffOperation.Modified,
                index: index,
                oldValue: left[index],
                value: right[index]
              }
            ]
          : acc,
      [] as ModifiedArrayItem[]
    )

    const changes: ArrayDiffOperation[] = [
      ...modifications,
      ...deletions
        .filter((deletionIndex) => !modifications.some(({ index }) => index === deletionIndex))
        .map<DeletedArrayItem>((deletionIndex) => ({
          diffType: DiffOperation.Deleted,
          previousIndex: deletionIndex,
          oldValue: left[deletionIndex]
        })),
      ...additions
        .filter((additionIndex) => !modifications.some(({ index }) => index === additionIndex))
        .map<AddedArrayItem>((additionIndex) => ({
          diffType: DiffOperation.Added,
          index: additionIndex,
          value: right[additionIndex]
        })),
      ...moves.map<MovedArrayItem>(([indexInLeft, indexInRight]) => ({
        diffType: DiffOperation.Moved,
        index: indexInRight,
        previousIndex: indexInLeft,
        value: right[indexInRight]
      }))
    ]

    const base = right.map<ArrayDiffOperation>((value, index) => ({ index, value }))

    // transplant changes into base
    changes.forEach((change) => {
      if ('index' in change) {
        return base.splice(
          base.findIndex((item) => 'index' in item && item.index === change.index),
          1,
          change
        )
      }

      // Delete operation
      if ('previousIndex' in change) {
        return base.splice(
          base.findIndex((item) => 'index' in item && item.index === change.previousIndex),
          0,
          change
        )
      }
    })

    return base
  }

  // when only one of left or right is an array, there's no comparison
  const subject = (Array.isArray(right) && right) || (Array.isArray(left) && left)
  return !Array.isArray(subject)
    ? undefined
    : subject.map((v, i) => ({
        index: i,
        value: v
      }))
}

const compareObjects = <L extends JsonValue, R extends JsonValue>(left: L, right: R): ObjectDiffOperation[] | void => {
  if (isRecord(left) && isRecord(right)) {
    const hashedLeft = mapObject(left as Record<string, JsonValue>, (key, value) => [key, hash(value)])
    const hashedRight = mapObject(right as Record<string, JsonValue>, (key, value) => [key, hash(value)])
    const leftKeys = Object.keys(hashedLeft)
    const rightKeys = Object.keys(hashedRight)
    const addedKeys = difference(rightKeys, leftKeys)
    const deletedKeys = difference(leftKeys, rightKeys)
    const intersectingKeys = intersection(rightKeys, leftKeys)
    const modifiedKeys = intersectingKeys.filter((k) => hashedLeft[k] !== hashedRight[k])
    const unchangedKeys = difference(intersectingKeys, modifiedKeys)

    const getKeyIndex = (k: string) => {
      const idx = rightKeys.indexOf(k)
      return idx > -1 ? idx : leftKeys.indexOf(k)
    }

    return [
      ...addedKeys.map<AddedObjectItem>((key) => ({
        diffType: DiffOperation.Added,
        key,
        value: right[key]
      })),
      ...deletedKeys.map<DeletedObjectItem>((key) => ({
        diffType: DiffOperation.Deleted,
        key,
        oldValue: left[key]
      })),
      ...modifiedKeys.flatMap<ModifiedObjectItem | DeletedObjectItem | AddedObjectItem>((key) =>
        isSameValueType(left[key], right[key])
          ? {
              diffType: DiffOperation.Modified,
              key,
              value: right[key],
              oldValue: left[key]
            }
          : [
              {
                diffType: DiffOperation.Deleted,
                key,
                oldValue: left[key]
              },
              {
                diffType: DiffOperation.Added,
                key,
                value: right[key]
              }
            ]
      ),
      ...unchangedKeys.map<UnchangedObjectItem>((key) => ({
        key,
        value: right[key]
      }))
    ].sort((a, b) => getKeyIndex(a.key) - getKeyIndex(b.key))
  }

  // when only one of left or right is an Object, there's no comparison
  const subject = (isRecord(right) && right) || (isRecord(left) && left)
  return !isRecord(subject)
    ? undefined
    : Object.entries(subject).map<UnchangedObjectItem>(([k, v]) => ({
        key: k,
        value: v as JsonValue
      }))
}

export const compare = <
  L extends JsonValue | Record<string, unknown> | void,
  R extends JsonValue | Record<string, unknown> | void
>(
  left: L,
  right: R
): ValueAnalysis | void => {
  if (Array.isArray(right) || Array.isArray(left)) {
    return {
      type: 'array',
      decorations: ['[', ']'],
      items: compareArrays(left as JsonArray, right as JsonArray)!
    }
  }

  if (isRecord(right) || isRecord(left)) {
    return {
      type: 'object',
      decorations: ['{', '}'],
      items: compareObjects(left as JsonObject, right as JsonObject)!
    }
  }
}
