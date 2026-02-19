import { EMOJI_MAP } from "@/constants/emojis";

export default {
  getEmojiForAverage: (average: number) => {
    const rounded = Math.round(average);
    return EMOJI_MAP[rounded] || "😶";
  },
};
