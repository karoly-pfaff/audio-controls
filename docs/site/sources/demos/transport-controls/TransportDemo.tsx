import { useState } from 'react';
import type { ReactElement } from 'react';
import { TransportControls } from '@karoly-pfaff/audio-controls';

export function TransportDemo(): ReactElement {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(30);
  return (
    <div className="demo-stack">
      <TransportControls
        playing={playing}
        playable
        disabled={false}
        play={() => {
          setPlaying(true);
        }}
        pause={() => {
          setPlaying(false);
        }}
        stop={() => {
          setPlaying(false);
          setPosition(0);
        }}
        seekToStart={() => {
          setPosition(0);
        }}
        jumpBack={() => {
          setPosition(Math.max(0, position - 5));
        }}
        jumpForward={() => {
          setPosition(Math.min(120, position + 5));
        }}
      />
      <output>
        {playing ? 'Playing' : 'Paused'} · position {position}s
      </output>
      <small>State demonstration only. No audio is loaded or played.</small>
    </div>
  );
}
