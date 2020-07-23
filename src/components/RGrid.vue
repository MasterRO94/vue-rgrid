<template>
  <div
    v-cloak
    v-resize:debounce="handleResize"
    :class="config.styling.containerClass"
  >
    <slot name="grid-header" />

    <slot
      v-if="loading"
      name="init-loader"
    >
      Loading...
    </slot>
    <div
      v-else
      :class="[
        config.styling.contentClass,
        {[config.styling.contentLoadingClass]: fetchingData}
      ]"
    >
      <div
        v-if="config.pagination.infoEnabled && config.pagination.infoPosition === 'top'"
        :class="config.styling.pagination.infoClassTop"
      >
        <slot name="paginationInfo">
          {{ paginationInfo }}
        </slot>
      </div>

      <r-pagination
        v-if="!initializing
          && config.pagination.enabled
          && numberOfPages > 1
          && (config.pagination.position === 'top' || config.pagination.position === 'top-bottom')"
        v-model="pagination.currentPage"
        :config="config.pagination"
        :styling="config.styling.pagination"
        :number-of-pages="numberOfPages"
        @input="handlePagination"
      />

      <div :class="config.styling.tableWrapperClass">
        <slot
          v-if="fetchingData"
          name="grid-loader"
        >
          Loading...
        </slot>

        <table
          v-if="!cardsView"
          v-bind="$attrs"
          :class="config.styling.tableClass"
        >
          <thead :class="config.styling.tableHeadClass">
            <tr :class="config.styling.tableRowClass">
              <th
                v-if="config.selection && config.selection.enabled"
                v-show="data.rows.length"
                :class="config.styling.tableHeadCellClass"
              >
                <div :class="config.styling.selectionCheckboxWrapperClass">
                  <input
                    type="checkbox"
                    title="Select all"
                    :checked="isAllRowsOnPageSelected"
                    @input="toggleAllRowsSelection"
                  >
                  <span :class="config.styling.selectionCheckMarkClass" />
                </div>
              </th>
              <th
                v-for="(column, field) in data.columns.columns"
                :key="field"
                :class="[
                  config.styling.tableHeadCellClass,
                  {'grid--column-sortable': column.sortable}
                ]"
              >
                <div :class="config.styling.tableHeadHolderClass">
                  <slot
                    :column="column"
                    :name="`column:${field}`"
                  >
                    <span>
                      {{ column.label }}
                    </span>
                  </slot>

                  <template v-if="config.sorting.enabled && column.sortable">
                    <span
                      v-show="sorting[field] === 'asc'"
                      class="r-grid__sortable-icon r-grid__sortable-icon--asc"
                      @click="sort(field)"
                    >
                      <slot
                        v-if="sorting[field] === 'asc'"
                        :column="column"
                        name="sorting-icon-asc"
                      >
                        &uarr;
                      </slot>
                    </span>

                    <span
                      v-show="sorting[field] === 'desc'"
                      class="r-grid__sortable-icon r-grid__sortable-icon--desc"
                      @click="sort(field)"
                    >
                      <slot
                        :column="column"
                        name="sorting-icon-desc"
                      >
                        &darr;
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
                        &varr;
                      </slot>
                    </span>
                  </template>

                  <slot
                    v-if="config.sorting.enabled && !column.sortable"
                    :column="column"
                    name="sorting-icon-disabled"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody :class="config.styling.tableBodyClass">
            <!-- eslint-disable vue/require-v-for-key -->
            <template
              v-for="row in data.rows"
            >
              <tr
                :key="row.id"
                :class="[
                  config.styling.tableRowClass,
                  {
                    [config.styling.tableRowExpandedClass]: displayedDetails[row.id] && displayedDetails[row.id].length,
                    [config.styling.tableRowSelectedClass]: selectionHasRow(row)
                  },
                  additionalRowClass(row),
                ]"
                @click="fireRowClickEvent(row)"
                @dblclick="fireRowDblClickEvent(row)"
              >
                <td
                  v-if="config.selection && config.selection.enabled"
                  :class="config.styling.tableBodyCellClass"
                >
                  <div :class="config.styling.selectionCheckboxWrapperClass">
                    <input
                      type="checkbox"
                      :value="row"
                      :checked="selectionHasRow(row)"
                      :disabled="!row.selectable"
                      @input="toggleRowSelection(row)"
                    >
                    <span :class="config.styling.selectionCheckMarkClass" />
                  </div>
                </td>
                <td
                  v-for="(column, field) in data.columns.columns"
                  :key="field"
                  :class="[
                    config.styling.tableBodyCellClass,
                    {
                      [config.styling.tableBodyCellExpandedClass]: displayedDetails[row.id]
                        && displayedDetails[row.id].includes(field)
                    }
                  ]"
                  @click="fireCellClickEvent(row.columns[field] || null, row, field)"
                  @dblclick="fireCellDblClickEvent(row.columns[field] || null, row, field)"
                >
                  <slot
                    :cell="row.columns[field] || null"
                    :row="row"
                    :field="field"
                    :name="`cell:${field}`"
                  >
                    <template v-if="row.columns[field]">
                      <span v-if="!column.html">
                        {{ row.columns[field].value }}
                      </span>
                      <!-- eslint-disable vue/no-v-html -->
                      <span
                        v-else
                        v-html="row.columns[field].value"
                      />
                    </template>
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
                  :class="config.styling.tableRowClass"
                >
                  <td
                    :colspan="totalColumnsCount"
                    :class="config.styling.tableBodyCellClass"
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
          :class="config.styling.cardWrapperClass"
        >
          <div
            v-if="config.selection && config.selection.enabled"
            :class="config.styling.cardControlsClass"
          >
            <label :for="`select-all-rows-${_uid}`">
              Select All
            </label>
            <div :class="config.styling.selectionCheckboxWrapperClass">
              <input
                :id="`select-all-rows-${_uid}`"
                type="checkbox"
                title="Select all"
                :checked="isAllRowsOnPageSelected"
                @input="toggleAllRowsSelection"
              >
              <span :class="config.styling.selectionCheckMarkClass" />
            </div>
          </div>

          <!-- eslint-disable vue/require-v-for-key -->
          <template
            v-for="row in data.rows"
          >
            <div :class="config.styling.cardColumnClass">
              <div
                :key="row.id"
                :class="[
                  config.styling.cardClass,
                  {
                    [config.styling.cardExpandedClass]: displayedDetails[row.id] && displayedDetails[row.id].length,
                    [config.styling.cardSelectedClass]: selectionHasRow(row)
                  },
                  additionalRowClass(row),
                ]"
                @click="fireRowClickEvent(row)"
                @dblclick="fireRowDblClickEvent(row)"
              >
                <slot
                  :row="row"
                  name="card-header"
                >
                  <div
                    v-if="config.selection && config.selection.enabled"
                    :class="config.styling.cardControlsClass"
                  >
                    <div :class="config.styling.selectionCheckboxWrapperClass">
                      <input
                        type="checkbox"
                        :value="row"
                        :checked="selectionHasRow(row)"
                        :disabled="!row.selectable"
                        @input="toggleRowSelection(row)"
                      >
                      <span :class="config.styling.selectionCheckMarkClass" />
                    </div>
                  </div>
                </slot>

                <div
                  v-for="(column, field) in data.cardColumns.columns"
                  :key="field"
                  :class="config.styling.cardRowClass"
                >
                  <div :class="config.styling.cardLabelClass">
                    <slot
                      :column="column"
                      :name="`card-column:${field}`"
                    >
                      <slot
                        :column="column"
                        :name="`column:${field}`"
                      >
                        <span>
                          {{ column.label }}
                        </span>
                      </slot>
                    </slot>
                  </div>
                  <div
                    :class="[
                      config.styling.cardValueClass,
                      {
                        [config.styling.cardValueExpandedClass]: displayedDetails[row.id]
                          && displayedDetails[row.id].includes(field)
                      }
                    ]"
                    @click="fireCellClickEvent(row.columns[field] || null, row, field)"
                    @dblclick="fireCellDblClickEvent(row.columns[field] || null, row, field)"
                  >
                    <slot
                      :cell="row.columns[field] || null"
                      :row="row"
                      :name="`cell:${field}`"
                      :field="field"
                    >
                      <template v-if="row.columns[field]">
                        <span v-if="!column.html">
                          {{ row.columns[field].value }}
                        </span>
                        <!-- eslint-disable vue/no-v-html -->
                        <span
                          v-else
                          v-html="row.columns[field].value"
                        />
                      </template>
                    </slot>
                  </div>
                </div>

                <slot name="card-footer" />
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

        <div v-show="!fetchingData && !data.rows.length">
          <slot name="no-data-text">
            <p v-text="config.noDataText" />
          </slot>
        </div>
      </div>

      <div
        v-if="config.pagination.infoEnabled && config.pagination.infoPosition === 'bottom'"
        :class="config.styling.pagination.infoClassBottom"
      >
        <slot name="pagination-info">
          {{ paginationInfo }}
        </slot>
      </div>

      <r-pagination
        v-if="!initializing
          && config.pagination.enabled
          && numberOfPages > 1
          && (config.pagination.position === 'bottom' || config.pagination.position === 'top-bottom')"
        v-model="pagination.currentPage"
        :config="config.pagination"
        :styling="config.styling.pagination"
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
import RPagination from './RPagination.vue';
import RequestQueryFormatter from '../RequestQueryFormatter';

export default {
  name: 'RGrid',

  components: {
    RPagination,
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
        cardColumns: {},
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
      for (const row of this.data.rows.filter(r => r.selectable)) {
        if (!this.data.selectedRows.filter(r => r.id === row.id).length) {
          return false;
        }
      }

      return true;
    },

    paginationInfo() {
      const from = (this.pagination.currentPage - 1) * this.itemsPerPage + 1;
      const to = from + this.data.rows.length - 1;

      return this.config.pagination.infoTemplate
        .replace(/:total/g, this.pagination.total)
        .replace(/:from/g, String(from))
        .replace(/:to/g, String(to));
    },

    totalColumnsCount() {
      if (!this.data.columns) {
        return 0;
      }

      const count = this.data.columns.count();

      return this.config.selection && config.selection.enabled ? count + 1 : count;
    },

    cardsView() {
      return this.config.responsive.enabled && this.windowWidth <= this.config.responsive.breakpoint;
    },

    itemsPerPage() {
      return this.pagination.perPage || this.config.pagination.perPage;
    },
  },

  watch: {
    $props: {
      handler(newProps) {
        if (newProps.requestParams || (!newProps.requestParams && this.additionalRequestParams)) {
          this.additionalRequestParams = newProps.requestParams;
        }

        if (this.isNeedsToReloadAccordingToNewProps(newProps)) {
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

  mounted() {
    this.handleResize();
  },

  updated() {
    this.handleResize();
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

      if (this.config.selection.resetSelectionOnReload) {
        this.data.selectedRows = [];
      }

      this.initializing = false;
    },

    prepareConfiguration() {
      const customConfig = this.options && Object.keys(this.options).length
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
          sorting: {
            ...config.sorting,
            ...this.options.sorting || {},
          },
          selection: {
            ...config.selection,
            ...this.options.selection || {},
          },
          styling: {
            ...config.styling,
            ...this.options.styling || {},
            pagination: {
              ...config.styling.pagination,
              ...(this.options.styling ? this.options.styling.pagination || {} : {}),
            },
          },
        }
        : {};

      this.config = { ...config, ...customConfig };

      if (this.config.sorting.defaultSortingColumns && Object.keys(this.config.sorting.defaultSortingColumns).length) {
        Object.entries(this.config.sorting.defaultSortingColumns).forEach(([field, value]) => {
          this.$set(this.sorting, field, value);
        });
      }

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

      // If there is a different config for card view we take it.
      // Otherwise we use columns config for table and cards view.
      const cardColumns = this.options && this.options.cardColumns
        ? this.options.cardColumns
        : columns;

      this.data.columns = Columns.make(columns);
      this.data.cardColumns = Columns.make(cardColumns);
    },

    prepareHeadersFromRow(row) {
      this.data.columns = Columns.makeFromRow(row);

      if (this.data.cardColumns.isEmpty()) {
        this.data.cardColumns = this.data.columns;
      }
    },

    async fetchData() {
      this.fetchingData = true;

      try {
        const params = this.prepareRequestParams();

        const response = await this.client().get(this.fetchDataUrl, { params });

        this.data.rows = Object.values(response.data.data).map(row => Row.make(row, {
          idField: this.config.idField,
          canSelectRowHandler: this.config.selection.canSelectRowHandler,
        }));

        if (this.config.pagination.enabled) {
          this.pagination = { ...this.pagination, ...response.data.pagination };
        }
      } catch (e) {
        // eslint-disable-next-line
        console.log(e);
      }

      this.fetchingData = false;
    },

    handlePagination(page) {
      this.fetchData({ page });
    },

    isNeedsToReloadAccordingToNewProps(props) {
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
        this.data.rows.filter(row => row.selectable).forEach((row) => {
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
      if (this.config.sorting.multipleColumnsSorting) {
        this.sortMultipleColumns(field);
      } else {
        this.sortSingleColumn(field);
      }

      this.fetchData();
    },

    sortMultipleColumns(field) {
      if (!this.sorting[field]) {
        this.$set(this.sorting, field, 'asc');
      } else {
        this.$set(this.sorting, field, this.sorting[field] === 'asc' ? 'desc' : null);
      }
    },

    sortSingleColumn(field) {
      if (!this.sorting[field]) {
        this.sorting = {
          [field]: 'asc',
        };
      } else {
        this.sorting = {
          [field]: this.sorting[field] === 'asc' ? 'desc' : null,
        };
      }
    },

    selectionHasRow(row) {
      return this.data.selectedRows.filter(r => r.id === row.id).length;
    },

    prepareRequestParams() {
      return RequestQueryFormatter.format({
        page: this.pagination.currentPage || 1,
        perPage: this.itemsPerPage,
        sorting: this.sorting,
        ...this.additionalRequestParams,
      });
    },

    additionalRowClass(row) {
      if (this.config.additionalRowClassHandler instanceof Function) {
        return this.config.additionalRowClassHandler(row);
      }

      return '';
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
