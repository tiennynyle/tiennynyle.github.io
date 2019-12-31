import React from 'react';
import {
  getMergeSortAnimations,
  getInsertionSortAnimations,
  getBubbleSortAnimations,
  getQuickSortAnimations,
  getSelectionSortAnimations,
  getCountingSortAnimations,
} from '../sortingAlgorithms/sortingAlgorithms.js';
import './SortingVisualizer.css';
import Slider from '@material-ui/core/Slider';
import Paper from '@material-ui/core/Paper';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// This is the main color of the array bars.
const PRIMARY_COLOR = 'turquoise';

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = 'red';

const PrettoSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
      animations_speed_ms: 1,
      number_of_array_bars: 50,
    };

    this.changeSpeed = this.changeSpeed.bind(this);
    this.changeArraySize = this.changeArraySize.bind(this);
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < this.state.number_of_array_bars; i++) {
      array.push(randomIntFromInterval(5, 720));
    }
    this.setState({array});
  }

  changeArraySize(event, value) {
    this.setState({number_of_array_bars: value});
    this.resetArray();
  }

  doAnimations(animations) {
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const [isColorChange, barOneIdx, barTwoIdx, swichColor] = animations[i];
      if (isColorChange) {
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = swichColor === true ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * this.state.animations_speed_ms);
      } else {
        setTimeout(() => {
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${barTwoIdx}px`;
        }, i * this.state.animations_speed_ms);
      }
    }
  }

  selectionSort() {
    const animations = getSelectionSortAnimations(this.state.array);
    this.doAnimations(animations);
  }

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    this.doAnimations(animations);
  }

  quickSort() {
    const animations = getQuickSortAnimations(this.state.array);
    this.doAnimations(animations);
  }

  heapSort() {}

  countingSort() {
    const animations = getCountingSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const [isColorChange, barOneIdx, barTwoIdx, swichColor] = animations[i];
      if (isColorChange) {
        const barOneStyle = arrayBars[barOneIdx].style;
        const color = swichColor === true ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
        }, i * this.state.animations_speed_ms);
      } else {
        setTimeout(() => {
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${barTwoIdx}px`;
        }, i * this.state.animations_speed_ms);
      }
    }
  }

  bubbleSort() {
    const animations = getBubbleSortAnimations(this.state.array);
    this.doAnimations(animations);
  }

  insertionSort() {
    const animations = getInsertionSortAnimations(this.state.array);
    this.doAnimations(animations);
  }

  changeSpeed(event, speed) {
    this.setState({animations_speed_ms: speed});
  }

  // NOTE: This method will only work if your sorting algorithms actually return
  // the sorted arrays; if they return the animations (as they currently do), then
  // this method will be broken.
  testSortingAlgorithms() {
    for (let i = 0; i < 100; i++) {
      const array = [];
      const length = randomIntFromInterval(1, 1000);
      for (let i = 0; i < length; i++) {
        array.push(randomIntFromInterval(-1000, 1000));
      }
      const javaScriptSortedArray = array.slice().sort((a, b) => a - b);
      const mergeSortedArray = getMergeSortAnimations(array.slice());
      console.log(arraysAreEqual(javaScriptSortedArray, mergeSortedArray));
    }
  }

  render() {
    const {array} = this.state;

    return (
      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              backgroundColor: PRIMARY_COLOR,
              height: `${value}px`,
            }}></div>
        ))}
        <div></div>
        <button onClick={() => this.resetArray()}>Generate New Array</button>
        <button onClick={() => this.mergeSort()}>Merge Sort</button>
        <button onClick={() => this.quickSort()}>Quick Sort</button>
        <button onClick={() => this.selectionSort()}>Selection Sort</button>
        <button onClick={() => this.countingSort()}>Counting Sort</button>
        {/* <button onClick={() => this.heapSort()}>Heap Sort</button> */}
        <button onClick={() => this.insertionSort()}>Insertion Sort</button>
        <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
        <div>
          <Paper>
            <Typography gutterBottom>Speed</Typography>
            <PrettoSlider
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={1}
              onChange={this.changeSpeed}
            />

            <Typography gutterBottom>Array Size</Typography>
            <PrettoSlider
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={50}
              min={10}
              max={200}
              onChange={this.changeArraySize}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}
