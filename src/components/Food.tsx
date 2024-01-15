import { StyleSheet, Text } from "react-native";
import { Coordinate } from "../types/types";

export function getRandomFruitEmoji(){
  const fruitEmojis = ["🍎", "🍊", "🍑", "🍌", "🍋", "🍉", "🍇", "🍓", "🍍", "🍒"];
  const randomIndex = Math.floor(Math.random() * fruitEmojis.length);
  return fruitEmojis[randomIndex];
};

interface FoodProps extends Coordinate {
  children: React.ReactNode;
}

export default function Food({ x, y, children }: FoodProps): JSX.Element {
  return (
    <Text style={[{top: y * 10, left: x * 10}, styles.food]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  food: {
    width: 25,
    height: 25,
    borderRadius: 7,
    position: "absolute"
  },
});