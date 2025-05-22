
import { useState, useEffect } from 'react';
import { StudySession, StudyGoal } from '../utils/studyTimer';

export const useStudyTimer = () => {
  const [isStudying, setIsStudying] = useState(false);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [studyGoal, setStudyGoal] = useState<StudyGoal>({
    targetHours: 2,
    completedMinutes: 0
  });
  const [todaySessions, setTodaySessions] = useState<StudySession[]>([]);

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    const loadStudyData = () => {
      try {
        // 学習目標を読み込む
        const savedGoal = localStorage.getItem('studyGoal');
        if (savedGoal) {
          setStudyGoal(JSON.parse(savedGoal));
        }
        
        // 今日のセッションを読み込む
        const savedSessions = localStorage.getItem('todaySessions');
        if (savedSessions) {
          const sessions = JSON.parse(savedSessions);
          // 日付の文字列をDateオブジェクトに変換
          const parsedSessions = sessions.map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined
          }));
          setTodaySessions(parsedSessions);
        }
      } catch (error) {
        console.error('学習データの読み込みに失敗しました:', error);
      }
    };
    
    loadStudyData();
  }, []);

  // データが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('studyGoal', JSON.stringify(studyGoal));
  }, [studyGoal]);

  useEffect(() => {
    localStorage.setItem('todaySessions', JSON.stringify(todaySessions));
  }, [todaySessions]);

  const startStudying = () => {
    const newSession: StudySession = {
      startTime: new Date()
    };
    setCurrentSession(newSession);
    setIsStudying(true);
  };

  const stopStudying = () => {
    if (currentSession) {
      const endTime = new Date();
      const updatedSession: StudySession = {
        ...currentSession,
        endTime,
        duration: Math.round((endTime.getTime() - currentSession.startTime.getTime()) / 60000) // 分に変換
      };
      
      setTodaySessions(prev => [...prev, updatedSession]);
      
      // 完了時間を更新
      setStudyGoal(prev => ({
        ...prev,
        completedMinutes: prev.completedMinutes + (updatedSession.duration || 0)
      }));
      
      setCurrentSession(null);
      setIsStudying(false);
    }
  };

  const updateGoal = (hours: number) => {
    setStudyGoal(prev => ({
      ...prev,
      targetHours: hours
    }));
  };

  const calculateProgress = () => {
    const targetMinutes = studyGoal.targetHours * 60;
    return Math.min(Math.round((studyGoal.completedMinutes / targetMinutes) * 100), 100);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins > 0 ? ` ${mins}分` : ''}`;
  };

  // 日付が変わったら学習記録をリセット
  useEffect(() => {
    const checkDate = () => {
      const lastSessionDate = localStorage.getItem('lastSessionDate');
      const today = new Date().toDateString();
      
      if (lastSessionDate !== today) {
        // 新しい日になったらリセット
        setTodaySessions([]);
        setStudyGoal(prev => ({
          ...prev,
          completedMinutes: 0
        }));
        localStorage.setItem('lastSessionDate', today);
      }
    };
    
    checkDate();
    // 毎日午前0時にチェック
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - Date.now();
    
    const timer = setTimeout(checkDate, timeUntilMidnight);
    return () => clearTimeout(timer);
  }, []);

  return {
    isStudying,
    currentSession,
    studyGoal,
    todaySessions,
    startStudying,
    stopStudying,
    updateGoal,
    calculateProgress,
    formatTime
  };
};
