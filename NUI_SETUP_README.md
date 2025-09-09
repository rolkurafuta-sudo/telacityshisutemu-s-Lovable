# Hazard Zone NUI セットアップガイド

## 概要
このプロジェクトは GTA V 用の Hazard Zone レイドシステム NUI インターフェースです。React、TypeScript、Tailwind CSS で構築された高性能でレスポンシブなゲーミング UI を提供します。

## 🎮 機能

### 主要機能
- **レイド参加UI**: ロール選択（SCAV/PMC）と武器パック選択
- **ランキングシステム**: 総合・週間・月間ランキング表示
- **スキル管理**: スキルポイント配分と専用職業システム
- **リザルト表示**: 詳細なレイド結果と評価システム
- **通知システム**: リアルタイム通知とフィードバック

### デザイン特徴
- **ミリタリーテーマ**: 戦術的でプロフェッショナルなデザイン
- **ダークモード**: ゲーミングに最適化された暗いテーマ
- **レスポンシブ**: 全ての画面サイズに対応
- **アニメーション**: スムーズなトランジションとエフェクト
- **グロー効果**: 未来的なゲーミング UI エフェクト

## 📁 ファイル構成

### FiveM リソースフォルダ構成
```
resources/
└── hazard_zone/
    ├── fxmanifest.lua
    ├── server/
    │   └── server.lua
    ├── client/
    │   └── client.lua
    └── html/
        ├── index.html
        ├── assets/
        │   ├── index-[hash].js
        │   └── index-[hash].css
        └── (その他のビルドファイル)
```

## 🚀 セットアップ手順

### 1. NUI ファイルの準備

#### ビルドの実行
```bash
npm run build
```

#### ビルドファイルのコピー
`dist/` フォルダの内容を FiveM リソースの `html/` フォルダにコピー：

```
hazard_zone/html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── (その他のアセット)
└── (その他のビルドファイル)
```

### 2. FiveM リソース設定

#### fxmanifest.lua
```lua
fx_version 'cerulean'
game 'gta5'

author 'Your Name'
description 'Hazard Zone - Advanced Raid System'
version '1.0.0'

-- NUI ファイル
ui_page 'html/index.html'

files {
    'html/index.html',
    'html/assets/**/*',
    'html/**/*'
}

-- スクリプトファイル
client_scripts {
    'client/client.lua'
}

server_scripts {
    'server/server.lua'
}

-- 依存関係（必要に応じて）
dependencies {
    'mysql-async',  -- データベース使用時
    'oxmysql',      -- または oxmysql
}
```

### 3. Lua スクリプト例

#### client/client.lua (基本テンプレート)
```lua
local nuiOpen = false

-- NUI メッセージ送信
function SendNUIMessage(type, data)
    SendNUIMessage({
        type = type,
        data = data
    })
end

-- UI 表示関数
function ShowRaidJoinUI(data)
    if not nuiOpen then
        nuiOpen = true
        SetNuiFocus(true, true)
        SendNUIMessage('showRaidJoin', data)
    end
end

function ShowRankingUI(data)
    if not nuiOpen then
        nuiOpen = true
        SetNuiFocus(true, true)
        SendNUIMessage('showRanking', data)
    end
end

function ShowSkillManagerUI(data)
    if not nuiOpen then
        nuiOpen = true
        SetNuiFocus(true, true)
        SendNUIMessage('showSkillManager', data)
    end
end

function ShowResultUI(data)
    if not nuiOpen then
        nuiOpen = true
        SetNuiFocus(true, true)
        SendNUIMessage('showResult', data)
    end
end

-- UI 閉じる
function CloseUI()
    if nuiOpen then
        nuiOpen = false
        SetNuiFocus(false, false)
        SendNUIMessage('hideUI', {})
    end
end

-- NUI コールバック登録
RegisterNUICallback('closeUI', function(data, cb)
    CloseUI()
    cb('ok')
end)

RegisterNUICallback('joinRaid', function(data, cb)
    -- レイド参加処理
    TriggerServerEvent('hazard:joinRaid', data.role, data.weaponPack)
    cb('ok')
end)

RegisterNUICallback('allocateSkillPoints', function(data, cb)
    -- スキルポイント配分処理
    TriggerServerEvent('hazard:allocateSkillPoints', data.skillName, data.points)
    cb('ok')
end)

RegisterNUICallback('resetSkills', function(data, cb)
    -- スキルリセット処理
    TriggerServerEvent('hazard:resetSkills')
    cb('ok')
end)

RegisterNUICallback('changeSpecialJob', function(data, cb)
    -- 職業変更処理
    TriggerServerEvent('hazard:changeSpecialJob', data.jobName)
    cb('ok')
end)

-- コマンド例
RegisterCommand('hazard:raid', function()
    local weaponPacks = {
        pack1 = { label = "基本パック", weapon = "AK-47", ammo = 120 },
        pack2 = { label = "スナイパーパック", weapon = "AWP", ammo = 50 },
        pack3 = { label = "SMGパック", weapon = "MP5", ammo = 180 }
    }
    ShowRaidJoinUI({ weaponPacks = weaponPacks })
end)

RegisterCommand('hazard:ranking', function()
    -- サーバーからランキングデータを取得
    TriggerServerEvent('hazard:getRanking')
end)

RegisterCommand('hazard:skills', function()
    -- サーバーからスキルデータを取得
    TriggerServerEvent('hazard:getSkillData')
end)

-- サーバーイベント
RegisterNetEvent('hazard:showRanking')
AddEventHandler('hazard:showRanking', function(rankingData)
    ShowRankingUI(rankingData)
end)

RegisterNetEvent('hazard:showSkillData')
AddEventHandler('hazard:showSkillData', function(skillData)
    ShowSkillManagerUI(skillData)
end)

RegisterNetEvent('hazard:showRaidResult')
AddEventHandler('hazard:showRaidResult', function(resultData)
    ShowResultUI(resultData)
end)

-- 通知表示
RegisterNetEvent('hazard:showNotification')
AddEventHandler('hazard:showNotification', function(message, type)
    SendNUIMessage('showNotification', { message = message, type = type })
end)
```

