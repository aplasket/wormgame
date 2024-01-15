import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Colors } from '../styles/colors';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Coordinate, Direction, GestureEventType } from '../types/types';
import Snake from './Snake';
import { checkGameOver } from '../utils/checkGameOver';

const snakeInitialPosition = [{x: 5, y: 5}];
const foodInitialPosition = {x: 5, y: 5};
const gameBounds = { xMin: 0, xMax: 35, yMin: 0, yMax: 63};
const moveInterval = 50;
const scoreIncrement = 10;

export default function Game(): JSX.Element {
  const [ direction, setDirection ] = React.useState<Direction>(Direction.Right);
  const [ snake, setSnake ] = React.useState<Coordinate[]>(snakeInitialPosition);
  const [ food, setFood ] = React.useState<Coordinate>(foodInitialPosition);
  const [ isGameOver, setIsGameOver ] = React.useState<boolean>(false);
  const [ isPaused, setIsPaused ] = React.useState<boolean>(false);

  React.useEffect(() => {
    if(!isGameOver) {
      const intervalId = setInterval(()=> {
        !isPaused && moveSnake();
      }, moveInterval);

      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused]);

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead }; //creating a copy of snake

    // game over
    if (checkGameOver(snakeHead, gameBounds)) {
      setIsGameOver((prev) => !prev);
      return;
    }

    switch (direction) {
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
      default:
        break;
    }

    // if eats food
    // grow snake

    setSnake([newHead, ...snake.slice(0, -1)]);
  };

  const handleGesture = (event: GestureEventType) => {
    const { translationX, translationY } = event.nativeEvent;

    if ( Math.abs(translationX) > Math.abs(translationY) ) {
      if ( translationX > 0 ) {
        setDirection(Direction.Right);
      } else {
        setDirection(Direction.Left);
      }
    } else {
      if ( translationY > 0 ) {
        setDirection(Direction.Down);
      } else {
        setDirection(Direction.Up);
      }
    }
  }

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={styles.container}>
        <View style={styles.boundaries}>
          <Snake snake={snake}/>
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  boundaries: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Colors.background
  }
});
