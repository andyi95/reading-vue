
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function generateEmojiRange(): number[] {
  const emojiis = [
    ...range(0x1F600, 0x1F64F),  // smileyes
    ...range(0x1F680, 0x1F6FF), // transport
    ...range(0x1F90F, 0x1F9A2), // body parts
    ...range(0x1F300, 0x1F320),  // weather
    ...range(0x1F32D, 0x1F392), // food
    ...range(0x1F3A0, 0x1F3C4), // sport
    ...range(0x1F3C6, 0x1F3CA), // music
    ...range(0x1F3E0, 0x1F3F0), // house
    ...range(0x1F400, 0x1F43E), // animals
    ...range(0x1F440, 0x1F440), // eyes
  ];
  const excludeEmojis = [
    0x1F6D3, 0x1F6D6, ...range(0x1f6d7, 0x1f6df),0x1f6fb, 0x1f6fb,
    ...range(0x1f6c6, 0x1f6fc), 0x1f972,
    ...range(0x1f977, 0x1f979), 0x1f946,
    0x1F6D4, ...range(0x1F6D8, 0x1F6DB), ...range(0x1F6ED, 0x1F6EF),
    ...range(0x1F6FD, 0x1F6FF),
  ];
  return emojiis.filter(emoji => !excludeEmojis.includes(emoji));
}
