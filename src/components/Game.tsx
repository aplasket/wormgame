import { useEffect, useState } from "react";
import { Dimensions, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../styles/colors";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Coordinate, Direction, GestureEventType } from "../types/types";
import { checkEatsFood } from "../utils/checkEatsFood";
import { checkGameOver } from "../utils/checkGameOver";
import { randomFoodPosition } from "../utils/randomFoodPosition";
import Food, { getRandomFruitEmoji } from "./Food";
import Header from "./Header";
import Score from "./Score";
import Snake from "./Snake";

const snakeInitialPosition = [{ x: 5, y: 5 }];
const gameBounds = { xMin: 0, xMax: 33, yMin: 0, yMax: 60 };
const moveInterval = 50;
const scoreIncrement = 10;

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const gameBounds = {
//   xMin: 0,
//   xMax: Math.floor(screenWidth),
//   yMin: 0,
//   yMax: Math.floor(screenHeight / 13.53), // Adjust the divisor based on your layout
// };
const foodInitialPosition = () => randomFoodPosition(gameBounds.xMax, gameBounds.yMax);


export default function Game(): JSX.Element {
  const [ direction, setDirection ] = useState<Direction>(Direction.Right);
  const [ snake, setSnake ] = useState<Coordinate[]>(snakeInitialPosition);
  const [ food, setFood ] = useState<Coordinate>(foodInitialPosition);
  const [ score, setScore ] = useState<number>(0);
  const [ isGameOver, setIsGameOver ] = useState<boolean>(false);
  const [ isPaused, setIsPaused ] = useState<boolean>(false);
  const [ fruitEmoji, setFruitEmoji ] = useState<string>(getRandomFruitEmoji())
  const [isGameOverModalVisible, setIsGameOverModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if(!isGameOver) {
      const intervalId = setInterval(()=> {
        !isPaused && moveSnake();
      }, moveInterval);

      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused]);

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead }; // create a new head object to avoid mutating the original head

    if (checkGameOver(snakeHead, gameBounds)) {
      setIsGameOver((prev) => !prev);
      showGameOverModal();
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

    // if eats food, grow snake and set scorer
    if(checkEatsFood(newHead, food, 2)){
      setFood(randomFoodPosition(gameBounds.xMax, gameBounds.yMax))
      setSnake([newHead, ...snake]);
      setScore(score + scoreIncrement);
      setFruitEmoji(getRandomFruitEmoji());
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
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
  };

  const reloadGame = () => {
    setSnake(snakeInitialPosition);
    setFood(foodInitialPosition);
    setIsGameOver(false);
    setScore(0);
    setDirection(Direction.Right);
    setIsPaused(false);
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const showGameOverModal = () => {
    setIsGameOverModalVisible(true);
  };

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={styles.container}>
        <Header
          reloadGame={reloadGame}
          pauseGame={pauseGame}
          isPaused={isPaused}
        >
          <Score score={score} />
        </Header>
        <View style={styles.boundaries}>
          <Snake snake={snake} />
          <Food x={food.x} y={food.y}>
            {fruitEmoji}
          </Food>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isGameOverModalVisible}
          onRequestClose={() => {
            setIsGameOverModalVisible(false);
          }}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Game Over</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                reloadGame();
                setIsGameOverModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </SafeAreaView>
    </PanGestureHandler>
  );
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 24,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
