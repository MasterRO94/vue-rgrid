<template>
  <nav data-rgrid-pagination>
    <ul :class="styling.containerClass">
      <!-- First button -->
      <li
        v-if="config.firstLastButton"
        :class="[styling.prevClass, { [styling.disabledClass]: modelValue <= 1 }]"
        data-rgrid-pagination-first
      >
        <button
          :disabled="modelValue <= 1"
          :class="styling.prevLinkClass"
          @click="changePage(1)"
        >
          {{ config.firstButtonText }}
        </button>
      </li>

      <!-- Prev button -->
      <li
        v-if="!config.hidePrevNext"
        :class="[styling.prevClass, { [styling.disabledClass]: modelValue <= 1 }]"
        data-rgrid-pagination-prev
      >
        <button
          :disabled="modelValue <= 1"
          :class="styling.prevLinkClass"
          @click="changePage(modelValue - 1)"
        >
          {{ config.prevText }}
        </button>
      </li>

      <!-- Page numbers -->
      <template v-for="page in pages" :key="page.value">
        <li
          v-if="page.type === 'break'"
          :class="styling.breakViewClass"
          data-rgrid-pagination-break
        >
          <span :class="styling.breakViewLinkClass">{{ config.breakViewText }}</span>
        </li>
        <li
          v-else
          :class="[styling.pageClass, { [styling.activePageClass]: page.value === modelValue }]"
          data-rgrid-pagination-page
        >
          <button
            :class="styling.pageLinkClass"
            @click="changePage(page.value)"
          >
            {{ page.value }}
          </button>
        </li>
      </template>

      <!-- Next button -->
      <li
        v-if="!config.hidePrevNext"
        :class="[styling.nextClass, { [styling.disabledClass]: modelValue >= numberOfPages }]"
        data-rgrid-pagination-next
      >
        <button
          :disabled="modelValue >= numberOfPages"
          :class="styling.nextLinkClass"
          @click="changePage(modelValue + 1)"
        >
          {{ config.nextText }}
        </button>
      </li>

      <!-- Last button -->
      <li
        v-if="config.firstLastButton"
        :class="[styling.nextClass, { [styling.disabledClass]: modelValue >= numberOfPages }]"
        data-rgrid-pagination-last
      >
        <button
          :disabled="modelValue >= numberOfPages"
          :class="styling.nextLinkClass"
          @click="changePage(numberOfPages)"
        >
          {{ config.lastButtonText }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PaginationConfig, PaginationStyling } from '../config'

interface PageItem {
  type: 'page' | 'break'
  value: number
}

const props = defineProps<{
  config: PaginationConfig
  styling: PaginationStyling
  modelValue: number
  numberOfPages: number
}>()

const emit = defineEmits<{
  'update:modelValue': [page: number]
}>()

const pages = computed<PageItem[]>(() => {
  const total = props.numberOfPages
  const current = props.modelValue
  const range = props.config.pageRange
  const items: PageItem[] = []

  if (total <= 0) return items

  let start = Math.max(1, current - range)
  let end = Math.min(total, current + range)

  if (current - range <= 1) {
    end = Math.min(total, end + (range - current + 1))
  }
  if (current + range >= total) {
    start = Math.max(1, start - (current + range - total))
  }

  if (start > 1) {
    items.push({ type: 'page', value: 1 })
    if (start > 2) items.push({ type: 'break', value: -1 })
  }

  for (let i = start; i <= end; i++) {
    items.push({ type: 'page', value: i })
  }

  if (end < total) {
    if (end < total - 1) items.push({ type: 'break', value: -2 })
    items.push({ type: 'page', value: total })
  }

  return items
})

function changePage(page: number) {
  if (page < 1 || page > props.numberOfPages || page === props.modelValue) return
  emit('update:modelValue', page)
}
</script>
