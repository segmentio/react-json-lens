import { JsonValue } from 'type-fest'


export enum DiffOperation {
  Added = 'A',
  Deleted = 'D',
  Moved = 'R',
  Modified = 'M'
}

export type MovedArrayItem = {
  diffType: DiffOperation.Moved
  index: number
  previousIndex: number
  value: JsonValue | undefined
}

export type DeletedArrayItem = {
  diffType: DiffOperation.Deleted
  previousIndex: number
  oldValue: JsonValue | undefined
}

export type ModifiedArrayItem = {
  diffType: DiffOperation.Modified
  index: number
  value: JsonValue | undefined
  oldValue: JsonValue | undefined
}

export type AddedArrayItem = {
  diffType: DiffOperation.Added
  index: number
  value: JsonValue | undefined
}

export type UnchangedArrayItem = {
  index: number
  value: JsonValue | undefined
}

export type ArrayDiffOperation =
  | UnchangedArrayItem
  | MovedArrayItem
  | DeletedArrayItem
  | ModifiedArrayItem
  | AddedArrayItem

export type UnchangedObjectItem = {
  key: string
  value: JsonValue | undefined
}

export type AddedObjectItem = {
  diffType: DiffOperation.Added
  key: string
  value: JsonValue | undefined
}

export type ModifiedObjectItem = {
  diffType: DiffOperation.Modified
  key: string
  value: JsonValue | undefined
  oldValue: JsonValue | undefined
}

export type DeletedObjectItem = {
  diffType: DiffOperation.Deleted
  key: string
  oldValue: JsonValue | undefined
}

export type ObjectDiffOperation = UnchangedObjectItem | AddedObjectItem | ModifiedObjectItem | DeletedObjectItem

export type ObjectAnalysis = {
  type: 'object'
  decorations: ['{', '}']
  items: ObjectDiffOperation[]
}

export type ArrayAnalysis = {
  type: 'array'
  decorations: ['[', ']']
  items: ArrayDiffOperation[]
}

export type ValueAnalysis = ArrayAnalysis | ObjectAnalysis
