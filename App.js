import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {mediaDevices, RTCView} from 'react-native-webrtc';
import {useRef, useEffect} from 'react';
import Canvas from 'react-native-canvas';

const {width, height} = Dimensions.get('screen');
const App = () => {
  const canvas = useRef(null);
  const [stream, setStream] = useState(null);
  const start = async () => {
    console.log('start');
    if (!stream) {
      let s;
      try {
        s = await mediaDevices.getUserMedia({video: true});
        setStream(s);
      } catch (e) {
        console.error(e);
      }
    }
  };
  const stop = () => {
    console.log('stop');
    if (stream) {
      stream.release();
      setStream(null);
    }
  };
  useEffect(() => {
    // console.log('Hello');
    const ctx = canvas.current.getContext('2d');
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.fillStyle = 'blue';
    // ctx.fillRect(0, 0, 100, 100);
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
        <Canvas ref={canvas} style={styles.can}/>
        {stream && <RTCView streamURL={stream.toURL()} style={styles.stream} />}
        <View style={styles.footer}>
          <Button title="Start" onPress={start} />
          <Button title="Stop" onPress={stop} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 1,
    marginTop: -180,
    zIndex: 1,
    // position:'absolute',
    // top:0,
    // left:0,
    // right:0
  },
  footer: {
    // backgroundColor: Colors.lighter,
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  can: {
    zIndex: 2,
    //   zIndex: 2,
  },
});

export default App;
