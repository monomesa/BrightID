import { Dimensions, Platform } from 'react-native';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

const DEVICE_SMALL_AREA = 240000;

export const DEVICE_TYPE =
  WIDTH * HEIGHT <= DEVICE_SMALL_AREA ? 'small' : 'large';

export const DEVICE_OS = Platform.OS;

console.log('width, height, area', WIDTH, HEIGHT, WIDTH * HEIGHT);
console.log('deviceType', DEVICE_TYPE);

export const BOTTOM_NAV_HEIGHT = DEVICE_TYPE === 'small' ? 55 : 63;
