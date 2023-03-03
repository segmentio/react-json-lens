import { compare } from '../src/utils'
import {
  ArrayDiffOperation,
  DiffOperation,
  ModifiedArrayItem,
  ModifiedObjectItem,
  ObjectDiffOperation
} from '../src/types'


const originalValue = Object.freeze({
  /**
   * This will be a very basic test for primitives being modified
   */
  thePrimitives: {
    aString: 'jacob',
    aLongString: 'brown fox jumped over the fence, she fell but she is alive and well, and no regrets',
    aNumericValue: 7329821,
    aBoolean: true
  },
  /**
   * This should test for elements being modified (to the same value type, and other types), removals,
   * elements being moved around without being changed, additions
   */
  anArray: [
    829502,
    889252,
    'armenia',
    'this value switches positions',
    { thisObjectSwitchesPositions: true },
    // a value is expected to be added somewhere here
    false
  ],
  /**
   * This should test for inner changes to complex values within array
   *
   * This assertion absolutely requires that elements preserve their position AND the type
   * in the updated array to be eligible for direct comparison
   */
  anArrayWithInnerChanges: [
    'stable value as experiment control',
    { productId: 48925, description: 'a product' },
    'another stable value as experiment control',
    [1, 2, 3]
  ],
  /**
   * This should test for object having inner changes - keys being modified, removed and additions
   */
  anObject: {
    thisKeyWillBeModified: {
      name: 'tuco salamanca',
      age: 42
    },
    thisKeyWillBeRemoved: {
      name: 'sussy baca',
      age: 21
    }

    // a key is expected be added here
  }
})

const changedValue = Object.freeze({
  thePrimitives: {
    aString: 'ryan',
    aLongString: 'brown fox jumped over the fence, there are regrets',
    aNumericValue: 121,
    aBoolean: false
  },
  anArray: [
    174211,
    { thisObjectSwitchesPositions: true },
    'japan',
    true,
    'this value has been added',
    'this value switches positions'
  ],
  anArrayWithInnerChanges: [
    'stable value as experiment control',
    { productId: 73211, description: 'a product', catalogId: 810985 },
    'another stable value as experiment control',
    [3, 4, 5]
  ],
  anObject: {
    thisKeyWillBeModified: {
      name: 'lalo salamanca',
      age: 39
    },
    aNewlyAddedKey: {
      name: 'saul goodman',
      age: 35
    }
  }
})

const allDiffOperations = Object.values(DiffOperation).filter((v) => typeof v === 'number') as DiffOperation[]

describe('JSON Compare', () => {
  it('performs comparison of basic primitives', () => {
    const depth0Result = compare(originalValue, changedValue)!

    const item = depth0Result.items[0] as ModifiedObjectItem

    expect(item).toMatchObject(
      expect.objectContaining({
        diffType: DiffOperation.Modified,
        key: 'thePrimitives'
      })
    )

    const subject = compare(item.oldValue, item.value)

    expect(subject).toMatchSnapshot('primitives_diff_result')
  })

  it('performs comparison of an array', () => {
    const depth0Result = compare(originalValue, changedValue)!

    const item = depth0Result.items[1] as ModifiedObjectItem

    expect(item).toMatchObject(
      expect.objectContaining({
        diffType: DiffOperation.Modified,
        key: 'anArray'
      })
    )

    const subject = compare(item.oldValue, item.value)!

    // this assertion makes sure that the test data has been set up to test all types of diff operations
    expect(
      allDiffOperations.every((diffType) =>
        (subject.items as ArrayDiffOperation[]).some((item) => 'diffType' in item && item.diffType === diffType)
      )
    ).toBe(true)

    expect(subject).toMatchSnapshot('array_diff_result')
  })

  it('performs inner comparison of an array', () => {
    const depth0Result = compare(originalValue, changedValue)!

    const item = depth0Result.items[2] as ModifiedObjectItem

    expect(item).toMatchObject(
      expect.objectContaining({
        diffType: DiffOperation.Modified,
        key: 'anArrayWithInnerChanges'
      })
    )

    const subject = compare(item.oldValue, item.value)!

    const innerItem1 = subject.items[1] as ModifiedObjectItem
    const innerItem2 = subject.items[3] as ModifiedArrayItem

    // this assertion proves that as long the subjects don't move around, differ can do a direct compare
    expect(innerItem1.diffType).toBe(DiffOperation.Modified)
    expect(innerItem2.diffType).toBe(DiffOperation.Modified)

    const innerItem1Subject = compare(innerItem1.oldValue, innerItem1.value)!

    expect(innerItem1Subject).toMatchSnapshot('array_inner_object_diff_result')

    const innerItem2Subject = compare(innerItem2.oldValue, innerItem2.value)

    expect(innerItem2Subject).toMatchSnapshot('array_inner_array_diff_result')
  })

  it('performs comparison of an object', () => {
    const depth0Result = compare(originalValue, changedValue)!

    const item = depth0Result.items[3] as ModifiedObjectItem

    expect(item).toMatchObject(
      expect.objectContaining({
        diffType: DiffOperation.Modified,
        key: 'anObject'
      })
    )

    const subject = compare(item.oldValue, item.value)!

    // this assertion makes sure that the test data has been set up to test all types of diff operations
    expect(
      allDiffOperations.every(
        (diffType) =>
          (subject.items as ObjectDiffOperation[]).some((item) => 'diffType' in item && item.diffType === diffType) ||
          diffType === DiffOperation.Moved // there's no "moved" diff operation in objects
      )
    ).toBe(true)

    expect(subject).toMatchSnapshot('object_diff_result')
  })
})
