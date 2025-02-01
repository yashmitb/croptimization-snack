import React from "react";
import { Text, View, StyleSheet, Image, useWindowDimensions } from 'react-native';


export default OnboardingItem = ({item}) => {
  const {width} = useWindowDimensions();
   

  return (
    <View style={[styles.container,{width}]}>
      <Image source={item.image} style={[styles.image,{width,resizeMode:'contain'}]}/>
      
      <View style={{flex:0.3}}>
         <Text style={styles.title}>{item.title}</Text>
         <Text style={styles.description}>{item.description}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#fff"
  },
  image:{
    flex:0.7,
    justifyContent:'center'
  },
  title:{
    fontWeight:'800',
    fontSize:28,
    marginBottom:15,
    color: '#00BFA6',
    textAlign:'center'
  },
  description:{
    fontWeight:'300',
    color: '#62656b',
    textAlign:'center',
    paddingHorizontal:64,
    paddingBottom:45,
  },
});
