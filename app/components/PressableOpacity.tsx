import React, { useCallback, useEffect, useState } from 'react'
import { GestureResponderEvent, LayoutRectangle, Pressable, PressableProps, ViewStyle, StyleSheet } from 'react-native'

type PressableOpacityProps = PressableProps & {
  ripple?: boolean
  rippleColor?: string
  unstable_pressDelay?: number
}

const PressableOpacity: React.FC<PressableOpacityProps> = props => {
  const [opacity, setOpacity] = useState(1)
  const [disabledStyle, setDisabledStyle] = useState<ViewStyle>({})
  const [dimensions, setDimensions] = useState<LayoutRectangle | undefined>(undefined)

  useEffect(() => {
    props.disabled === true ? setDisabledStyle({ opacity: 0.3 }) : setDisabledStyle({})
  }, [props.disabled])

  props = {
    ...props,
    unstable_pressDelay: props.unstable_pressDelay === undefined ? 60 : props.unstable_pressDelay,
  }

  const onPressIn = useCallback<(event: GestureResponderEvent) => void>(
    data => {
      if (props.disabled) {
        return
      }
      setOpacity(0.4)
      props.onPressIn ? props.onPressIn(data) : null
    },
    [props],
  )
  const onPressOut = useCallback<(event: GestureResponderEvent) => void>(
    data => {
      if (props.disabled) {
        return
      }
      setOpacity(1)
      props.onPressOut ? props.onPressOut(data) : null
    },
    [props],
  )
  const onLongPress = useCallback<(event: GestureResponderEvent) => void>(
    data => {
      if (props.disabled) {
        return
      }
      setOpacity(1)
      props.onLongPress ? props.onLongPress(data) : null
    },
    [props],
  )

  return (
    <Pressable
      {...props}
      style={[styles.pressable, props.style as any, { opacity }, disabledStyle]}
      android_ripple={
        props.ripple
          ? {
              color: props.rippleColor || 'rgba(255,255,255,0.26)',
              radius: dimensions ? dimensions.width / 2 : undefined,
              borderless: true,
            }
          : undefined
      }
      onLayout={event => setDimensions(event.nativeEvent.layout)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onLongPress={onLongPress}>
      {props.children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default React.memo(PressableOpacity)
