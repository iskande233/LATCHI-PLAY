import React from 'react';
import { Dimensions, PixelRatio } from 'react-native';
import Splash from '~/screens/Splash';
import StartUp from '~/screens/StartUp';
import Details from './src/screens/Details';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '~/constants/theme';
import Tabs from '~/navigation/Tabs';
import { store } from '~/redux/store'
import { Provider } from 'react-redux'
import Test from './src/screens/Test';
import Orientation from 'react-native-orientation-locker';

const Stack = createStackNavigator();

const App = () => {
  const { width, height } = Dimensions.get('window');
  // Detection safe: use pixel values with high threshold to avoid false TV detection on modern high-res phones
  // TVs are typically very large screens (e.g., 1920x1080 or 4K) OR have low pixel density on huge screens
  const pixelRatio = PixelRatio.get();
  const dpWidth = width / pixelRatio;
  const dpHeight = height / pixelRatio;
  // TV detection: very large dp width (like 1200+) combined with landscape-only behavior or no touch
  // For simplicity and reliability: treat as TV only if dp width > 1000 AND height is also large
  const isTV = dpWidth > 1200 && dpHeight > 700;

  React.useEffect(() => {
    if (isTV) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  }, [isTV]);

  return (
    <Provider store={store}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.black
        }}
      >
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
            initialRouteName={'Splash'}
          >
            {/* <Stack.Screen
              name="Test"
              component={Test}
            /> */}
            <Stack.Screen
              name="Tabs"
              component={Tabs}
            />
            <Stack.Screen
              name="Splash"
              component={Splash}
            />
            <Stack.Screen
              name="Details"
              component={Details}
            />
            <Stack.Screen
              name="StartUp"
              component={StartUp}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  )
}

export default App;