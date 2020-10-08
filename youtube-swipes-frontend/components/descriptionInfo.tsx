import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default function DescriptionInfo({item}) {
    return (
        
            <Text style={{position: 'absolute', top: 450, fontSize: 40, fontWeight: '800', right: 35, zIndex: 1000, color: 'white' }}>
                {item.title}
            </Text>
           
    );
}


const styles = StyleSheet.create({
  });