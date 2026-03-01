export interface Challenge {
  id: string;
  title: string;
  category: "Forensics" | "Web" | "Crypto" | "Reverse" | "Misc";
  description: string;
  basePoints: number;
  flag: string;
  hints: [string, string];
  solved: boolean;
  solvedAt?: number;
}

export const challenges: Challenge[] = [
  {
    id: "web-1",
    title: "Hidden in Plain Sight",
    category: "Web",
    description: "A suspicious website has been discovered. The flag is hidden somewhere in the page source. Inspect carefully — not everything is visible to the naked eye.\n\nURL: https://ctf-challenge.example.com/hidden\n\nLook beyond what the browser renders. Developer tools are your friend.",
    basePoints: 100,
    flag: "FLAG{v13w_s0urc3_m4st3r}",
    hints: [
      "Try viewing the page source code. HTML comments can hide secrets.",
      "Look for hidden elements with display:none or visibility:hidden in the CSS."
    ],
    solved: false,
  },
  {
    id: "crypto-1",
    title: "Caesar's Secret",
    category: "Crypto",
    description: "Julius Caesar had a favorite cipher. We intercepted this message:\n\nSYNT{ebg13_vf_sha}\n\nCan you decode it and find the flag?",
    basePoints: 100,
    flag: "FLAG{rot13_is_fun}",
    hints: [
      "This is one of the oldest ciphers in history. It shifts letters by a fixed number.",
      "ROT13 is a special case of Caesar cipher with a shift of 13."
    ],
    solved: false,
  },
  {
    id: "forensics-1",
    title: "Pixel Perfect",
    category: "Forensics",
    description: "An image file was recovered from a compromised server. At first glance it looks normal, but there's more than meets the eye.\n\nAnalyze the image metadata and hidden data layers to extract the flag.",
    basePoints: 100,
    flag: "FLAG{m3tad4ta_h1dd3n}",
    hints: [
      "Image files contain metadata (EXIF data). Tools like exiftool can reveal hidden information.",
      "Try checking the file with steganography tools. The flag might be embedded in the least significant bits."
    ],
    solved: false,
  },
  {
    id: "reverse-1",
    title: "Binary Whispers",
    category: "Reverse",
    description: "A mysterious binary string was found on a hacker's terminal:\n\n01000110 01001100 01000001 01000111 01111011 01100010 00110001 01101110 01100001 01110010 01111001 01011111 01100010 00110000 01110011 01110011 01111101\n\nDecode the whispers.",
    basePoints: 100,
    flag: "FLAG{b1nary_b0ss}",
    hints: [
      "Each group of 8 digits represents one character in binary (ASCII).",
      "Convert each byte from binary to decimal, then to its ASCII character."
    ],
    solved: false,
  },
  {
    id: "misc-1",
    title: "The Missing Piece",
    category: "Misc",
    description: "We found a strange encoded string in a database dump:\n\nRkxBR3tiNHNlNjRfZDNjMGQzfQ==\n\nSomething about this encoding is very... basic.",
    basePoints: 100,
    flag: "FLAG{b4se64_d3c0d3}",
    hints: [
      "The '==' padding at the end is a strong hint about the encoding type.",
      "Base64 is a common encoding scheme. Try decoding it with any Base64 decoder."
    ],
    solved: false,
  },
  {
    id: "web-2",
    title: "Cookie Monster",
    category: "Web",
    description: "A web application stores sensitive data in browser cookies. The admin left something juicy behind.\n\nVisit the login page and inspect what's stored in your cookies. The flag is hiding in plain sight.",
    basePoints: 100,
    flag: "FLAG{c00k13_th13f}",
    hints: [
      "Open DevTools → Application → Cookies to see what's stored.",
      "Look for a cookie named 'secret' or 'admin_flag'. Its value might be encoded."
    ],
    solved: false,
  },
];

export const categoryColors: Record<Challenge["category"], string> = {
  Web: "primary",
  Crypto: "secondary",
  Forensics: "success",
  Reverse: "warning",
  Misc: "muted-foreground",
};
