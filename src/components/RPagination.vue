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
    :container-class="config.styling.pagination.containerClass"
    :page-class="config.styling.pagination.pageClass"
    :page-link-class="config.styling.pagination.pageLinkClass"
    :prev-class="config.styling.pagination.prevClass"
    :prev-link-class="config.styling.pagination.prevLinkClass"
    :next-class="config.styling.pagination.nextClass"
    :next-link-class="config.styling.pagination.nextLinkClass"
    :break-view-class="config.styling.pagination.breakViewClass"
    :break-view-link-class="config.styling.pagination.breakViewLinkClass"
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
      this.$emit('input', page);
    },
  },
};
</script>
