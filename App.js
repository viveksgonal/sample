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
  Modal,
  TouchableOpacity,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {mediaDevices, RTCView} from 'react-native-webrtc';
import {useRef, useEffect} from 'react';
import Canvas from 'react-native-canvas';
// import {GCanvasView} from '@flyskywhy/react-native-gcanvas';
import {backgroundColor} from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import Svg, {Circle, Path} from 'react-native-svg';
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
  // const handleCan = canvas => {
  //   const ctx = canvas.getContext('2d');
  //   ctx.beginPath();
  //   ctx.moveTo(0, 0);
  //   ctx.lineTo(300, 150);
  //   ctx.stroke();
  //    ctx.fillStyle = 'blue';
  //    ctx.fillRect(0, 0, 100, 100);
  // };
  // useEffect(() => {
  //   const ctx = canvas.current.getContext('2d');
  //   ctx.fillRect(0, 0, width, height);
  //   ctx.fillStyle = 'purple';
  //    ctx.fillRect(0, 0, 100, 100);
  // }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
        <Modal
          style={{backgroundColor: 'red'}}
          transparent={true}
          visible={true}>
          <View style={styles.outerView}>
            <View style={styles.innerView}>
              {/* <GCanvasView onCanvasCreate={handleCan} height={height} width={width} /> */}
              <Svg height="100%" width="100%" viewBox="0 0 100 100">
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="blue"
                  strokeWidth="2.5"
                  fill="green"
                />
              </Svg>
              {/* <GCanvasView ref={canvas} style={{width: width, height :height}}> </GCanvasView> */}
              {/* <Canvas ref={canvas} style={styles.can} /> */}
            </View>
            <TouchableOpacity style={styles.btn} onPress={start}>
              <Text>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={stop}>
              <Text>Stop</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {stream && <RTCView streamURL={stream.toURL()} style={styles.stream} />}
        <View style={styles.footer}></View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
  },
  btn: {
    height: 50,
    backgroundColor: 'blue',
  },
  innerView: {
    width: '100%',
    height: height-200,
    backgroundColor: 'transparent',
    // marginTop: 100,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.white,
    // ...StyleSheet.absoluteFill,
  },
  stream: {
    width: (4 * height) / 3,
    height: height,
    alignSelf: 'center',
    // zIndex:2,
    // position: 'absolute',
    // top: 0,
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
  // can: {
  //   width: '100%',
  //   height: height-500,
  //   // position:'absolute',
  //   // top:0,
  //   // left:0,
  //   // right:0,
  //   // width: 600,
  //   // alignContent: 'center',
  //   // alignSelf:'center',
  //   zIndex: 1,
  // },
});

export default App;
