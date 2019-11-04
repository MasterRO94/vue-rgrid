<template>
  <div
    v-resize:debounce="handleResize"
    class="r-grid"
  >
    <slot name="grid-header" />

    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div
      v-else
      class="r-grid__content"
      :class="{'grid--wrapper--content--loading': fetchingData}"
    >
      <div
        v-if="config.pagination.infoEnabled && config.pagination.infoPosition === 'top'"
        class="r-grid__pagination-info r-grid__pagination-info--top"
      >
        <slot name="paginationInfo">
          {{ paginationInfo }}
        </slot>
      </div>

      <div class="r-grid__table-wrapper">
        <h5 v-show="fetchingData">
          Loading.....
        </h5>

        <table
          v-if="!mobileView"
          v-bind="$attrs"
          class="r-grid__table"
        >
          <thead class="r-grid__table-head">
          <tr class="r-grid__table-row">
            <th
              v-if="config.selection"
              class="r-grid__table-head-cell"
            >
              <div class="r-grid__checkbox">
                <input
                  type="checkbox"
                  title="Select all"
                  :checked="isAllRowsOnPageSelected"
                  @input="toggleAllRowsSelection"
                >
                <span class="r-grid__checkmark" />
              </div>
            </th>
            <th
              v-for="(column, field) in data.columns.columns"
              :key="field"
              class="r-grid__table-head-cell"
              :class="{'grid--column-sortable': column.sortable}"
            >
              <div class="r-grid__table-head-holder">
                <slot
                  :column="column"
                  :name="`column:${field}`"
                >
                    <span>
                      {{ column.label }}
                    </span>
                </slot>

                <template v-if="config.sorting && column.sortable">
                    <span
                      v-show="sorting[field] === 'asc'"
                      class="grid--column-sortable--icon grid--column-sortable--icon--asc"
                      @click="sort(field)"
                    >
                      <slot
                        v-if="sorting[field] === 'asc'"
                        :column="column"
                        name="sorting-icon-asc"
                      >
                        &#8593;
                      </slot>
                    </span>

                  <span
                    v-show="sorting[field] === 'desc'"
                    class="grid--column-sortable--icon grid--column-sortable--icon--desc"
                    @click="sort(field)"
                  >
                      <slot
                        :column="column"
                        name="sorting-icon-desc"
                      >
                        &#8595;
                      </slot>
                    </span>

                  <span
                    v-show="!sorting[field]"
                    class="r-grid__sortable-icon r-grid__sortable-icon--none"
                    @click="sort(field)"
                  >
                      <slot
                        :column="column"
                        name="sorting-icon-none"
                      >
                        &#8597;
                      </slot>
                    </span>
                </template>

                <slot
                  v-if="config.sorting && !column.sortable"
                  :column="column"
                  name="sorting-icon-disabled"
                />
              </div>
            </th>
          </tr>
          </thead>
          <tbody class="r-grid__table-body">
          <!-- eslint-disable vue/require-v-for-key -->
          <template
            v-for="row in data.rows"
          >
            <tr
              :key="row.id"
              class="r-grid__table-row"
              :class="{
                  'r-grid__table-row-expanded': displayedDetails[row.id] && displayedDetails[row.id].length
                }"
              @click="fireRowClickEvent(row)"
              @dblclick="fireRowDblClickEvent(row)"
            >
              <td
                v-if="config.selection"
                class="r-grid__table-body-cell"
              >
                <div class="r-grid__checkbox">
                  <input
                    type="checkbox"
                    :value="row"
                    :checked="selectionHasRow(row)"
                    @input="toggleRowSelection(row)"
                  >
                  <span class="r-grid__checkmark" />
                </div>
              </td>
              <td
                v-for="(column, field) in data.columns.columns"
                :key="field"
                class="r-grid__table-body-cell"
                :class="{
                    'r-grid__table-body-cell-expanded': displayedDetails[row.id]
                      && displayedDetails[row.id].includes(field)
                  }"
                @click="fireCellClickEvent(row.columns[field] || null, row, field)"
                @dblclick="fireCellDblClickEvent(row.columns[field] || null, row, field)"
              >
                <slot
                  :cell="row.columns[field] || null"
                  :row="row"
                  :field="field"
                  :name="`cell:${field}`"
                >
                    <span v-if="row.columns[field]">
                      {{ row.columns[field].value }}
                    </span>
                </slot>
              </td>
            </tr>

            <!-- eslint-disable vue/valid-v-for -->
            <template
              v-for="(column, field) in data.columns.columns"
            >
              <tr
                v-if="$scopedSlots[`row-details:${field}`] && displayedDetails[row.id]"
                v-show="displayedDetails[row.id] && displayedDetails[row.id].includes(field)"
                :key="`${row.id}-${field}`"
                class="r-grid__table-row"
              >
                <td
                  :colspan="totalColumnsCount"
                  class="r-grid__table-body-cell"
                  style="background: #f3f2e5"
                >
                  <slot
                    :name="`row-details:${field}`"
                    :row="row"
                    :cell="row.columns[field] || null"
                    :field="field"
                  />
                </td>
              </tr>
            </template>
          </template>
          </tbody>
        </table>

        <div
          v-else
          class="r-grid__cards-wrapper"
        >
          <div
            v-if="config.selection"
            class="r-grid__cards-controls"
          >
            <label :for="`select-all-rows-${_uid}`">
              Select All
            </label>
            <div class="r-grid__checkbox">
              <input
                :id="`select-all-rows-${_uid}`"
                type="checkbox"
                title="Select all"
                :checked="isAllRowsOnPageSelected"
                @input="toggleAllRowsSelection"
              >
              <span class="r-grid__checkmark" />
            </div>
          </div>

          <!-- eslint-disable vue/require-v-for-key -->
          <template
            v-for="row in data.rows"
          >
            <div class="r-grid__card-col">
              <div
                :key="row.id"
                class="r-grid__card"
                :class="{
                  'r-grid__card-expanded': displayedDetails[row.id] && displayedDetails[row.id].length
                }"
                @click="fireRowClickEvent(row)"
                @dblclick="fireRowDblClickEvent(row)"
              >
                <div
                  v-if="config.selection"
                  class="r-grid__card-controls"
                >
                  <div class="r-grid__checkbox">
                    <input
                      type="checkbox"
                      :value="row"
                      :checked="selectionHasRow(row)"
                      @input="toggleRowSelection(row)"
                    >
                    <span class="r-grid__checkmark" />
                  </div>
                </div>
                <div
                  v-for="(column, field) in data.columns.columns"
                  :key="field"
                  class="r-grid__card-row"
                >
                  <div class="r-grid__card-label">
                    <slot
                      :column="column"
                      :name="`column:${field}`"
                    >
                      <span>
                        {{ column.label }}
                      </span>
                    </slot>
                  </div>
                  <div
                    class="r-grid__card-value"
                    :class="{
                      'r-grid__card-value-expanded': displayedDetails[row.id]
                        && displayedDetails[row.id].includes(field)
                    }"
                    @click="fireCellClickEvent(row.columns[field] || null, row, field)"
                    @dblclick="fireCellDblClickEvent(row.columns[field] || null, row, field)"
                  >
                    <slot
                      :cell="row.columns[field] || null"
                      :row="row"
                      :name="`cell:${field}`"
                      :field="field"
                    >
                      <span v-if="row.columns[field]">
                        {{ row.columns[field].value }}
                      </span>
                    </slot>
                  </div>
                </div>
              </div>
            </div>

            <!-- eslint-disable vue/valid-v-for -->
            <template
              v-for="(column, field) in data.columns.columns"
            >
              <div
                v-if="$scopedSlots[`row-details:${field}`] && displayedDetails[row.id]"
                v-show="displayedDetails[row.id] && displayedDetails[row.id].includes(field)"
                :key="`${row.id}-${field}`"
              >
                <slot
                  :name="`row-details:${field}`"
                  :row="row"
                  :cell="row.columns[field] || null"
                  :field="field"
                />
              </div>
            </template>
          </template>
        </div>
      </div>

      <div
        v-if="config.pagination.infoEnabled && config.pagination.infoPosition === 'bottom'"
        class="r-grid__pagination-info r-grid__pagination-info--bottom"
      >
        <slot name="pagination-info">
          {{ paginationInfo }}
        </slot>
      </div>

      <v-pagination
        v-if="!initializing && config.pagination.enabled && numberOfPages > 1"
        v-model="pagination.currentPage"
        :config="config.pagination"
        :number-of-pages="numberOfPages"
        @input="handlePagination"
      />
    </div>

    <slot name="r-grid__footer" />
  </div>
