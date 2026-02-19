import { AudioSource, createAudioPlayer } from "expo-audio";

export default {
  async playSound(audioSource: AudioSource) {
    try {
      const player = createAudioPlayer(audioSource);
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  },
};
