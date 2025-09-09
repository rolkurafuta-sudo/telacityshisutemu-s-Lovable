import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faTimes, 
  faCheckCircle,
  faTimesCircle,
  faClock,
  faSkull,
  faShield,
  faStar,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';

interface ResultData {
  name: string;
  role: string;
  raid_success: boolean;
  survival_time: number;
  npc_kills: number;
  player_kills: number;
  total_xp_earned: number;
  success_reward: number;
}

interface ResultUIProps {
  data: ResultData;
  onClose: () => void;
}

const ResultUI: React.FC<ResultUIProps> = ({ data, onClose }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateRating = (data: ResultData) => {
    let score = 0;
    
    // 生存時間ボーナス
    score += Math.floor((data.survival_time || 0) / 60) * 10;
    
    // キルボーナス
    score += (data.npc_kills || 0) * 5;
    score += (data.player_kills || 0) * 20;
    
    // 成功ボーナス
    if (data.raid_success) {
      score += 100;
    }
    
    // 評価計算
    if (score >= 200) return { grade: 'S', color: 'text-yellow-400' };
    if (score >= 150) return { grade: 'A', color: 'text-green-400' };
    if (score >= 100) return { grade: 'B', color: 'text-blue-400' };
    if (score >= 50) return { grade: 'C', color: 'text-orange-400' };
    return { grade: 'D', color: 'text-red-400' };
  };

  const rating = calculateRating(data);
  const successClass = data.raid_success ? 'success' : 'failure';
  const successText = data.raid_success ? '成功' : '失敗';
  const successIcon = data.raid_success ? faCheckCircle : faTimesCircle;
  const successColor = data.raid_success ? 'text-accent' : 'text-destructive';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="gaming-container w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="gaming-header">
          <CardTitle className="flex items-center gap-3 text-2xl font-orbitron text-glow-primary">
            <FontAwesomeIcon icon={faTrophy} className="text-primary" />
            レイド結果
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          {/* Result Summary */}
          <Card className={`gaming-card ${data.raid_success ? 'border-accent' : 'border-destructive'}`}>
            <CardContent className="p-6 text-center space-y-4">
              <div className={`text-6xl ${successColor}`}>
                <FontAwesomeIcon icon={successIcon} />
              </div>
              <h3 className={`text-3xl font-orbitron font-bold ${data.raid_success ? 'text-glow-success' : 'text-glow-primary'}`}>
                レイド{successText}
              </h3>
              <div className="space-y-2">
                <p className="text-lg font-semibold">{data.name}</p>
                <p className="text-muted-foreground">({data.role})</p>
              </div>
            </CardContent>
          </Card>

          {/* Result Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="gaming-stat-card">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faClock} className="text-secondary" />
                <h4 className="text-sm text-muted-foreground">生存時間</h4>
              </div>
              <div className="text-2xl font-bold font-orbitron text-secondary">
                {formatTime(data.survival_time || 0)}
              </div>
            </Card>

            <Card className="gaming-stat-card">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faSkull} className="text-destructive" />
                <h4 className="text-sm text-muted-foreground">NPCキル</h4>
              </div>
              <div className="text-2xl font-bold font-orbitron text-destructive">
                {data.npc_kills || 0}
              </div>
            </Card>

            <Card className="gaming-stat-card">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faShield} className="text-primary" />
                <h4 className="text-sm text-muted-foreground">プレイヤーキル</h4>
              </div>
              <div className="text-2xl font-bold font-orbitron text-primary">
                {data.player_kills || 0}
              </div>
            </Card>

            <Card className="gaming-stat-card">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faStar} className="text-accent" />
                <h4 className="text-sm text-muted-foreground">獲得XP</h4>
              </div>
              <div className="text-2xl font-bold font-orbitron text-accent">
                {data.total_xp_earned?.toLocaleString() || 0}
              </div>
            </Card>

            <Card className="gaming-stat-card">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faDollarSign} className="text-secondary" />
                <h4 className="text-sm text-muted-foreground">成功報酬</h4>
              </div>
              <div className="text-2xl font-bold font-orbitron text-secondary">
                ${data.success_reward?.toLocaleString() || 0}
              </div>
            </Card>

            <Card className="gaming-stat-card">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faTrophy} className="text-primary" />
                <h4 className="text-sm text-muted-foreground">総合評価</h4>
              </div>
              <div className={`text-4xl font-bold font-orbitron ${rating.color}`}>
                {rating.grade}
              </div>
            </Card>
          </div>

          {/* Performance Breakdown */}
          <Card className="gaming-card">
            <CardContent className="p-6">
              <h4 className="font-orbitron font-bold text-lg mb-4 text-glow-secondary">パフォーマンス詳細</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>生存時間ボーナス</span>
                  <span className="font-orbitron font-bold">+{Math.floor((data.survival_time || 0) / 60) * 10} pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>NPCキルボーナス</span>
                  <span className="font-orbitron font-bold">+{(data.npc_kills || 0) * 5} pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>プレイヤーキルボーナス</span>
                  <span className="font-orbitron font-bold">+{(data.player_kills || 0) * 20} pts</span>
                </div>
                {data.raid_success && (
                  <div className="flex justify-between items-center text-accent">
                    <span>レイド成功ボーナス</span>
                    <span className="font-orbitron font-bold">+100 pts</span>
                  </div>
                )}
                <hr className="border-border" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>総合スコア</span>
                  <span className={`font-orbitron ${rating.color}`}>
                    {Math.floor((data.survival_time || 0) / 60) * 10 + 
                     (data.npc_kills || 0) * 5 + 
                     (data.player_kills || 0) * 20 + 
                     (data.raid_success ? 100 : 0)} pts
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button 
              variant="gaming" 
              size="xl" 
              onClick={onClose}
              className="min-w-48"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              確認
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultUI;