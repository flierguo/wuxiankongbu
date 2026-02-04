# Requirements Document

## Introduction

本文档定义了生物属性与装备数值平衡优化的需求。目标是简化计算逻辑、降低CPU消耗、建立清晰的数值关系，使游戏难度曲线更加平滑可控。

## 当前问题分析

### 问题1: 生物属性计算过于复杂（7次大数值乘法）
```
血量 = 基础值 × 生物强度 × 星级难度 × TAG倍数 × 血量额外倍数 × 变异倍数 × 随机倍数
```

### 问题2: 星级难度计算导致数值爆炸
- 浣熊市固定星级101: `2^(101-1) = 2^100 = 1.27e30`（天文数字！）
- 这导致生物属性远超合理范围

### 问题3: TAG倍数配置不合理
- TAG6(大陆BOSS)=30, TAG7(特殊BOSS)=15
- 特殊BOSS应该比大陆BOSS强，但配置相反

### 问题4: 变异倍数配置键名错误
- 代码使用 '1-4', '2-6' 等键名
- 配置表定义的是 '1-2', '2-3' 等
- 导致变异系统无法正常工作

### 问题5: 生物与装备增长不平衡
- 生物强度：指数增长 `2^(地图强度-1)`
- 装备属性：线性增长（1-5倍）
- 高难度地图生物强度远超装备提升

## Glossary

- **Balance_System**: 数值平衡系统，负责统一管理生物属性和装备属性的计算
- **Creature_Attribute**: 生物属性计算模块，计算怪物的血量、攻击、防御等
- **Equipment_Attribute**: 装备属性计算模块，计算装备掉落时的属性值
- **Anchor_System**: 锚点系统，作为生物和装备数值的桥梁
- **Map_Difficulty**: 地图难度配置，包含地图强度、固定星级等
- **TAG_Multiplier**: TAG倍数，根据怪物类型(1-7)决定的属性倍数

## Requirements

### Requirement 1: 简化生物属性计算

**User Story:** As a 服务器管理员, I want 生物属性计算更简洁高效, so that 降低CPU单核消耗并提高服务器性能。

#### Acceptance Criteria

1. WHEN 生物刷新时, THE Creature_Attribute SHALL 使用不超过3次大数值乘法计算血量
2. WHEN 生物刷新时, THE Creature_Attribute SHALL 使用不超过3次大数值乘法计算攻击
3. WHEN 生物刷新时, THE Creature_Attribute SHALL 使用不超过3次大数值乘法计算防御
4. THE Creature_Attribute SHALL 移除冗余的倍数配置，合并为统一的地图难度倍数

### Requirement 2: 统一数值倍数配置

**User Story:** As a 游戏策划, I want 所有数值倍数集中在一个配置表中, so that 方便调整游戏平衡。

#### Acceptance Criteria

1. THE Balance_System SHALL 在世界配置中定义统一的难度倍数表
2. WHEN 配置难度倍数时, THE Balance_System SHALL 支持简单、普通、困难、精英、炼狱、圣耀六个难度等级
3. THE Balance_System SHALL 确保生物强度倍数与装备属性倍数使用相同的基准值
4. THE Balance_System SHALL 移除分散在各文件中的重复倍数配置

### Requirement 3: 建立线性数值关系

**User Story:** As a 玩家, I want 装备提升能够有效应对更高难度的怪物, so that 游戏进度感更加明确。

#### Acceptance Criteria

1. THE Anchor_System SHALL 确保装备属性增长与生物属性增长保持1:1的比例关系
2. WHEN 玩家获得当前难度的满属性装备时, THE Balance_System SHALL 使玩家能够挑战下一难度的基础怪物
3. THE Balance_System SHALL 将难度递增比例控制在2-5倍之间，避免指数爆炸
4. IF 玩家装备属性低于当前地图生物防御, THEN THE Balance_System SHALL 确保玩家仍能造成最小伤害

### Requirement 4: 优化TAG怪物配置

**User Story:** As a 游戏策划, I want TAG怪物之间的强度差异更加合理, so that 玩家有明确的挑战目标。

