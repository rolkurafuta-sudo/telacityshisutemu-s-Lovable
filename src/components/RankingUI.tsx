import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faTimes, 
  faCrown, 
  faCalendarWeek, 
  faCalendarAlt,
  faMedal
} from '@fortawesome/free-solid-svg-icons';

interface PlayerRanking {
  name: string;
  xp_total: number;
  level: number;
  raids_completed: number;
  escapes_success: number;
}

interface RankingUIProps {
  data: PlayerRanking[];
  onClose: () => void;
}

const RankingUI: React.FC<RankingUIProps> = ({ data, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overall' | 'weekly' | 'monthly'>('overall');

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <FontAwesomeIcon icon={faCrown} className="text-yellow-400" />;
    if (rank === 2) return <FontAwesomeIcon icon={faMedal} className="text-gray-300" />;
    if (rank === 3) return <FontAwesomeIcon icon={faMedal} className="text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankCardClass = (rank: number) => {
    if (rank === 1) return 'border-yellow-400 bg-yellow-400/10';
    if (rank === 2) return 'border-gray-300 bg-gray-300/10';
    if (rank === 3) return 'border-amber-600 bg-amber-600/10';
    return '';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="gaming-container w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="gaming-header">
          <CardTitle className="flex items-center gap-3 text-2xl font-orbitron text-glow-primary">
            <FontAwesomeIcon icon={faTrophy} className="text-primary" />
            ランキング・戦績
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
        
        <CardContent className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 border-b border-border">
            <button
              className={`gaming-tab ${activeTab === 'overall' ? 'active' : ''}`}
              onClick={() => setActiveTab('overall')}
            >
              <FontAwesomeIcon icon={faCrown} className="mr-2" />
              総合ランキング
            </button>
            <button
              className={`gaming-tab ${activeTab === 'weekly' ? 'active' : ''}`}
              onClick={() => setActiveTab('weekly')}
            >
              <FontAwesomeIcon icon={faCalendarWeek} className="mr-2" />
              週間ランキング
            </button>
            <button
              className={`gaming-tab ${activeTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              月間ランキング
            </button>
          </div>

          {/* Ranking List */}
          <div className="space-y-4">
            {data && data.length > 0 ? (
              data.map((player, index) => {
                const rank = index + 1;
                return (
                  <Card 
                    key={index} 
                    className={`gaming-rank-item ${getRankCardClass(rank)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12">
                            {getRankIcon(rank)}
                          </div>
                          <div>
                            <h4 className="font-orbitron font-bold text-lg">{player.name}</h4>
                            <p className="text-sm text-muted-foreground">レベル {player.level}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="gaming-stat-card">
                            <div className="text-sm text-muted-foreground">総XP</div>
                            <div className="text-lg font-bold text-primary">{player.xp_total?.toLocaleString() || 0}</div>
                          </div>
                          <div className="gaming-stat-card">
                            <div className="text-sm text-muted-foreground">レベル</div>
                            <div className="text-lg font-bold text-secondary">{player.level || 1}</div>
                          </div>
                          <div className="gaming-stat-card">
                            <div className="text-sm text-muted-foreground">レイド</div>
                            <div className="text-lg font-bold text-accent">{player.raids_completed || 0}</div>
                          </div>
                          <div className="gaming-stat-card">
                            <div className="text-sm text-muted-foreground">脱出</div>
                            <div className="text-lg font-bold text-destructive">{player.escapes_success || 0}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="gaming-rank-item">
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <FontAwesomeIcon icon={faTrophy} className="text-4xl mb-4" />
                    <p>ランキングデータがありません</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingUI;