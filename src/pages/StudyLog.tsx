
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useStudyTimer } from "@/shared/studyTimerLogic";

const StudyLog = () => {
  const {
    isStudying,
    currentSession,
    studyGoal,
    todaySessions,
    startStudying,
    stopStudying,
    calculateProgress,
    formatTime
  } = useStudyTimer();

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center mb-8">学習記録</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">今日の学習目標</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between mb-1">
                <span>目標: {studyGoal.targetHours}時間</span>
                <span>達成: {formatTime(studyGoal.completedMinutes)}</span>
              </div>
              <Progress value={calculateProgress()} className="h-3" />
              
              {isStudying ? (
                <div className="bg-green-50 border border-green-100 rounded-md p-3 text-center">
                  <p className="text-green-700 mb-2">学習中...</p>
                  <p className="text-sm text-green-600">
                    開始時間: {currentSession?.startTime.toLocaleTimeString('ja-JP')}
                  </p>
                </div>
              ) : null}
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {isStudying ? (
                  <Button 
                    onClick={stopStudying} 
                    variant="outline" 
                    className="w-full"
                  >
                    学習終了
                  </Button>
                ) : (
                  <Button 
                    onClick={startStudying} 
                    className="w-full"
                  >
                    学習開始
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {todaySessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">今日の学習セッション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySessions.map((session, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex justify-between text-sm">
                      <span>
                        {session.startTime.toLocaleTimeString('ja-JP')} - {session.endTime?.toLocaleTimeString('ja-JP')}
                      </span>
                      <span className="font-medium">
                        {formatTime(session.duration || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default StudyLog;