#### Acceptance Criteria

1. THE Creature_Attribute SHALL 将TAG1-5的强度差异控制在5倍以内
2. THE Creature_Attribute SHALL 将TAG6(大陆BOSS)强度设为TAG5的3倍
3. THE Creature_Attribute SHALL 将TAG7(特殊BOSS)强度设为TAG5的10倍
4. WHEN 计算TAG倍数时, THE Creature_Attribute SHALL 使用简单的整数倍数而非小数

### Requirement 5: 简化装备属性计算

**User Story:** As a 服务器管理员, I want 装备属性计算更简洁, so that 减少掉落时的计算开销。

#### Acceptance Criteria

1. WHEN 装备掉落时, THE Equipment_Attribute SHALL 使用不超过4次大数值乘法计算属性值
2. THE Equipment_Attribute SHALL 移除惊喜掉落、稀有高属性等多重随机倍数
3. THE Equipment_Attribute SHALL 使用统一的极品倍率替代多个分散的倍率配置
4. THE Equipment_Attribute SHALL 确保装备属性值与地图难度成正比

### Requirement 6: 提供数值调试工具

**User Story:** As a 游戏策划, I want 能够快速查看和调整数值配置, so that 方便进行游戏平衡测试。

#### Acceptance Criteria

1. THE Balance_System SHALL 提供GM命令查看当前地图的生物属性预览
2. THE Balance_System SHALL 提供GM命令查看当前地图的装备属性预览
3. THE Balance_System SHALL 在配置文件中添加详细的数值说明注释
4. WHEN 数值配置变更时, THE Balance_System SHALL 支持热更新而无需重启服务器


### Requirement 7: 自我验证机制

**User Story:** As a 开发者, I want 在修改数值前进行自我验证, so that 确保修改不会破坏游戏平衡。

#### Acceptance Criteria

1. WHEN 修改数值配置前, THE Balance_System SHALL 运行验证脚本检查数值合理性
2. THE Balance_System SHALL 验证各难度各TAG的生物属性在合理范围内
3. THE Balance_System SHALL 验证装备属性能够有效应对同难度生物
4. THE Balance_System SHALL 验证难度递增比例在2-5倍之间
5. IF 验证失败, THEN THE Balance_System SHALL 输出详细的错误信息和建议修正值

## 优化方案预览

### 新的计算公式（3次乘法）
```
属性 = 基础值 × 地图难度倍数 × TAG倍数
地图难度倍数 = 地图强度 × 难度系数
```

### 新的难度系数配置
| 难度 | 系数 | 说明 |
|-----|------|------|
| 简单 | 1 | 基础难度 |
| 普通 | 3 | 3倍递增 |
| 困难 | 10 | 约3倍递增 |
| 精英 | 30 | 3倍递增 |
| 炼狱 | 100 | 约3倍递增 |
| 圣耀 | 300 | 3倍递增 |

### 新的TAG倍数配置
| TAG | 类型 | 倍数 | 说明 |
|-----|------|------|------|
| 1 | 基础小怪 | 1 | 基准 |
| 2 | 挑战小怪 | 2 | 2倍 |
| 3 | 稀有怪物 | 4 | 4倍 |
| 4 | 精英怪物 | 8 | 8倍 |
| 5 | 首领怪物 | 16 | 16倍 |
| 6 | 大陆BOSS | 50 | 约3倍于首领 |
| 7 | 特殊BOSS | 160 | 10倍于首领 |

### 验证示例（简单难度，地图强度10）

| 怪物类型 | 血量 | 攻击 | 防御 |
|---------|------|------|------|
| TAG1基础小怪 | 10,000 | 1,000 | 500 |
| TAG5首领 | 160,000 | 16,000 | 8,000 |
| TAG7特殊BOSS | 1,600,000 | 160,000 | 80,000 |

装备攻击: 1,000 → 对TAG1伤害: 500 (攻击-防御)

**结论**: 当前难度装备可以有效击杀当前难度小怪，需要更好装备才能挑战更高TAG怪物。
