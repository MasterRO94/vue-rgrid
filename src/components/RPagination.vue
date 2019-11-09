<template>
  <paginate
    v-model="currentPage"
    :page-count="numberOfPages"
    :page-range="config.pageRange"
    :next-text="config.nextText"
    :prev-text="config.prevText"
    :break-view-text="config.breakViewText"
    :first-last-button="config.firstLastButton"
    :first-button-text="config.firstButtonText"
    :last-button-text="config.lastButtonText"
    :hide-prev-next="config.hidePrevNext"
    container-class="r-grid__pagination"
    page-class="r-grid__pagination-page"
    page-link-class="r-grid__pagination-link"
    prev-class="r-grid__pagination-prev"
    prev-link-class="r-grid__pagination-prev-link"
    next-class="r-grid__pagination--next"
    next-link-class="r-grid__pagination-next-link"
    break-view-class="r-grid__pagination-break-view"
    break-view-link-class="r-grid__pagination-break-view-link"
    :click-handler="pageChanged"
  />
</template>

<script>
import Paginate from 'vuejs-paginate';

export default {
  name: 'VPagination',

  components: {
    Paginate,
  },

  props: {
    config: {
      type: Object,
      required: true,
    },

    value: {
      type: Number,
      required: false,
      default: 1,
    },

    numberOfPages: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      currentPage: this.value,
    };
  },

  methods: {
    pageChanged(page) {
      this.currentPage = page;
      this.$emit('input', page);
    },
  },
};
</script>
