
// API関連の関数を抽象化
export const fetchChatResponse = async (message: string, characterId: string): Promise<string> => {
  // APIエンドポイントがまだないので、タイムアウトでシミュレート
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${message}についてですね。一緒に勉強していきましょう！`);
    }, 1000);
  });
};
