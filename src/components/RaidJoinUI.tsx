import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCrosshairs, 
  faTimes, 
  faSkull, 
  faShieldAlt, 
  faGun, 
  faPlay,
  faUserTag,
  faUser,
  faUsers,
  faPlus,
  faCrown,
  faUserMinus,
  faCheck,
  faClock
} from '@fortawesome/free-solid-svg-icons';

interface WeaponPack {
  label: string;
  weapon: string;
  ammo: number;
}

interface RaidJoinData {
  weaponPacks?: Record<string, WeaponPack>;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  isReady: boolean;
  isLeader: boolean;
}

interface RaidJoinUIProps {
  data?: RaidJoinData;
  onClose: () => void;
  onJoinRaid: (role: string, weaponPack?: string, gameMode?: string, teamName?: string) => void;
}

const RaidJoinUI: React.FC<RaidJoinUIProps> = ({ data, onClose, onJoinRaid }) => {
  const [step, setStep] = useState<'role' | 'gameMode' | 'teamSetup' | 'waiting'>('role');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedWeaponPack, setSelectedWeaponPack] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string>('');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'プレイヤー1', role: 'SCAV', isReady: false, isLeader: true },
    { id: '2', name: 'プレイヤー2', role: 'PMC', isReady: true, isLeader: false },
  ]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    if (role !== 'SCAV') {
      setSelectedWeaponPack(null);
    }
  };

  const handleGameModeSelect = (mode: string) => {
    setGameMode(mode);
    if (mode === 'solo') {
      setStep('waiting');
    } else if (mode === 'createTeam') {
      setStep('teamSetup');
    } else {
      setStep('waiting');
    }
  };

  const handleCreateTeam = () => {
    if (!teamName.trim()) return;
    setStep('waiting');
  };

  const handleStartRaid = () => {
    onJoinRaid(selectedRole!, selectedWeaponPack || undefined, gameMode!, teamName || undefined);
  };

  const handleKickPlayer = (playerId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== playerId));
  };

  const toggleReady = () => {
    setIsReady(!isReady);
  };

  const canProceedFromRole = selectedRole && (selectedRole !== 'SCAV' || selectedWeaponPack);
  const canCreateTeam = teamName.trim().length > 0;
  const isLeader = teamMembers.find(m => m.isLeader)?.id === '1'; // Assuming current player is id '1'
  const allReady = teamMembers.every(member => member.isReady || member.isLeader);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="gaming-container w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="gaming-header">
          <CardTitle className="flex items-center gap-3 text-2xl font-orbitron text-glow-primary">
            <FontAwesomeIcon icon={faCrosshairs} className="text-primary" />
            レイド参加
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
          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <>
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-xl font-orbitron text-glow-secondary">
                  <FontAwesomeIcon icon={faUserTag} className="text-secondary" />
                  ロール選択
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card 
                    className={`gaming-card cursor-pointer ${selectedRole === 'SCAV' ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect('SCAV')}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="text-4xl text-primary">
                        <FontAwesomeIcon icon={faSkull} />
                      </div>
                      <h4 className="text-xl font-orbitron font-bold">SCAV</h4>
                      <p className="text-muted-foreground">スカブハンター</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>最大人数:</span>
                          <span className="font-bold text-primary">6人</span>
                        </div>
                        <div className="text-secondary">基本装備付与</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`gaming-card cursor-pointer ${selectedRole === 'PMC' ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect('PMC')}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="text-4xl text-secondary">
                        <FontAwesomeIcon icon={faShieldAlt} />
                      </div>
                      <h4 className="text-xl font-orbitron font-bold">PMC</h4>
                      <p className="text-muted-foreground">プライベート軍事会社</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>最大人数:</span>
                          <span className="font-bold text-secondary">4人</span>
                        </div>
                        <div className="text-accent">高級装備</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Weapon Pack Selection (SCAV only) */}
              {selectedRole === 'SCAV' && (
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-xl font-orbitron text-glow-success">
                    <FontAwesomeIcon icon={faGun} className="text-accent" />
                    武器パック選択
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.weaponPacks && Object.entries(data.weaponPacks).map(([key, pack]) => (
                      <Card 
                        key={key}
                        className={`gaming-card cursor-pointer ${selectedWeaponPack === key ? 'selected' : ''}`}
                        onClick={() => setSelectedWeaponPack(key)}
                      >
                        <CardContent className="p-4 space-y-2">
                          <h4 className="font-orbitron font-semibold">{pack.label}</h4>
                          <p className="text-sm text-muted-foreground">{pack.weapon || '基本装備'}</p>
                          <p className="text-sm">弾薬: <span className="text-primary font-bold">{pack.ammo || 0}発</span></p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button 
                  variant="gaming" 
                  size="xl" 
                  onClick={() => setStep('gameMode')}
                  disabled={!canProceedFromRole}
                  className="min-w-48"
                >
                  次へ
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Game Mode Selection */}
          {step === 'gameMode' && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-xl font-orbitron text-glow-secondary">
                <FontAwesomeIcon icon={faUsers} className="text-secondary" />
                ゲームモード選択
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card 
                  className={`gaming-card cursor-pointer ${gameMode === 'solo' ? 'selected' : ''}`}
                  onClick={() => handleGameModeSelect('solo')}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-4xl text-primary">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <h4 className="text-lg font-orbitron font-bold">ソロ</h4>
                    <p className="text-muted-foreground text-sm">一人でレイドに参加</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`gaming-card cursor-pointer ${gameMode === 'createTeam' ? 'selected' : ''}`}
                  onClick={() => handleGameModeSelect('createTeam')}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-4xl text-secondary">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <h4 className="text-lg font-orbitron font-bold">チーム作成</h4>
                    <p className="text-muted-foreground text-sm">新しいチームを作成</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`gaming-card cursor-pointer ${gameMode === 'joinTeam' ? 'selected' : ''}`}
                  onClick={() => handleGameModeSelect('joinTeam')}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-4xl text-accent">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <h4 className="text-lg font-orbitron font-bold">チーム参加</h4>
                    <p className="text-muted-foreground text-sm">既存のチームに参加</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setStep('role')}
                >
                  戻る
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Team Setup (Create Team only) */}
          {step === 'teamSetup' && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-xl font-orbitron text-glow-secondary">
                <FontAwesomeIcon icon={faPlus} className="text-secondary" />
                チーム作成
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">チーム名</label>
                  <Input
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="チーム名を入力してください..."
                    className="gaming-input"
                    maxLength={20}
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setStep('gameMode')}
                >
                  戻る
                </Button>
                <Button 
                  variant="gaming" 
                  size="lg" 
                  onClick={handleCreateTeam}
                  disabled={!canCreateTeam}
                >
                  チーム作成
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Waiting Room */}
          {step === 'waiting' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="flex items-center justify-center gap-2 text-xl font-orbitron text-glow-secondary">
                  <FontAwesomeIcon icon={faClock} className="text-secondary" />
                  {gameMode === 'solo' ? 'ソロレイド' : `チーム: ${teamName || '待機中'}`}
                </h3>
                <p className="text-muted-foreground">
                  {gameMode === 'solo' ? 'レイド開始の準備ができました' : 'チームメンバーを待機中...'}
                </p>
              </div>

              {/* Team Members (Team mode only) */}
              {gameMode !== 'solo' && (
                <div className="space-y-4">
                  <h4 className="font-orbitron font-semibold">チームメンバー</h4>
                  <div className="space-y-2">
                    {teamMembers.map((member) => (
                      <Card key={member.id} className="gaming-card">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {member.isLeader && (
                                <FontAwesomeIcon icon={faCrown} className="text-accent" />
                              )}
                              <span className="font-medium">{member.name}</span>
                              <span className="text-sm text-muted-foreground">({member.role})</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 text-sm ${member.isReady ? 'text-success' : 'text-warning'}`}>
                              <FontAwesomeIcon icon={member.isReady ? faCheck : faClock} />
                              {member.isReady ? '準備完了' : '準備中'}
                            </div>
                            
                            {isLeader && !member.isLeader && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleKickPlayer(member.id)}
                              >
                                <FontAwesomeIcon icon={faUserMinus} />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Ready/Start Controls */}
              <div className="flex justify-center gap-4 pt-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={onClose}
                >
                  キャンセル
                </Button>
                
                {gameMode === 'solo' ? (
                  <Button 
                    variant="gaming" 
                    size="lg" 
                    onClick={handleStartRaid}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                    出撃
                  </Button>
                ) : isLeader ? (
                  <Button 
                    variant="gaming" 
                    size="lg" 
                    onClick={handleStartRaid}
                    disabled={!allReady}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                    出撃
                  </Button>
                ) : (
                  <Button 
                    variant={isReady ? "gaming-success" : "gaming"} 
                    size="lg" 
                    onClick={toggleReady}
                  >
                    <FontAwesomeIcon icon={isReady ? faCheck : faClock} />
                    {isReady ? '準備完了' : '準備中'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RaidJoinUI;