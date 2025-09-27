import { offers } from "@/constants";
import { FlatList, Pressable, View } from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Index() {
  return (
  <SafeAreaView>
<FlatList data={offers} renderItem={({item, index})=> {
     const isEven = index % 2 === 0;

     return (
      <View>
        <Pressable   className={cn("offer-card", isEven ? 'flex-row-reverse' : 'flex-row')}
                              style={{ backgroundColor: item.color }}
                              android_ripple={{ color: "#fffff22"}}>

        </Pressable>
      </View>
     )
}}/>
  </SelfAreaView>
  );
}