#### server/server.lua (基本テンプレート)
```lua
-- レイド参加処理
RegisterServerEvent('hazard:joinRaid')
AddEventHandler('hazard:joinRaid', function(role, weaponPack)
    local source = source
    local player = GetPlayerName(source)
    
    -- レイド参加ロジック
    print(string.format('%s がレイドに参加: Role=%s, WeaponPack=%s', player, role, weaponPack or 'なし'))
    
    -- 成功通知
    TriggerClientEvent('hazard:showNotification', source, 'レイドに参加しました！', 'success')
end)

-- ランキング取得
RegisterServerEvent('hazard:getRanking')
AddEventHandler('hazard:getRanking', function()
    local source = source
    
    -- データベースからランキングデータを取得
    local rankingData = {
        { name = "プレイヤー1", xp_total = 15000, level = 25, raids_completed = 45, escapes_success = 30 },
        { name = "プレイヤー2", xp_total = 12500, level = 22, raids_completed = 38, escapes_success = 25 },
        { name = "プレイヤー3", xp_total = 11000, level = 20, raids_completed = 35, escapes_success = 22 }
    }
    
    TriggerClientEvent('hazard:showRanking', source, rankingData)
end)

-- スキルデータ取得
RegisterServerEvent('hazard:getSkillData')
AddEventHandler('hazard:getSkillData', function()
    local source = source
    
    -- プレイヤーのスキルデータを取得
    local skillData = {
        stats = {
            level = 15,
            xp_total = 8500,
            skill_points = 5,
            npc_kills = 125,
            player_kills = 8,
            raids_completed = 20,
            escapes_success = 15,
            skills = '{"combat": 3, "stealth": 2, "medical": 1}',
            job = nil
        },
        skills = {
            combat = { label = "戦闘", description = "武器ダメージ +10%", max_level = 5 },
            stealth = { label = "ステルス", description = "隠密性向上", max_level = 5 },
            medical = { label = "医療", description = "回復効果 +20%", max_level = 5 }
        },
        specialJobs = {
            medic = {
                label = "メディック",
                description = "チーム回復スペシャリスト",
                requirements = { level = 10, raids_completed = 5 }
            },
            sniper = {
                label = "スナイパー",
                description = "長距離戦闘エキスパート",
                requirements = { level = 15, player_kills = 5 }
            }
        }
    }
    
    TriggerClientEvent('hazard:showSkillData', source, skillData)
end)
```

## 🎨 カスタマイズ

### テーマ色の変更
`src/index.css` で色を変更：

```css
:root {
    --gaming-accent-orange: 25 95% 53%;    /* プライマリ色 */
    --gaming-accent-blue: 217 91% 60%;     /* セカンダリ色 */
    --gaming-accent-green: 142 76% 36%;    /* 成功色 */
    /* ... その他の色 */
}
```

### フォントの変更
Google Fonts からインポート：

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;500;600;700&display=swap');
```

## 🔧 開発環境

### 必要な環境
- Node.js 18+
- npm または yarn
- 現代的なブラウザ

### 開発サーバー起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

## 📱 レスポンシブ対応

この NUI は以下の画面サイズに対応しています：
- モバイル (320px+)
- タブレット (768px+)
- デスクトップ (1024px+)
- ウルトラワイド (1920px+)

## 🛠️ トラブルシューティング

### よくある問題

#### NUI が表示されない
- `html/index.html` が正しい場所にあるか確認
- `fxmanifest.lua` の `files` セクションが正しいか確認
- F8 コンソールでエラーをチェック

#### スタイルが適用されない
- CSS ファイルが正しくコピーされているか確認
- ブラウザキャッシュをクリア
- ビルドファイルのハッシュが更新されているか確認

#### JavaScript エラー
- F12 開発者ツールでエラーをチェック
- NUI コールバックが正しく登録されているか確認

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🤝 サポート

問題や質問がある場合は、開発チームにお問い合わせください。

---

**注意**: このNUIはゲーム内での使用を想定して作成されています。開発環境では一部の機能が制限される場合があります。