import CoverArt from '@app/components/CoverArt'
import PressableOpacity from '@app/components/PressableOpacity'
import { usePause, usePlay } from '@app/hooks/trackplayer'
import { useStore } from '@app/state/store'
import { selectTrackPlayer } from '@app/state/trackplayer'
import colors from '@app/styles/colors'
import font from '@app/styles/font'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { State } from 'react-native-track-player'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'

const ProgressBar = React.memo(() => {
  const { position, duration } = useStore(selectTrackPlayer.progress)

  let progress = 0
  if (duration > 0) {
    progress = position / duration
  }

  return (
    <View style={progressStyles.container}>
      <View style={[progressStyles.left, { flex: progress }]} />
      <View style={[progressStyles.right, { flex: 1 - progress }]} />
    </View>
  )
})

const progressStyles = StyleSheet.create({
  container: {
    height: 2,
    flexDirection: 'row',
  },
  left: {
    backgroundColor: colors.text.primary,
  },
  right: {
    backgroundColor: '#595959',
  },
})

const Controls = React.memo(() => {
  const state = useStore(selectTrackPlayer.playerState)
  const play = usePlay()
  const pause = usePause()

  let playPauseIcon: string
  switch (state) {
    case State.Playing:
      playPauseIcon = 'pause'
      break
    default:
      playPauseIcon = 'play'
      break
  }

  const action = useCallback(() => {
    if (state === State.Playing) {
      pause()
    } else {
      play()
    }
  }, [state, play, pause])

  return (
    <View style={styles.controls}>
      {state === State.Buffering ? (
        <ActivityIndicator color="white" size="large" animating={true} />
      ) : (
        <PressableOpacity onPress={action} hitSlop={14}>
          <IconFA5 name={playPauseIcon} size={28} color="white" />
        </PressableOpacity>
      )}
    </View>
  )
})

const NowPlayingBar = React.memo(() => {
  const navigation = useNavigation()
  const track = useStore(selectTrackPlayer.currentTrack)

  const displayStyle: ViewStyle = { display: track ? 'flex' : 'none' }

  return (
    <Pressable onPress={() => navigation.navigate('now-playing')} style={[styles.container, displayStyle]}>
      <ProgressBar />
      <View style={styles.subContainer}>
        <CoverArt
          type="cover"
          style={{ height: styles.subContainer.height, width: styles.subContainer.height }}
          coverArt={track?.coverArt}
        />
        <View style={styles.detailsContainer}>
          <Text numberOfLines={1} style={styles.detailsTitle}>
            {track?.title}
          </Text>
          <Text numberOfLines={1} style={styles.detailsAlbum}>
            {track?.artist}
          </Text>
        </View>
        <Controls />
      </View>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.gradient.high,
    borderBottomColor: colors.gradient.low,
    borderBottomWidth: 1,
  },
  subContainer: {
    height: 60,
    flexDirection: 'row',
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginLeft: 10,
  },
  detailsTitle: {
    fontFamily: font.semiBold,
    fontSize: 13,
    color: colors.text.primary,
  },
  detailsAlbum: {
    fontFamily: font.regular,
    fontSize: 13,
    color: colors.text.secondary,
  },
  controls: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    marginLeft: 12,
  },
})

export default NowPlayingBar
