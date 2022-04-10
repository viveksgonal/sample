/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useState, useEffect} from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
const App = () => {
  const [tfReady, setTFReady] = useState(false);
  useEffect(() => {
    const load = async () => {
      try {
        await tf.ready();
        setTFReady(true);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  });
  return (
    <View style={styles.container}>
      <Text>Open up!</Text>
      {tfReady && <Text>Vivek</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
