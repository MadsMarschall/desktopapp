import levenshteinDistanceNumbers from '../../datapreprocess/levensteinNumberTest';

test('should return 0 if no difference between arrays', ()=>{
  const arr1 = [1,2,3]
  const arr2 = [1,2,3]
  expect(levenshteinDistanceNumbers(arr1,arr2)).toEqual(0);
})

test('should return 1 if 1 entry is different', ()=>{
  const arr1 = [1,2,33]
  const arr2 = [1,2,3]
  expect(levenshteinDistanceNumbers(arr1,arr2)).toEqual(1);
})

test('should return 2 if 2 entries are different', ()=>{
  const arr1 = [1,2,3]
  const arr2 = [12,2,4]
  expect(levenshteinDistanceNumbers(arr1,arr2)).toEqual(2);
})

test('should return 1 if 1 difference in length', ()=>{
  const arr1 = [1,2,3]
  const arr2 = [1,2,3,4]
  expect(levenshteinDistanceNumbers(arr1,arr2)).toEqual(1);
})

test('if one array is offset by 2, it should add 2 edits per entry', ()=>{
  const arr1 = [0,0,1,2,3]
  const arr2 = [1,2,3,4,5]
  expect(levenshteinDistanceNumbers(arr1,arr2)).toEqual(4);
})