</template>

<script>
  import axios from 'axios';
  import resize from 'vue-resize-directive';
  import config from '../config';
  import Row from '../models/Row';
  import Columns from '../models/Columns';
  import Api from '../Api';
  import VPagination from './VPagination.vue';
  import RequestQueryFormatter from '../RequestQueryFormatter';

  export default {
    name: 'VGrid',

    components: {
      VPagination,
    },

    directives: {
      resize,
    },

    props: {
      rows: {
        required: false,
        type: Array,
        default: () => [],
      },

      dataUrl: {
        required: false,
        type: String,
        default: null,
      },

      options: {
        required: false,
        type: Object,
        default: () => {
        },
      },

      requestParams: {
        required: false,
        type: Object,
        default: () => {
        },
      },
    },

    data() {
      return {
        config,
        windowWidth: 0,
        loading: false,
        fetchDataUrl: null,
        initializing: true,
        fetchingData: false,
        data: {
          columns: {},
          rows: [],
          selectedRows: [],
        },
        pagination: {
          currentPage: 1,
          total: 0,
        },
        sorting: {},
        additionalRequestParams: {},
        displayedDetails: {},
      };
    },

    computed: {
      numberOfPages() {
        return Math.ceil(this.pagination.total / (this.config.pagination.perPage || 1));
      },

      isAllRowsOnPageSelected() {
        if (!this.data.selectedRows.length) {
          return false;
        }

        // eslint-disable-next-line
        for (const row of this.data.rows) {
          if (!this.data.selectedRows.filter(r => r.id === row.id).length) {
            return false;
          }
        }

        return true;
      },

      paginationInfo() {
        if (!this.config.pagination.infoEnabled) {
          return '';
        }

        return this.config.pagination.infoTemplate
          .replace(/#rows/g, this.data.rows.length)
          .replace(/#total/g, this.pagination.total);
      },

      totalColumnsCount() {
        if (!this.data.columns) {
          return 0;
        }

        const count = this.data.columns.count();

        return this.config.selection ? count + 1 : count;
      },

      mobileView() {
        return this.config.responsive.enabled && this.windowWidth <= this.config.responsive.breakpoint;
      },
    },

    watch: {
      $props: {
        handler(newProps) {
          if (newProps.requestParams || (!newProps.requestParams && this.additionalRequestParams)) {
            this.additionalRequestParams = newProps.requestParams;
          }

          if (this.needsToReloadAccordingToNewProps(newProps)) {
            this.init(true);
          } else {
            this.init(false);
          }
        },
        deep: true,
      },
    },

    async created() {
      this.loading = true;
      await this.init();
      this.loading = false;
    },

    methods: {
      async init(loadRows = true) {
        this.initializing = true;

        this.prepareConfiguration();
        this.prepareColumns();

        if (loadRows) {
          await this.prepareRows();
        }

        if (this.data.columns.isEmpty() && this.data.rows.length) {
          this.prepareHeadersFromRow(this.data.rows[0]);
        }

        this.initializing = false;
      },

      prepareConfiguration() {
        const userConfig = Object.keys(this.options).length
          ? {
            ...this.options,
            pagination: {
              ...config.pagination,
              ...this.options.pagination || {},
            },
            axios: {
              ...config.axios,
              ...this.options.axios || {},
            },
          }
          : {};

        this.config = { ...config, ...userConfig };

        if (this.dataUrl) {
          this.fetchDataUrl = this.dataUrl;
        }

        this.pagination.currentPage = this.options && this.options.pagination && this.options.pagination.page
          ? this.options.pagination.page
          : 1;

        this.additionalRequestParams = this.requestParams;
      },

      async prepareRows() {
        if (this.fetchDataUrl) {
          await this.fetchData();
        } else {
          this.data.rows = Object.values(this.rows).map(row => Row.make(row));
        }
      },

      prepareColumns() {
        const columns = this.options && this.options.columns
          ? this.options.columns
          : [];

        this.data.columns = Columns.make(columns);
      },

      prepareHeadersFromRow(row) {
        this.data.columns = Columns.makeFromRow(row);
      },

      async fetchData() {
        this.fetchingData = true;

        try {
          const params = this.prepareRequestParams();

          const response = await this.client().get(this.fetchDataUrl, { params });

          this.data.rows = Object.values(response.data.data).map(row => Row.make(row, {
            idField: this.config.idField,
          }));

          this.pagination = { ...this.pagination, ...response.data.pagination };
        } catch (e) {
          // eslint-disable-next-line
          console.log(e);
        }

        this.fetchingData = false;
      },

      handlePagination(page) {
        this.fetchData({ page });
      },

      needsToReloadAccordingToNewProps(props) {
        if (!props || !Object.keys(props).length) {
          return false;
        }

        if (props.dataUrl && props.dataUrl !== this.fetchDataUrl) {
          return true;
        }

        if (props.rows && Object.keys(props.rows).length) {
          return true;
        }

        if (!props.options || !Object.keys(props.options).length) {
          return false;
        }

        if (props.options.pagination) {
          if (props.options.pagination.perPage
            && props.options.pagination.perPage !== this.config.pagination.perPage
          ) {
            return true;
          }

          if (props.options.pagination.page
            && props.options.pagination.page !== this.pagination.currentPage
          ) {
            return true;
          }
        }

        return false;
      },

      toggleRowSelection(row) {
        if (!this.selectionHasRow(row)) {
          this.data.selectedRows.push(row);

          this.$emit('rowSelected', {
            row,
            data: this.data,
          });
        } else {
          this.data.selectedRows = this.data.selectedRows.filter(
            r => r.id !== row.id,
          );

          this.$emit('rowUnSelected', {
            row,
            data: this.data,
          });
        }

        this.$emit('rowSelectionToggled', {
          row,
          data: this.data,
        });
      },

      toggleAllRowsSelection() {
        if (!this.isAllRowsOnPageSelected) {
          this.data.rows.forEach((row) => {
            if (!this.selectionHasRow(row)) {
              this.data.selectedRows.push(row);
            }
          });

          this.$emit('allRowsSelected', {
            data: this.data,
          });
        } else {
          this.data.selectedRows = [];

          this.$emit('selectedRowsCleared', {
            data: this.data,
          });
        }

        this.$emit('allRowsSelectionToggled', {
          data: this.data,
        });
      },

      sort(field) {
        if (!this.sorting[field]) {
          this.$set(this.sorting, field, 'asc');
        } else {
          this.$set(this.sorting, field, this.sorting[field] === 'asc' ? 'desc' : null);
        }

        this.fetchData();
      },

      selectionHasRow(row) {
        return this.data.selectedRows.filter(r => r.id === row.id).length;
      },

      prepareRequestParams() {
        return RequestQueryFormatter.format({
          page: this.pagination.currentPage || 1,
          perPage: this.pagination.perPage || this.config.pagination.perPage,
          sorting: this.sorting,
          ...this.additionalRequestParams,
        });
      },

      redraw() {
        this.data.columns = Columns.make(this.data.columns.columns);
      },

      handleResize() {
        this.windowWidth = window.innerWidth;
      },

      fireRowClickEvent(row) {
        this.$emit('rowClicked', row);
      },

      fireRowDblClickEvent(row) {
        this.$emit('rowDblClicked', { row });
      },

      fireCellClickEvent(cell, row, field) {
        this.$emit('cellClicked', { cell, row, field });
      },

      fireCellDblClickEvent(cell, row, field) {
        this.$emit('cellDblClicked', { cell, row, field });
      },

      client() {
        return axios.create(this.config.axios);
      },

      api() {
        return Api.make(this);
      },
    },
  };
</script>
