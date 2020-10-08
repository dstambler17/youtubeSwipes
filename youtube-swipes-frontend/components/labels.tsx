import React from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';

export default function Labels({likeOpacity, nopeOpacity}) {
    const newlikeOpacity = (likeOpacity === null) ? 0 : likeOpacity;
    const newnopeOpacity = (nopeOpacity === null) ? 0 : nopeOpacity;

    return (
        <View>
            <Animated.View style={{opacity: newlikeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>

            </Animated.View>

            <Animated.View style={{opacity: newnopeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

            </Animated.View>
        </View>    
    );
}


const styles = StyleSheet.create({
  });