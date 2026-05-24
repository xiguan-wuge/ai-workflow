# NoData 无数据状态组件

用于在列表、表格或其他数据容器为空时展示友好的无数据状态提示。

## 基础用法

:::demo 基础用法
nodata/basic
:::

## 自定义图标

:::demo 带图标的 NoData
nodata/with-icon
:::

## 带描述

:::demo 带搜索提示的 NoData
nodata/with-description
:::

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | string | 'No Data' | 无数据提示主文本 |
| description | string | '' | 可选的描述文本 |
| icon | string | '📭' | 显示的图标（支持 emoji） |

## 使用默认插槽

```vue
<template>
  <NoData text="No Data Available">
    <template #default>
      <svg width="48" height="48" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#999" stroke-width="2"/>
      </svg>
    </template>
  </NoData>
</template>
```