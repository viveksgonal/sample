import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {Camera} from 'expo-camera';
import Svg, {G, Circle, Polyline, Polygon} from 'react-native-svg';
import {useState, useEffect} from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mpPose from '@mediapipe/pose';
import * as posedetection from '@tensorflow-models/pose-detection';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';

const Tensorcamera = cameraWithTensors(Camera);
const tensorDims = {height: 224, width: 224, depth: 3};

const detectorConfig = {
  runtime: 'tfjs',
  modelType: 'full',
  // solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
};
const {width, height} = Dimensions.get('screen');

const model = posedetection.SupportedModels.BlazePose;

//SVG CODE
function SVGgraph({
  points,
  imageWidth,
  imageHeight,
  screenWidth,
  screenHeight,
}) {
  
  const onePerson = transformPoints(points, imageWidth, imageHeight, screenWidth, screenHeight);
  const r = 7;
  const strokeWidth = 5;
  const circleFill = '#FF9B70';
  const headLeft = '#6beb34';
  const headRight = '#e8eb34';
  const armLeft = '#eb4034';
  const armRight = '#eb8334';
  const legLeft = '#34ebcd';
  const legRight = '#3486eb';
  const body = '#e8eb34';
  const HeadSVG = () => {
    return (
      <G>
        <G>
          <Circle
            class="point4"
            cx={5}
            cy={5}
            r={10}
            fill={headRight}
          />
          <Circle
            class="point2"
            cx={onePerson[2][0]}
            cy={onePerson[2][1]}
            r={r}
            fill={headRight}
          />
          <Circle
            class="point0"
            cx={onePerson[0][0]}
            cy={onePerson[0][1]}
            r={r}
            fill={headLeft}
          />
          <Circle
            class="point1"
            cx={onePerson[1][0]}
            cy={onePerson[1][1]}
            r={r}
            fill={headLeft}
          />
          <Circle
            class="point3"
            cx={onePerson[3][0]}
            cy={onePerson[3][1]}
            r={r}
            fill={headLeft}
          />
        </G>
        <Polyline
          points={`${onePerson[4][0]},${onePerson[4][1]} ${onePerson[2][0]},${onePerson[2][1]} ${onePerson[0][0]},${onePerson[0][1]} ${onePerson[1][0]},${onePerson[1][1]} ${onePerson[3][0]},${onePerson[3][1]}`}
          fill="none"
          stroke={headLeft}
          strokeWidth={strokeWidth}
        />
      </G>
    );
  };
  const BodySVG = () => {
    return (
      <G>
        <G>
          <Circle
            class="point6"
            cx={onePerson[6][0]}
            cy={onePerson[6][1]}
            r={r}
            fill={body}
          />
          <Circle
            class="point5"
            cx={onePerson[5][0]}
            cy={onePerson[5][1]}
            r={r}
            fill={body}
          />
          <Circle
            class="point11"
            cx={onePerson[11][0]}
            cy={onePerson[11][1]}
            r={r}
            fill={body}
          />
          <Circle
            class="point12"
            cx={onePerson[12][0]}
            cy={onePerson[12][1]}
            r={r}
            fill={body}
          />
        </G>
        <Polygon
          points={`${onePerson[6][0]},${onePerson[6][1]} ${onePerson[5][0]},${onePerson[5][1]} ${onePerson[11][0]},${onePerson[11][1]} ${onePerson[12][0]},${onePerson[12][1]}`}
          fill="none"
          stroke={body}
          strokeWidth={strokeWidth}
        />
      </G>
    );
  };
  const ArmSVG = () => {
    return (
      <G>
        <G>
          <Circle
            class="point6"
            cx={onePerson[6][0]}
            cy={onePerson[6][1]}
            r={r}
            fill={armRight}
          />
          <Circle
            class="point8"
            cx={onePerson[8][0]}
            cy={onePerson[8][1]}
            r={r}
            fill={armRight}
          />
          <Circle
            class="point10"
            cx={onePerson[10][0]}
            cy={onePerson[10][1]}
            r={r}
            fill={armRight}
          />

          <Circle
            class="point5"
            cx={onePerson[5][0]}
            cy={onePerson[5][1]}
            r={r}
            fill={armLeft}
          />
          <Circle
            class="point7"
            cx={onePerson[7][0]}
            cy={onePerson[7][1]}
            r={r}
            fill={armLeft}
          />
          <Circle
            class="point9"
            cx={onePerson[9][0]}
            cy={onePerson[9][1]}
            r={r}
            fill={armLeft}
          />
        </G>
        <Polyline
          points={`${onePerson[6][0]},${onePerson[6][1]} ${onePerson[8][0]},${onePerson[8][1]} ${onePerson[10][0]},${onePerson[10][1]}`}
          fill="none"
          stroke={armRight}
          strokeWidth={strokeWidth}
        />
        <Polyline
          points={`${onePerson[5][0]},${onePerson[5][1]} ${onePerson[7][0]},${onePerson[7][1]} ${onePerson[9][0]},${onePerson[9][1]}`}
          fill="none"
          stroke={armLeft}
          strokeWidth={strokeWidth}
        />
      </G>
    );
  };
  const LegSVG = () => {
    return (
      <G>
        <G>
          <Circle
            class="point12"
            cx={onePerson[12][0]}
            cy={onePerson[12][1]}
            r={r}
            fill={legRight}
          />
          <Circle
            class="point14"
            cx={onePerson[14][0]}
            cy={onePerson[14][1]}
            r={r}
            fill={legRight}
          />
          <Circle
            class="point16"
            cx={onePerson[16][0]}
            cy={onePerson[16][1]}
            r={r}
            fill={legRight}
          />

          <Circle
            class="point11"
            cx={onePerson[11][0]}
            cy={onePerson[11][1]}
            r={r}
            fill={legLeft}
          />
          <Circle
            class="point13"
            cx={onePerson[13][0]}
            cy={onePerson[13][1]}
            r={r}
            fill={legLeft}
          />
          <Circle
            class="point15"
            cx={onePerson[15][0]}
            cy={onePerson[15][1]}
            r={r}
            fill={legLeft}
          />
        </G>
        <Polyline
          points={`${onePerson[12][0]},${onePerson[12][1]} ${onePerson[14][0]},${onePerson[14][1]} ${onePerson[16][0]},${onePerson[16][1]}`}
          fill="none"
          stroke={legRight}
          strokeWidth={strokeWidth}
        />
        <Polyline
          points={`${onePerson[11][0]},${onePerson[11][1]} ${onePerson[13][0]},${onePerson[13][1]} ${onePerson[15][0]},${onePerson[15][1]}`}
          fill="none"
          stroke={legLeft}
          strokeWidth={strokeWidth}
        />
      </G>
    );
  };
  console.log('person0: ', onePerson[0][0], onePerson[0][1]);
  return (
    // screen: w 360 h 719.7
    <Svg height="100%" width="100%" viewBox="0 0 100 100">
      <HeadSVG />
      <BodySVG />
      <ArmSVG />
      <LegSVG />
    </Svg>
  );
}

