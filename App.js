import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Camera } from 'expo-camera';
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mpPose from '@mediapipe/pose';
import * as posedetection from '@tensorflow-models/pose-detection';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

const Tensorcamera = cameraWithTensors(Camera)
const tensorDims = { height: 224, width: 224, depth: 3 };


const detectorConfig = {
  runtime: 'tfjs',
  modelType: 'full',
  // solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
};
const { width, height } = Dimensions.get('screen');

const model = posedetection.SupportedModels.BlazePose;

const App = () => {
  const detector = useRef(null)
  const raf = useRef(null)
  const [hasPermission, setHasPermission] = useState(null);
  const [frameWorkReady, setFrameWorkReady] = useState(false)
  const textureDimsState = Platform.OS === 'ios' ? { height: 1920, width: 1080 } : { height: 1200, width: 1600 }
  const camera = useRef(null)
  const [tfReady, setTFReady] = useState(false);
  const createDetector = async () => {
    return posedetection.createDetector(model, detectorConfig);
  };
  const onReady = React.useCallback((images) => {
    if (!images) {
      console.log("Image not found!");
    }
    const loop = async () => {
      // console.log('in loop')
      const nextImageTensor = images.next().value;
      // console.log(nextImageTensor)

      let poses = null
      if (detector.current != null) {
        try {
          poses = await detector.current.estimatePoses(
            nextImageTensor,
            { maxPoses: 1, flipHorizontal: false });
          // console.log(poses)
        } catch (error) {
          detector.current.dispose();
          detector.current = null;
          alert(error);
        }
      }
      raf.current = requestAnimationFrame(loop);
    };
    loop();
  }, [])
  useEffect(() => {
    if (!frameWorkReady) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync().catch(e =>
          console.log(e)
        );
        setHasPermission(status === "granted");
        await tf.ready().catch(e => console.log(e));
        setTFReady(true);
        detector.current = await createDetector()
        setFrameWorkReady(true);
      })();
    }
  }, [])
  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
    };
  }, [raf.current]);

  return React.useMemo(() => (
    <View style={styles.container}>
      {hasPermission ?
        <Tensorcamera
          ref={camera}
          type={Camera.Constants.Type.front}
          onReady={onReady}
          autorender={true}
          style={styles.stream}
          cameraTextureHeight={textureDimsState.height}
          cameraTextureWidth={textureDimsState.width}
          resizeHeight={tensorDims.height}
          resizeWidth={tensorDims.width}
          resizeDepth={tensorDims.depth}
        /> : <Text>camera not available
        </Text>}
    </View>
  ), [onReady, hasPermission])
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stream: {
    width: width,
    height: height
  },
});
export default App;
