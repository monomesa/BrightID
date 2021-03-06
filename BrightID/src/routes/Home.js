import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { INVITE_ACTIVE } from '@/utils/constants';
import { DEVICE_LARGE } from '@/utils/deviceConstants';
import { createSelector } from '@reduxjs/toolkit';
import { createStackNavigator } from '@react-navigation/stack';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { SvgXml } from 'react-native-svg';
import {
  pendingConnection_states,
  selectAllPendingConnections,
} from '@/components/PendingConnectionsScreens/pendingConnectionSlice';
import RecoveringConnectionScreen from '@/components/Recovery/RecoveringConnectionScreen';
import {
  toggleDrawer,
  resetHome,
  resetNotifications,
} from '@/NavigationService';
import menuBar from '@/static/menu_bar.svg';
import { headerOptions } from './helpers';
import { HomeDrawer } from './HomeDrawer';

/** SELECTORS */

const unconfirmedSelector = createSelector(
  selectAllPendingConnections,
  (pendingConnections) =>
    pendingConnections.filter(
      (pc) => pc.state === pendingConnection_states.UNCONFIRMED,
    ),
);

const inviteSelector = createSelector(
  (state) => state.groups.invites,
  (invites) => invites.filter(({ state }) => state === INVITE_ACTIVE),
);

/** COMPONENTS */

const NotificationBell = () => {
  const pendingConnections = useSelector(
    (state) => unconfirmedSelector(state)?.length,
  );

  const invites = useSelector((state) => inviteSelector(state)?.length);

  const backupPending = useSelector(
    (state) => state.notifications.backupPending,
  );

  const displayBadge = backupPending || invites || pendingConnections;

  return (
    <TouchableOpacity
      style={{ marginRight: 25 }}
      onPress={() => {
        Keyboard.dismiss();
        resetNotifications();
      }}
    >
      <Material name="bell" size={DEVICE_LARGE ? 28 : 23} color="#000" />
      {displayBadge ? (
        <View
          style={{
            backgroundColor: '#ED1B24',
            width: 9,
            height: 9,
            borderRadius: 5,
            position: 'absolute',
            top: 5,
            left: 17,
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
};

/** OPTIONS */

const BrightIdLogo = () => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        resetHome();
      }}
    >
      <Image
        source={require('@/static/brightid-final.png')}
        accessible={true}
        accessibilityLabel="Home Header Logo"
        resizeMode="contain"
        style={{ width: DEVICE_LARGE ? 104 : 85, maxHeight: 80 }}
      />
    </TouchableWithoutFeedback>
  );
};

const homeScreenOptions = {
  headerTitle: () => <BrightIdLogo />,
  headerLeft: () => {
    return (
      <TouchableOpacity
        testID="toggleDrawer"
        style={{
          width: DEVICE_LARGE ? 80 : 70,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          Keyboard.dismiss();
          toggleDrawer();
        }}
      >
        <SvgXml xml={menuBar} width={DEVICE_LARGE ? 30 : 24} />
      </TouchableOpacity>
    );
  },
  headerRight: () => <NotificationBell />,
  headerStyle: {
    height: DEVICE_LARGE ? 80 : 70,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: -1,
  },
  headerTitleAlign: 'center',
  headerTintColor: 'transparent',
  headerTransparent: true,
};

const recoveringConnectionOptions = {
  ...headerOptions,
  title: 'Account Recovery',
};

/** SCREENS */

const Stack = createStackNavigator();

const Home = () => {
  return (
    <>
      <Stack.Screen
        name="Home"
        component={HomeDrawer}
        options={homeScreenOptions}
      />
      <Stack.Screen
        name="RecoveringConnection"
        component={RecoveringConnectionScreen}
        options={recoveringConnectionOptions}
      />
    </>
  );
};

export default Home;