function transformPoints(
  points,
  imageWidth,
  imageHeight,
  screenWidth,
  screenHeight,
) {
  let ratioX = screenWidth / imageHeight,
    ratioY = screenHeight / imageWidth;
  const onePerson = points[0];
  console.log('sizes: ', imageWidth, imageHeight, screenWidth, screenHeight);
  for (let k = 0; k < onePerson.length; k++) {
    let x = onePerson[k][0],
      y = onePerson[k][1];

    onePerson[k][0] = (imageHeight - y) * ratioX;
    onePerson[k][1] = x * ratioY;
  }
  return onePerson;
}
const App = () => {
  const detector = useRef(null);
  const raf = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [frameWorkReady, setFrameWorkReady] = useState(false);
  const [points, setPoints] = useState([new Array(17).fill([0, 0])]);
  const textureDimsState =
    Platform.OS === 'ios'
      ? {height: 1920, width: 1080}
      : {height: 1200, width: 1600};
  const camera = useRef(null);
  const [tfReady, setTFReady] = useState(false);
  const createDetector = async () => {
    return posedetection.createDetector(model, detectorConfig);
  };
  const onReady = React.useCallback(images => {
    if (!images) {
      console.log('Image not found!');
    }
    const loop = async () => {
      // console.log('in loop')
      const nextImageTensor = images.next().value;
      // console.log(nextImageTensor)

      let poses = null;
      if (detector.current != null) {
        try {
          poses = await detector.current.estimatePoses(nextImageTensor, {
            maxPoses: 1,
            flipHorizontal: false,
          });
          // console.log(poses[0].keypoints);
          result = poses[0]?.keypoints.map(o => Object.keys(o).map(k => o[k]));
          var x = result?.map(function (val) {
            return val.slice(0, -3);
          });
          setPoints(x);
          console.log(x);
          // console.log(points[0]);
        } catch (error) {
          detector.current.dispose();
          detector.current = null;
          alert(error);
        }
      }
      raf.current = requestAnimationFrame(loop);
    };
    loop();
  }, []);
  useEffect(() => {
    if (!frameWorkReady) {
      (async () => {
        const {status} = await Camera.requestCameraPermissionsAsync().catch(e =>
          console.log(e),
        );
        setHasPermission(status === 'granted');
        await tf.ready().catch(e => console.log(e));
        setTFReady(true);
        detector.current = await createDetector();
        setFrameWorkReady(true);
      })();
    }
  }, []);
  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
    };
  }, [raf.current]);

  return React.useMemo(
    () => (
      <View style={styles.container}>
        <Modal
          style={{backgroundColor: 'red'}}
          transparent={true}
          visible={true}>
          <View style={styles.outerView}>
            <View style={styles.innerView}>
              <SVGgraph
                points={points}
                imageWidth={960}
                imageHeight={540}
                screenWidth={width}
                screenHeight={height}
              />
            </View>
          </View>
        </Modal>
        {hasPermission ? (
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
          />
        ) : (
          <Text>camera not available</Text>
        )}
      </View>
    ),
    [onReady, hasPermission],
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  outerView: {
    flex: 1,
  },
  innerView: {
    width: '100%',
    height: height,
    backgroundColor: 'transparent',
    // marginTop: 100,
  },
  stream: {
    width: width,
    height: height,
  },
});
export default App;
