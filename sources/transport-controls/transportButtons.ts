import type { TransportButtonProps } from '../transport-button/TransportButton.tsx';
import type { TransportControlsProps } from './TransportControls.tsx';

export function transportButtons(props: TransportControlsProps): readonly TransportButtonProps[] {
  const navigation = [
    {
      icon: 'restart',
      label: 'Restart from beginning',
      title: 'Restart from beginning (Home)',
      onClick: props.seekToStart,
    },
    {
      icon: 'back',
      label: 'Jump back 5 seconds',
      title: 'Jump back 5s (←)',
      onClick: props.jumpBack,
    },
    { icon: 'stop', label: 'Stop playback', title: 'Stop (Esc)', onClick: props.stop },
    {
      icon: 'forward',
      label: 'Jump forward 5 seconds',
      title: 'Jump forward 5s (→)',
      onClick: props.jumpForward,
    },
  ] as const;
  const buttons: TransportButtonProps[] = navigation.map((button) => ({
    ...button,
    disabled: props.disabled,
  }));
  buttons.splice(2, 0, {
    icon: props.playing ? 'pause' : 'play',
    label: props.playing ? 'Pause playback' : 'Play',
    title: props.playing ? 'Pause (Space)' : 'Play (Space)',
    active: props.playing,
    disabled: props.disabled || !props.playable,
    onClick: props.playing ? props.pause : props.play,
  });
  return buttons;
}
