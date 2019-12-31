export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

export function getCountingSortAnimations(array) {
  const animations = []
  if (array.length <= 1) return array;
  countingSort(array, animations)
  return animations
}

export function getInsertionSortAnimations(array) {
  const animations = []
  if (array.length <= 1) return array;
  insertionSortHelper(array, animations)
  return animations
}

export function getBubbleSortAnimations(array) {
  const animations = []
  bubbleSortHelper(array, animations)
  return animations
}

export function getQuickSortAnimations(array) {
  const animations = [];
  quickSort(array, animations)
  return animations
}

export function getSelectionSortAnimations(array) {
  const animations = [];
  selectionSort(array, animations)
  return animations
}

function countingSort(array, animations) {
  let largestElement = 0;
  for (let num of array) {
    if (num > largestElement) {
      largestElement = num
    }
  }

  let auxiliaryArray = []
  for (let i = 0; i < largestElement + 1; ++i) {
    auxiliaryArray.push(0);
  }

  for (let i = 0; i < array.length; ++i) {
    animations.push([true, i, null, true])
    animations.push([true, i, null, false])
    auxiliaryArray[array[i]] += 1;
  }

  let idx = 0;
  for (let i = 0; i < auxiliaryArray.length; ++i) {
    if (auxiliaryArray[i] !== 0) {
      let num = auxiliaryArray[i]
      while (num !== 0) {
        animations.push([false, idx, i, false])
        array[idx] = i
        num -= 1
        idx += 1
      }
    }
  }
}

function selectionSort(array, animations) {
  let length = array.length;
  for (let i = 0; i < length; ++i) {
    let min_idx = i;
    for (let j = i + 1; j < length; ++j) {
      animations.push([true, j, min_idx, true])
      animations.push([true, j, min_idx, false])
      if (array[j] < array[min_idx]) {
        min_idx = j;
      }
    }
    animations.push([false, i, array[min_idx]])
    animations.push([false, min_idx, array[i]])
    swap(array, i, min_idx)
  }
}

function quickSort(array, animations) {
  quickSortHelper(array, animations, 0, array.length - 1)
}

function quickSortHelper(array, animations, start, end) {
  if (start >= end) return
  let pivot = start
  let left = start + 1
  let right = end

  while (left <= right) {
    animations.push([true, left, right, true])
    animations.push([true, left, right, false])
    if (array[left] > array[pivot] && array[right] < array[pivot]) {
      animations.push([false, left, array[right]])
      animations.push([false, right, array[left]])
      swap(array, left, right)
    }
    animations.push([true, left, pivot, true])
    animations.push([true, left, pivot, false])
    if (array[left] <= array[pivot]) {
      left += 1;
    }
    animations.push([true, right, pivot, true])
    animations.push([true, right, pivot, false])
    if (array[right] >= array[pivot]) {
      right -= 1;
    }
  }
  animations.push([false, right, array[pivot]])
  animations.push([false, pivot, array[right]])
  swap(array, pivot, right)

  let leftSmaller = right - 1 - start < end - 1 - (right + 1)
  if (leftSmaller) {
    quickSortHelper(array, animations, start, right - 1)
    quickSortHelper(array, animations, right + 1, end)
  } else {
    quickSortHelper(array, animations, right + 1, end)
    quickSortHelper(array, animations, start, right - 1)
  }
}

function bubbleSortHelper(array, animations) {
  let length = array.length;
  while (length !== 0) {
    for (let i = 0; i + 1 < length; ++i) {
      animations.push([true, i, i + 1, true])
      animations.push([true, i, i + 1, false])
      if (array[i] > array[i + 1]) {
        animations.push([false, i, array[i + 1]])
        animations.push([false, i + 1, array[i]])
        swap(array, i, i + 1)
      }
    }
    length -= 1
  }
}

function swap(array, i, j) {
  let tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
}

function insertionSortHelper(array, animations) {
  for (let i = 1; i < array.length; ++i) {
    let key = array[i]
    let j = i - 1

    while (j >= 0) {
      animations.push([true, i, j, true])
      animations.push([true, i, j, false])
      if (array[j] > key) {
        animations.push([false, j + 1, array[j]])
        array[j + 1] = array[j]
        j = j - 1;
      } else {
        break;
      }
    }

    animations.push([false, j + 1, key])
    array[j + 1] = key
  }

}

function mergeSortHelper(
  mainArray,
  startIdx,
  endIdx,
  auxiliaryArray,
  animations,
) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(
  mainArray,
  startIdx,
  middleIdx,
  endIdx,
  auxiliaryArray,
  animations,
) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    // animations.push([i, j]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push([true, i, j, true]);
    animations.push([true, i, j, false]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      // We overwrite the value at index k in the original array with the
      // value at index i in the auxiliary array.
      animations.push([false, k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      // We overwrite the value at index k in the original array with the
      // value at index j in the auxiliary array.
      animations.push([false, k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([true, i, i, true]);

    animations.push([true, i, i, false]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    // animations.push([i, i]);
    // We overwrite the value at index k in the original array with the
    // value at index i in the auxiliary array.
    animations.push([false, k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([true, j, j, true]);

    animations.push([true, j, j, false]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    // animations.push([j, j]);
    // We overwrite the value at index k in the original array with the
    // value at index j in the auxiliary array.
    animations.push([false, k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}
