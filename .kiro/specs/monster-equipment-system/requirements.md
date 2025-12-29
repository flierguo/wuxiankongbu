# Requirements Document

## Introduction

本文档定义了无限恐怖项目中怪物属性与装备属性系统的完整需求规范。该系统涵盖怪物生成、属性赋予、装备掉落、属性统计和伤害计算的完整流程，旨在为玩家提供惊喜感和磨怪体验，同时优化CPU单核消耗。

## Glossary

- **Monster_System**: 怪物系统，负责怪物刷新、属性赋予和技能分配
- **Equipment_System**: 装备系统，负责装备掉落、属性生成和存储
- **Attribute_Calculator**: 属性统计器，负责统计玩家装备属性
- **Damage_Calculator**: 伤害计算器，使用大数值计算最终伤害
- **BigNumber_Engine**: 大数值计算引擎，基于核心计算方法.ts
- **OutWay_System**: 装备属性存储系统，使用outway1/2/3存储属性ID和数值
- **CustomDesc_Storage**: 装备描述存储，使用JSON格式存储完整属性
- **Skill_Magic_Level**: 技能魔次，影响伤害计算的技能等级系数
- **Monster_TAG**: 怪物标签，尾数1-2为小怪，3为精英，4为BOSS，5为特殊怪物，6为特殊BOSS
- **Mutation_System**: 变异系统，怪物几率变异获得特殊能力
- **Grinding_Monster**: 磨怪，需要长时间才能击杀的高属性怪物

## Requirements

### Requirement 1: 怪物属性系统

**User Story:** As a 游戏系统, I want to 为刷新的怪物赋予属性, so that 怪物具有生命、防御、攻击三种基础属性并根据TAG类型区分强度。

#### Acceptance Criteria

1. WHEN 怪物刷新时, THE Monster_System SHALL 根据TAG尾数赋予对应的属性倍率
2. WHEN TAG尾数为1-2时, THE Monster_System SHALL 将怪物标记为小怪并赋予基础属性
3. WHEN TAG尾数为3时, THE Monster_System SHALL 将怪物标记为精英并赋予1.5-3倍基础属性
4. WHEN TAG尾数为4时, THE Monster_System SHALL 将怪物标记为BOSS并赋予5-10倍基础属性
5. WHEN TAG尾数为5时, THE Monster_System SHALL 将怪物标记为特殊怪物并赋予特殊属性
6. WHEN TAG尾数为6时, THE Monster_System SHALL 将怪物标记为特殊BOSS并赋予最高属性
7. THE Monster_System SHALL 使用SVar存储怪物的生命(91)、攻击(92)、防御(93)属性

### Requirement 2: 怪物变异系统

**User Story:** As a 玩家, I want to 遇到变异怪物, so that 游戏有惊喜感和挑战性。

#### Acceptance Criteria

1. WHEN 怪物刷新时, THE Monster_System SHALL 根据变异几率判定是否变异
2. WHEN 怪物变异时, THE Monster_System SHALL 随机赋予1-3种变异效果
3. WHEN 怪物变异时, THE Monster_System SHALL 提升怪物属性2-5倍
4. WHEN 怪物变异时, THE Monster_System SHALL 提升掉落装备品质几率
5. THE Monster_System SHALL 支持多种变异类型（属性强化、技能强化、特殊效果）

### Requirement 3: 怪物技能系统

**User Story:** As a 游戏系统, I want to 为怪物赋予随机技能, so that 战斗更具多样性。

#### Acceptance Criteria

1. WHEN 精英或BOSS怪物刷新时, THE Monster_System SHALL 几率赋予1-2个技能
2. WHEN 怪物拥有技能时, THE Monster_System SHALL 存储技能ID和释放几率
3. WHEN 怪物攻击时, THE Monster_System SHALL 根据几率触发技能攻击
4. THE Monster_System SHALL 从MagicNpc.ts中引用怪物技能配置
5. THE Monster_System SHALL 支持火球术、雷电术、半月弯刀等多种技能类型

### Requirement 4: 装备掉落系统

**User Story:** As a 玩家, I want to 击杀怪物获得装备, so that 装备属性与怪物强度相关。

#### Acceptance Criteria

1. WHEN 怪物死亡时, THE Equipment_System SHALL 根据怪物属性生成装备
2. WHEN 生成装备时, THE Equipment_System SHALL 根据怪物攻击属性计算基础属性值
3. WHEN 生成装备时, THE Equipment_System SHALL 支持18件装备类型（除生肖外）
4. THE Equipment_System SHALL 使用outway1存储属性ID（31-38为基础属性，10001+为技能魔次）
5. THE Equipment_System SHALL 使用outway2和outway3存储属性数值

### Requirement 5: 装备基础属性生成

**User Story:** As a 玩家, I want to 获得具有随机属性的装备, so that 每件装备都有独特性。

#### Acceptance Criteria

1. WHEN 生成装备属性时, THE Equipment_System SHALL 随机生成1-6条基础属性
2. THE Equipment_System SHALL 支持以下基础属性ID：
   - 31: 血量(自定属性[167])
   - 32: 防御(自定属性[168])
   - 33: 攻击(自定属性[161])
   - 34: 魔法(自定属性[162])
   - 35: 道士(自定属性[163])
   - 36: 箭术(自定属性[165])
   - 37: 刺术(自定属性[164])
   - 38: 武术(自定属性[166])
3. WHEN 生成属性值时, THE Equipment_System SHALL 基于怪物攻击属性计算基础值

