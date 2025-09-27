import { offers } from "@/constants";
import { FlatList } from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Index() {
  return (
  <SafeAreaView>
<FlatList data={offers} renderItem={({item, index})=> {
     const isEven = index % 2 === 0;

}}/>
  </SelfAreaView>
  );
}
