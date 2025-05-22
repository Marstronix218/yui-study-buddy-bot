
export interface Character {
  id: string;
  name: string;
  personality: string;
  catchphrase: string;
  color: string;
}

export const characters: Character[] = [
  {
    id: "haku",
    name: "ハク",
    personality: "論理的",
    catchphrase: "論理的に考えれば、答えは明らかです。",
    color: "bg-blue-100"
  },
  {
    id: "luna",
    name: "ルナ",
    personality: "優しい",
    catchphrase: "一緒に頑張りましょう！応援していますよ。",
    color: "bg-purple-100"
  },
  {
    id: "takumi",
    name: "タクミ",
    personality: "厳格",
    catchphrase: "努力なくして成功なし。さあ、始めましょう。",
    color: "bg-red-100"
  }
];
