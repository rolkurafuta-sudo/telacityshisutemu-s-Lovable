import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCogs, 
  faTimes, 
  faChartLine, 
  faBrain,
  faBriefcase,
  faUndo,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';

interface PlayerStats {
  level: number;
  xp_total: number;
  skill_points: number;
  npc_kills: number;
  player_kills: number;
  raids_completed: number;
  escapes_success: number;
  skills: string;
  job?: string;
}

interface Skill {
  label: string;
  description: string;
  max_level: number;
}

interface SpecialJob {
  label: string;
  description: string;
  requirements: Record<string, number>;
}

interface SkillManagerData {
  stats: PlayerStats;
  skills: Record<string, Skill>;
  specialJobs: Record<string, SpecialJob>;
}

interface SkillManagerUIProps {
  data: SkillManagerData;
  onClose: () => void;
  onAllocateSkill: (skillName: string, points: number) => void;
  onResetSkills: () => void;
  onChangeJob: (jobName: string) => void;
}

const SkillManagerUI: React.FC<SkillManagerUIProps> = ({ 
  data, 
  onClose, 
  onAllocateSkill, 
  onResetSkills, 
  onChangeJob 
}) => {
  const currentSkills = JSON.parse(data.stats.skills || '{}');

  const checkJobRequirements = (requirements: Record<string, number>) => {
    return Object.entries(requirements).every(([key, value]) => {
      const currentValue = (data.stats as any)[key] || 0;
      return currentValue >= value;
    });
  };

  const getRequirementLabel = (key: string) => {
    const labels: Record<string, string> = {
      level: 'レベル',
      npc_kills: 'NPCキル数',
      player_kills: 'プレイヤーキル数',
      raids_completed: 'レイド完了数',
      escapes_success: '脱出成功数'
    };
    return labels[key] || key;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="gaming-container w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="gaming-header">
          <CardTitle className="flex items-center gap-3 text-2xl font-orbitron text-glow-primary">
            <FontAwesomeIcon icon={faCogs} className="text-primary" />
            スキル・職業管理
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
          {/* Player Statistics */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-orbitron text-glow-secondary">
              <FontAwesomeIcon icon={faChartLine} className="text-secondary" />
              プレイヤー統計
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <Card className="gaming-stat-card">
                <h4 className="text-sm text-muted-foreground mb-2">レベル</h4>
                <div className="text-2xl font-bold font-orbitron text-primary">{data.stats.level || 1}</div>
              </Card>
              <Card className="gaming-stat-card">
                <h4 className="text-sm text-muted-foreground mb-2">総XP</h4>
                <div className="text-2xl font-bold font-orbitron text-secondary">{data.stats.xp_total?.toLocaleString() || 0}</div>
              </Card>
              <Card className="gaming-stat-card">
                <h4 className="text-sm text-muted-foreground mb-2">スキルポイント</h4>
                <div className="text-2xl font-bold font-orbitron text-accent">{data.stats.skill_points || 0}</div>
              </Card>
              <Card className="gaming-stat-card">
                <h4 className="text-sm text-muted-foreground mb-2">NPCキル</h4>
                <div className="text-2xl font-bold font-orbitron text-destructive">{data.stats.npc_kills || 0}</div>
              </Card>
              <Card className="gaming-stat-card">
                <h4 className="text-sm text-muted-foreground mb-2">プレイヤーキル</h4>
                <div className="text-2xl font-bold font-orbitron text-primary">{data.stats.player_kills || 0}</div>
              </Card>
              <Card className="gaming-stat-card">
                <h4 className="text-sm text-muted-foreground mb-2">レイド完了</h4>
                <div className="text-2xl font-bold font-orbitron text-secondary">{data.stats.raids_completed || 0}</div>
              </Card>
              <Card className="gaming-stat-card">
                <h4 className="text-sm text-muted-foreground mb-2">脱出成功</h4>
                <div className="text-2xl font-bold font-orbitron text-accent">{data.stats.escapes_success || 0}</div>
              </Card>
            </div>
          </div>

          {/* Skill Allocation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-orbitron text-glow-success">
                <FontAwesomeIcon icon={faBrain} className="text-accent" />
                スキル配分
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  利用可能ポイント: <strong className="text-accent font-orbitron">{data.stats.skill_points || 0}</strong>
                </span>
                <Button 
                  variant="gaming-secondary" 
                  size="sm"
                  onClick={onResetSkills}
                >
                  <FontAwesomeIcon icon={faUndo} />
                  スキルリセット
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.skills).map(([skillKey, skill]) => {
                const currentLevel = currentSkills[skillKey] || 0;
                const canIncrease = (data.stats.skill_points || 0) > 0 && currentLevel < skill.max_level;
                const canDecrease = currentLevel > 0;

                return (
                  <Card key={skillKey} className="gaming-card">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-orbitron font-semibold">{skill.label}</h4>
                        <span className="text-sm text-muted-foreground">Lv.{currentLevel}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="gaming-danger"
                            size="sm"
                            onClick={() => onAllocateSkill(skillKey, -1)}
                            disabled={!canDecrease}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </Button>
                          <Button
                            variant="gaming-success"
                            size="sm"
                            onClick={() => onAllocateSkill(skillKey, 1)}
                            disabled={!canIncrease}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </div>
                        <div className="text-sm font-orbitron">
                          {currentLevel}/{skill.max_level}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Special Jobs */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-orbitron text-glow-primary">
              <FontAwesomeIcon icon={faBriefcase} className="text-primary" />
              専用職業
            </h3>
            
            {/* Current Job */}
            <Card className="gaming-card">
              <CardContent className="p-4">
                {data.stats.job && data.specialJobs[data.stats.job] ? (
                  <div>
                    <h4 className="font-orbitron font-bold text-lg mb-2">
                      現在の職業: {data.specialJobs[data.stats.job].label}
                    </h4>
                    <p className="text-muted-foreground">{data.specialJobs[data.stats.job].description}</p>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-orbitron font-bold text-lg mb-2">現在の職業: なし</h4>
                    <p className="text-muted-foreground">専用職業を選択してください</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Jobs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.specialJobs).map(([jobKey, job]) => {
                const isCurrentJob = data.stats.job === jobKey;
                const isAvailable = checkJobRequirements(job.requirements);

                return (
                  <Card key={jobKey} className={`gaming-card ${isAvailable ? 'border-accent' : 'opacity-60'}`}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-orbitron font-bold">{job.label}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isCurrentJob ? 'bg-primary text-primary-foreground' : 
                          isAvailable ? 'bg-accent text-accent-foreground' : 
                          'bg-muted text-muted-foreground'
                        }`}>
                          {isCurrentJob ? '現在' : isAvailable ? '利用可能' : '要件未達成'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold">要件:</h5>
                        {Object.entries(job.requirements).map(([reqKey, reqValue]) => {
                          const currentValue = (data.stats as any)[reqKey] || 0;
                          const isFulfilled = currentValue >= reqValue;
                          
                          return (
                            <div key={reqKey} className={`flex justify-between text-xs ${
                              isFulfilled ? 'text-accent' : 'text-destructive'
                            }`}>
                              <span>{getRequirementLabel(reqKey)}</span>
                              <span>{currentValue}/{reqValue}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {isAvailable && !isCurrentJob && (
                        <Button 
                          variant="gaming" 
                          size="sm" 
                          onClick={() => onChangeJob(jobKey)}
                          className="w-full mt-3"
                        >
                          職業を変更
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillManagerUI;