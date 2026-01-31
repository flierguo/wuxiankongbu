# Requirements Document - 血统系统

## Introduction

血统系统是一个角色成长系统，允许玩家选择一种血统类型并通过升级来获得属性加成。每个玩家只能选择一种血统，但可以通过重置来更换。

## Glossary

- **血统 (Bloodline)**: 玩家可选择的四种类型之一（血族、狼人、修真、恶魔）
- **血统等级 (Bloodline Level)**: 血统的当前等级，等级越高属性加成越多
- **粹血源核 (Blood Essence Core)**: 用于升级血统的材料
- **属性加成 (Attribute Bonus)**: 血统提供的百分比属性增益

## Requirements

### Requirement 1: 血统选择

**User Story:** 作为玩家，我想选择一种血统，以便获得对应的属性加成。

#### Acceptance Criteria

1. WHEN 玩家未选择血统时，THE 系统 SHALL 显示所有可选血统列表
2. WHEN 玩家选择一个血统时，THE 系统 SHALL 将该血统设置为玩家的当前血统
3. WHEN 玩家选择血统时，THE 系统 SHALL 将血统等级初始化为1级
4. WHEN 玩家已有血统时，THE 系统 SHALL 阻止选择其他血统
5. THE 系统 SHALL 提供四种血统选项：血族、狼人、修真、恶魔

### Requirement 2: 血统属性加成

**User Story:** 作为玩家，我想通过血统获得属性加成，以便提升角色战斗力。

#### Acceptance Criteria

1. WHEN 玩家拥有血族血统时，THE 系统 SHALL 提供血量+5%/级、主属性+3%/级、防御+2%/级的加成
2. WHEN 玩家拥有狼人血统时，THE 系统 SHALL 提供血量+3%/级、主属性+5%/级、防御+2%/级的加成
3. WHEN 玩家拥有修真血统时，THE 系统 SHALL 提供血量+3%/级、主属性+3%/级、防御+4%/级的加成
4. WHEN 玩家拥有恶魔血统时，THE 系统 SHALL 提供血量+3%/级、主属性+4%/级、防御+3%/级的加成
5. THE 系统 SHALL 在属性统计时应用血统加成
6. THE 系统 SHALL 根据血统等级计算最终加成（基础加成 × 等级）

### Requirement 3: 血统升级

**User Story:** 作为玩家，我想升级血统等级，以便获得更高的属性加成。

#### Acceptance Criteria

1. WHEN 玩家升级血统时，THE 系统 SHALL 检查玩家是否拥有足够的粹血源核
2. WHEN 玩家材料不足时，THE 系统 SHALL 显示错误提示并阻止升级
3. WHEN 玩家材料充足时，THE 系统 SHALL 扣除材料并提升血统等级
4. THE 系统 SHALL 使用等差数列计算升级所需材料：100 × (1 + 2 + 3 + ... + 目标等级) - 已消耗材料
5. WHEN 血统升级后，THE 系统 SHALL 重新计算玩家属性
6. THE 系统 SHALL 显示升级前后的属性对比

### Requirement 4: 血统重置

**User Story:** 作为玩家，我想重置血统，以便选择其他血统类型。

#### Acceptance Criteria

1. WHEN 玩家请求重置血统时，THE 系统 SHALL 显示确认对话框
2. WHEN 玩家确认重置时，THE 系统 SHALL 清空当前血统和等级
3. WHEN 血统重置后，THE 系统 SHALL 允许玩家重新选择血统
4. WHEN 血统重置后，THE 系统 SHALL 重新计算玩家属性
5. THE 系统 SHALL 在确认对话框中提示玩家将失去所有血统等级和属性加成

### Requirement 5: 界面显示

**User Story:** 作为玩家，我想看到清晰的血统信息界面，以便了解血统系统的详情。

#### Acceptance Criteria

1. THE 系统 SHALL 显示当前已选血统和等级
2. THE 系统 SHALL 显示当前血统的属性加成
3. THE 系统 SHALL 显示所有血统的图标、名称和介绍
4. THE 系统 SHALL 为每个血统显示选择按钮
5. THE 系统 SHALL 显示升级血统和重置血统的按钮
6. THE 系统 SHALL 显示血统升级材料的说明
7. WHEN 玩家已选择血统时，THE 系统 SHALL 高亮显示该血统

### Requirement 6: 数据持久化

**User Story:** 作为玩家，我想血统数据能够保存，以便下次登录时保持血统状态。

#### Acceptance Criteria

1. THE 系统 SHALL 将血统类型保存到 Player.V.血统
2. THE 系统 SHALL 将血统等级保存到 Player.V.血统等级
3. WHEN 玩家登录时，THE 系统 SHALL 初始化血统变量
4. WHEN 玩家登录时，THE 系统 SHALL 应用血统属性加成

### Requirement 7: 属性统计集成

**User Story:** 作为系统，我需要将血统加成集成到属性统计流程中，以便正确计算玩家属性。

#### Acceptance Criteria

1. THE 系统 SHALL 在装备属性统计流程中调用血统加成函数
2. THE 系统 SHALL 在应用基因加成后应用血统加成
3. THE 系统 SHALL 使用大数值计算方法处理血统加成
4. THE 系统 SHALL 在属性显示页面中显示血统类型和等级
5. WHEN 血统变更时，THE 系统 SHALL 触发属性重新计算
