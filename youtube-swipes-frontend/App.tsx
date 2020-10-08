import React, { useState, useEffect, useRef }  from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Image, Animated, PanResponder, Picker} from 'react-native';
import Labels from './components/labels';
import DescriptionInfo from './components/descriptionInfo'
import axios from 'axios';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

import { AppLoading } from 'expo';



/*function useEffectSkipFirst(fn, arr) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    fn();
  }, arr);
}*/

export default function App() {

  //Values to allow drag and drop
  let position = new Animated.ValueXY();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [selectedValue, setSelectedValue] = useState("python");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (topic) => {
    setIsLoading(true)
    const apiCall = await fetch(`http://192.168.1.120:5000/youtube/getChannels/${topic}`)
    const data = await apiCall.json()
    /*console.log(data)
    console.log('Made it YONDER')*/
    setProfiles(data)
    setIsLoading(false)
  }

  const subscribe = async (id) => {
    await fetch("http://192.168.1.120:5000/youtube/subscribe",  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
       "id": id
      })
     });
    console.log('SUBSCRIBED')
  }

  const handleTopicChange = async (topic) => {
    console.log(topic)
    setSelectedValue(topic);
    console.log(selectedValue)
    console.log('SWITCH END')
    await fetchData(topic)
    setCurrentIdx(0);
  }

  useEffect(() => {
    if (profiles.length === 0){
      fetchData('python')
    }
   
  }, [profiles, isLoading])
  
  const PanRes = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 120) {
        subscribe(profiles[currentIdx].id)
        Animated.spring(position, {
          toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
        }).start(() => {
          setCurrentIdx(currentIdx + 1)
        })
      } else if (gestureState.dx < -120) {
        Animated.spring(position, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
        }).start(() => {
          setCurrentIdx(currentIdx + 1)
        })
      } else {
        Animated.spring(position, {
           toValue: { x: 0, y: 0 },
           friction: 4
           }).start()
        }  
     }
  })

  /*useEffectSkipFirst(
    () => {
      console.log("Bruh")
      position.setValue({ x: 0, y: 0 })
    },
    [currentIdx]
  );*/


  //Animate Left and right swipes as rotations
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  })

  const rotateAndTranslate = {
    transform: [{
      rotate: rotate
    },
    ...position.getTranslateTransform()
    ]
 }

 //For animating when the Like and Nope pop up
 const likeOpacity = position.x.interpolate({
  inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
  outputRange: [0, 0, 1],
  extrapolate: 'clamp'
})

const nopeOpacity = position.x.interpolate({
  inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
  outputRange: [1, 0, 0],
  extrapolate: 'clamp'
})

const nextCardOpacity = position.x.interpolate({
  inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
  outputRange: [1, 0, 1],
  extrapolate: 'clamp'
})

const nextCardScale = position.x.interpolate({
  inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
  outputRange: [1, 0.8, 1],
  extrapolate: 'clamp'
})

  

  const renderImages = () => {
    return profiles.map((item, i) => {
      if (i < currentIdx) {
        return null;
      } else if (i == currentIdx) {
        return (
          <Animated.View {...PanRes.panHandlers} key={item.id} style={
            [ rotateAndTranslate, {
              height: SCREEN_HEIGHT - 120,
              width: SCREEN_WIDTH,
              paddingLeft: 10,
              paddingRight: 10,
              position:'absolute'
            }
            
            ]
          }>
           <Labels likeOpacity={likeOpacity} nopeOpacity={nopeOpacity}/>

                  <Image
                        style={styles.imageStyle}
                        source={{uri:item["image_url"]}}
                      />
                <DescriptionInfo item={item}/>
              </Animated.View>
            )
      } else {
        return (
          <Animated.View key={item.id} style={
            { 
              opacity: nextCardOpacity,
              transform: [{scale: nextCardScale}],
              height: SCREEN_HEIGHT - 120,
              width: SCREEN_WIDTH,
              paddingLeft: 10,
              paddingRight: 10,
              position:'absolute'
            }
          }>
           <Labels likeOpacity={null} nopeOpacity={null}/>

                  <Image
                        style={styles.imageStyle}
                        source={{uri:item["image_url"]}}
                      />
                <DescriptionInfo item={item}/>
              </Animated.View>
        )
      }
      
      }).reverse()
  }



  if (isLoading){
    //If loading, return the loader
    return(
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
          <ActivityIndicator size="large" style={{
              flex: 1,
              justifyContent: "center",
              alignItems: 'center',
              marginTop: 50
            }} />
            </View>
        </View>
        
    )
  }

  return (
    <View style={{ flex: 1 }}>
       
        <View style={{ height: 60 }}>
          <Picker
            selectedValue={selectedValue}
            style={{ height: 40, width: 200, borderColor: 'black', borderStyle: 'solid', marginTop: 15, marginLeft: 100 }}
            onValueChange={(itemValue, itemIndex) => handleTopicChange(itemValue)}
          >
          <Picker.Item label="Python" value="python" />
          <Picker.Item label="Money" value="money" />
          <Picker.Item label="Top Guys" value="hi" />
          <Picker.Item label="Gaming" value="gaming" />
          <Picker.Item label="Fitness" value="fitness" />
        </Picker>
        </View>
        <View style={{ flex: 1 }}>
          {renderImages()}
        </View>
        <View style={{ height: 60 }}>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: 
    {
      flex: 1,
      height: null,
      width: null,
      resizeMode: "cover",
      borderRadius: 20
    }
});
