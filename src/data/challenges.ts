export interface Challenge {
  id: string;
  title: string;
  category: "Forensics" | "Web" | "Crypto" | "Reverse" | "Misc";
  description: string;
  basePoints: number;
  flag: string;
  hints: [string, string];
  hintTimes: [number, number]; // [Hint 1 time in ms, Hint 2 time in ms]
  solved: boolean;
  solvedAt?: number;
  fileUrl?: string;
}

export const challenges: Challenge[] = [
  {
    id: "forensics-1",
    title: "Money Laundering Part 1",
    category: "Forensics",
    description: "A network traffic capture (pcap) was found on a suspicious server. It seems like someone was trying to hide their tracks while transferring digital assets. Can you trace the laundering process?\n\nFile: money_laundering_part1.pcap",
    basePoints: 100,
    flag: "FLAG{D1RT_M0N3Y_H1DD3N_1N_PLA1N_S1GHT}",
    hints: [
      "Open the pcap file in Wireshark and look for common protocols like HTTP or FTP.",
      "Check for exported objects or data streams that might contain the flag."
    ],
    hintTimes: [5 * 60 * 1000, 10 * 60 * 1000], // 5m, 10m
    solved: false,
    fileUrl: "/money_laundering_part1.pcap",
  },
  {
    id: "forensics-2",
    title: "Money Laundering Part 2",
    category: "Forensics",
    description: "The trail continues. The laundered assets are moving through even more complex channels. The second part of the capture contains deeper obfuscation. Find the final destination of the flag.\n\nFile: money_laundering_part2.pcap",
    basePoints: 200,
    flag: "FLAG{G3TT1NG_TUFF3R_3HHEHEHE}",
    hints: [
      "Look for encrypted or unusual traffic. Sometimes data is hidden in the TCP/UDP payload in non-standard ways.",
      "Use 'follow stream' on interesting looking connections to see the full data exchange."
    ],
    hintTimes: [20 * 60 * 1000, 25 * 60 * 1000], // 20m, 25m
    solved: false,
    fileUrl: "/money_laundering_part2.pcap",
  },
  {
    id: "forensics-3",
    title: "Chal.jpg",
    category: "Forensics",
    description: "A simple image file. Or is it? There's a secret hidden within these pixels that only a keen eye—and the right tools—can reveal.\n\nFile: chal.jpg",
    basePoints: 150,
    flag: "FLAG{C0L0R5_OR_WH4TTTTT}",
    hints: [
      "Check the image metadata using strings or exiftool.",
      "Try using steganography tools like steghide or zsteg if the metadata doesn't yield results."
    ],
    hintTimes: [35 * 60 * 1000, 45 * 60 * 1000], // 35m, 45m
    solved: false,
    fileUrl: "/chal.jpg",
  },
];

export const categoryColors: Record<Challenge["category"], string> = {
  Web: "primary",
  Crypto: "secondary",
  Forensics: "warning", // Forensics is yellow/warning in this theme
  Reverse: "warning",
  Misc: "muted-foreground",
};

