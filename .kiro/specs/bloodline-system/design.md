# Design Document - 血统系统

## Overview

血统系统是一个基于选择和升级的角色成长系统。玩家可以从四种血统中选择一种，通过消耗材料升级血统等级来获得更高的属性加成。系统设计遵循单一选择原则，确保玩家在任何时候只能拥有一种血统。

## Architecture

```
血统系统
├── 数据层
│   ├── Player.V.血统 (血统类型)
│   └── Player.V.血统等级 (血统等级)
├── 配置层
│   └── 血统配置 (四种血统的属性和图标)
├── 业务逻辑层
│   ├── 血统选择
│   ├── 血统升级
│   ├── 血统重置
│   └── 属性加成计算
└── 界面层
    ├── 主界面 (血统列表和选择)
    ├── 升级界面 (升级确认)
    └── 重置确认对话框
```

## Components and Interfaces

### 1. 血统配置 (Bloodline Configuration)

```typescript
interface 血统配置类型 {
    名称: string;
    图标: number;      // UI图标ID
    血量加成: number;  // 每级血量加成百分比
    主属性加成: number; // 每级主属性加成百分比
    防御加成: number;  // 每级防御加成百分比
    介绍: string;      // 血统介绍文本
}

const 血统配置: { [key: string]: 血统配置类型 } = {
    '血族': { 名称: '血族', 图标: 311, 血量加成: 5, 主属性加成: 3, 防御加成: 2, ... },
    '狼人': { 名称: '狼人', 图标: 312, 血量加成: 3, 主属性加成: 5, 防御加成: 2, ... },
    '修真': { 名称: '修真', 图标: 313, 血量加成: 3, 主属性加成: 3, 防御加成: 4, ... },
    '恶魔': { 名称: '恶魔', 图标: 314, 血量加成: 3, 主属性加成: 4, 防御加成: 3, ... }
};
```

### 2. 核心函数接口

```typescript
// 主界面
export function Main(Npc: TNormNpc, Player: TPlayObject): void

// 血统选择
export function 确认选择(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void

// 血统升级
export function 提升等级(Npc: TNormNpc, Player: TPlayObject): void
export function 执行提升(Npc: TNormNpc, Player: TPlayObject): void

// 血统重置
export function 确认重置(Npc: TNormNpc, Player: TPlayObject): void
export function 执行重置(Npc: TNormNpc, Player: TPlayObject): void

// 属性加成计算
export function 获取血统加成(Player: TPlayObject): { 血量: number, 主属性: number, 防御: number }

// 材料计算
function 计算升级材料(当前等级: number): number
```

## Data Models

### Player Variables

```typescript
Player.V.血统: string        // 当前血统类型 ('血族' | '狼人' | '修真' | '恶魔' | '')
Player.V.血统等级: number    // 当前血统等级 (0, 1, 2, 3, ...)
```

### Bloodline Bonus Calculation

```typescript
血量加成 = 血统配置[血统类型].血量加成 × 血统等级
主属性加成 = 血统配置[血统类型].主属性加成 × 血统等级
防御加成 = 血统配置[血统类型].防御加成 × 血统等级
```

### Upgrade Material Calculation

升级材料使用等差数列求和公式：

```
从1级到N级的总材料 = (100 + 100×N) × N / 2
当前等级升级所需 = 从1级到(当前等级+1)的总材料 - 从1级到当前等级的总材料
```

示例：
- 1级 → 2级：100个
- 2级 → 3级：200个
- 3级 → 4级：300个
- N级 → (N+1)级：100×(N+1)个

## Correctness Properties

*属性是一个应该在所有有效执行中保持为真的特征或行为——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### Property 1: 血统唯一性
*For any* 玩家，在任何时刻只能拥有一种血统或没有血统
**Validates: Requirements 1.4**

### Property 2: 血统选择幂等性
*For any* 玩家和血统类型，重复选择同一血统不应改变血统状态
**Validates: Requirements 1.2, 1.3**

### Property 3: 属性加成计算正确性
*For any* 血统类型和等级，计算的属性加成应等于（基础加成 × 等级）
**Validates: Requirements 2.6**

### Property 4: 材料计算正确性
*For any* 当前等级N，升级所需材料应等于 100×(N+1)
**Validates: Requirements 3.4**

### Property 5: 重置后状态清空
*For any* 玩家，重置血统后血统类型应为空字符串且等级应为0
**Validates: Requirements 4.2**

### Property 6: 属性加成应用顺序
*For any* 玩家，血统加成应在基因加成之后、最终属性计算之前应用
**Validates: Requirements 7.2**

## Error Handling

### 1. 血统选择错误
- **已有血统**: 提示玩家已选择血统，需要先重置
- **无效血统**: 检查血统名称是否在配置中存在

### 2. 血统升级错误
- **未选择血统**: 提示玩家需要先选择血统
- **材料不足**: 显示所需材料数量和当前拥有数量
- **扣除材料失败**: 回滚升级操作

### 3. 血统重置错误
- **未选择血统**: 提示玩家没有血统需要重置
- **取消重置**: 返回主界面，不执行任何操作

## Testing Strategy

### Unit Tests
1. 测试血统配置数据完整性
2. 测试材料计算公式的正确性
3. 测试属性加成计算的准确性
4. 测试边界条件（等级0、等级1、高等级）

### Property-Based Tests
每个测试运行至少100次迭代。

1. **Property Test 1: 血统唯一性**
   - 生成随机的血统选择序列
   - 验证玩家始终只有一种血统或没有血统
   - **Feature: bloodline-system, Property 1: 血统唯一性**

2. **Property Test 2: 属性加成计算**
   - 生成随机的血统类型和等级
   - 验证计算结果等于基础加成×等级
   - **Feature: bloodline-system, Property 3: 属性加成计算正确性**

3. **Property Test 3: 材料计算**
   - 生成随机的当前等级
   - 验证材料计算符合等差数列公式
   - **Feature: bloodline-system, Property 4: 材料计算正确性**

4. **Property Test 4: 重置状态**
   - 生成随机的血统和等级
   - 执行重置后验证状态清空
   - **Feature: bloodline-system, Property 5: 重置后状态清空**

### Integration Tests
1. 测试血统系统与属性统计系统的集成
2. 测试血统加成在属性计算流程中的正确应用
3. 测试血统数据的持久化和加载

## Implementation Notes

### 性能优化
- 血统配置使用常量对象，避免重复创建
- 属性加成计算使用大数值方法，支持超大数值
- 界面文本使用模板字符串拼接，减少字符串操作

### 代码组织
- 所有血统相关代码集中在 `_核心部分/_服务/血统选择.ts`
- 属性加成集成在 `_核心部分/_装备/属性统计.ts`
- 遵循项目现有的代码风格和命名规范

### 扩展性考虑
- 血统配置使用对象映射，易于添加新血统
- 属性加成计算使用配置驱动，易于调整数值
- 界面布局参考基因系统，保持一致性