### Requirement 6: 装备技能魔次属性生成

**User Story:** As a 玩家, I want to 获得带有技能魔次的装备, so that 可以提升特定技能伤害。

#### Acceptance Criteria

1. WHEN 生成装备时, THE Equipment_System SHALL 几率生成技能魔次属性
2. THE Equipment_System SHALL 支持基础技能魔次（10001-10013）作为独立分组
3. THE Equipment_System SHALL 支持职业技能魔次（10014-10019）与全体技能魔次（10020）合并为一组
4. THE Equipment_System SHALL 支持新技能魔次（10021-10050），每5个ID为一组（10021-10025、10026-10030、10031-10035、10036-10040、10041-10045、10046-10050）
5. WHEN 生成技能魔次时, THE Equipment_System SHALL 根据怪物等级决定魔次数值
6. WHEN 存储技能魔次时, THE Equipment_System SHALL 使用字符串格式存储数值以支持大数值运算
7. THE Equipment_System SHALL 记录技能魔次的分组类型和分组ID

### Requirement 7: 装备属性翻倍系统

**User Story:** As a 玩家, I want to 获得翻倍属性的装备, so that 有惊喜感和追求目标。

#### Acceptance Criteria

1. WHEN 生成装备时, THE Equipment_System SHALL 100%应用基础翻倍（1-100随机）
2. WHEN 生成装备时, THE Equipment_System SHALL 根据玩家极品率几率触发极品翻倍
3. WHEN 触发极品翻倍时, THE Equipment_System SHALL 应用10+极品率/100的倍率
4. WHEN 生成装备时, THE Equipment_System SHALL 1/2000几率触发神品翻倍
5. WHEN 触发神品翻倍时, THE Equipment_System SHALL 应用1-20的随机倍率
6. THE Equipment_System SHALL 支持多种翻倍叠加

### Requirement 8: 装备属性存储

**User Story:** As a 游戏系统, I want to 存储装备属性到CustomDesc, so that 属性统计可以正确读取。

#### Acceptance Criteria

1. WHEN 装备属性生成完成时, THE Equipment_System SHALL 将属性序列化为JSON格式
2. THE Equipment_System SHALL 存储职业属性_职业数组（属性ID列表）
3. THE Equipment_System SHALL 存储职业属性_属性数组（属性值列表）
4. WHEN 存储属性时, THE Equipment_System SHALL 使用CustomDesc()方法保存
5. FOR ALL 装备属性, 序列化后反序列化 SHALL 产生等价的属性数据（round-trip property）

### Requirement 9: 装备属性统计

**User Story:** As a 玩家, I want to 穿戴装备后属性正确累加, so that 战斗力准确反映装备强度。

#### Acceptance Criteria

1. WHEN 玩家穿戴装备时, THE Attribute_Calculator SHALL 读取所有装备的CustomDesc
2. WHEN 统计属性时, THE Attribute_Calculator SHALL 解析JSON并累加同类属性
3. WHEN 统计属性时, THE Attribute_Calculator SHALL 将结果存储到Player.R.自定属性
4. THE Attribute_Calculator SHALL 使用大数值计算处理超大属性值
5. WHEN 玩家脱下装备时, THE Attribute_Calculator SHALL 重新计算所有属性

### Requirement 10: 伤害计算系统

**User Story:** As a 玩家, I want to 对怪物造成正确的伤害, so that 装备属性能有效提升战斗力。

#### Acceptance Criteria

1. WHEN 玩家攻击怪物时, THE Damage_Calculator SHALL 使用公式：(主属性 - 怪物防御) * (技能魔次 - 怪物魔次抵抗) * BUFF加成 = 最终伤害
2. WHEN 计算伤害时, THE Damage_Calculator SHALL 使用BigNumber_Engine进行大数值计算
3. WHEN 主属性小于怪物防御时, THE Damage_Calculator SHALL 返回最小伤害值1
4. WHEN 技能魔次小于怪物魔次抵抗时, THE Damage_Calculator SHALL 使用最小魔次系数0.1
5. THE Damage_Calculator SHALL 支持智能计算函数自动选择最优计算路径

### Requirement 11: 磨怪体验设计

**User Story:** As a 玩家, I want to 遇到需要长时间击杀的怪物, so that 击杀后获得更好的奖励。

#### Acceptance Criteria

1. WHEN 怪物为磨怪类型时, THE Monster_System SHALL 赋予超高生命值
2. WHEN 怪物为磨怪类型时, THE Monster_System SHALL 提升掉落品质几率50-200%
3. WHEN 怪物为磨怪类型时, THE Monster_System SHALL 显示特殊标识
4. THE Monster_System SHALL 根据怪物存活时间动态提升掉落品质
5. WHEN 磨怪被击杀时, THE Equipment_System SHALL 保证至少一件高品质装备掉落

### Requirement 12: 性能优化

**User Story:** As a 游戏系统, I want to 降低CPU单核消耗, so that 服务器能承载更多玩家。

#### Acceptance Criteria

1. THE BigNumber_Engine SHALL 使用快速路径处理9千万亿以内的数值
2. THE BigNumber_Engine SHALL 使用对象池复用Decimal对象
3. THE Attribute_Calculator SHALL 使用JSON缓存避免重复解析
4. THE Attribute_Calculator SHALL 使用Map替代switch语句提升查找性能
5. THE Monster_System SHALL 使用批量处理减少循环次数
6. THE Equipment_System SHALL 使用预计算常用值减少运行时计算
