# Vue.js Data Grids with server-side processing

### Installation

```javascript
import Vue from 'vue';
import Grid from 'vue-data-grids';


Vue.use(Grid);
```

### Usage

#### Basic
```vue
  <v-grid
    ref="myGrid"
    :data-url="url"
    :options="options"
  />
```

#### Advanced
```vue
<template>
  <v-grid
    ref="myGrid"
    :data-url="url"
    :options="options"
    :request-params="additionalRequestParameters"
  >
    <!-- Define Custom sorting icon for column ascending sorting state. -->
    <template
      #sorting-icon-asc
    >
      <span style="cursor: pointer">
        ASC
      </span>
    </template>

    <!-- Define Custom sorting icon for column descending sorting state. -->
    <template
      #sorting-icon-desc
    >
      <span style="cursor: pointer">
        DESC
      </span>
    </template>

    <!-- Define Custom sorting icon for column default(no-sort) sorting state. -->
    <template
      #sorting-icon-none
    >
      <span style="cursor: pointer">
        NONE
      </span>
    </template>

    <!-- Define Custom sorting icon for column disabled sorting state. -->
    <template
      #sorting-icon-disabled
    >
      DISABLED
    </template>

    <!-- Define Custom table header (Block before <table>). -->
    <template
      #grid-header
    >
      <p>
        My Grid
      </p>
    </template>

    <!-- Define Custom th cell content. -->
    <template v-slot:column:firstName="{ column }">
      <span style="color: #87a99f">
        {{ column.label.toUpperCase() }}
      </span>
    </template>

    <!-- Define Custom td cell content.
         Cell can be null if there is no such field in row but it is defined in columns. -->
    <template v-slot:cell:name="{ row }">
      {{ row.columns.firstName.value }} {{ row.columns.lastName.value }}
      <a
        href="#!"
        style="cursor: pointer"
        @click="toggleDetails(row)"
        v-text="displayDetailsText(row)"
      />
    </template>

    <!-- Define Custom td cell content.
         Cell can be null if there is no such field in row but it is defined in columns. -->
    <template v-slot:cell:roles="{ cell }">
      {{ cell.value[0] === 'ROLE_CUSTOMER' ? 'Customer' : cell.value[0] }}
    </template>

    <!-- Define Custom td cell content.
         Cell can be null if there is no such field in row but it is defined in columns. -->
    <template v-slot:cell:email="{ cell }">
      <a :href="`mailto:${cell.value}`">
        {{ cell.value }}
      </a>
    </template>

    <template v-slot:row-details="{ row }">
      <h5>DETAILS</h5>
    </template>
  </v-grid>
</template>

<script>
export default {
  name: 'VGridsExample',

  data() {
    const customColumns = {
      userId: {
        label: 'ID',
        sortable: true,
        filterable: true,
      },
      firstName: {
        label: 'First name',
        sortable: true,
        filterable: true,
      },
      lastName: {
        label: 'Last name',
        sortable: true,
        filterable: true,
      },
      name: {
        label: 'Name',
        sortable: false,
        filterable: false,
      },
      email: {
        label: 'E-Mail',
        sortable: true,
        filterable: true,
      },
      roles: {
        label: 'Role',
        sortable: true,
        filterable: true,
      },
    };

    return {
      columnsToggled: true,

      customColumns,
      selectionText: '',

      options: {
        columns: customColumns,
        pagination: {
          perPage: 5,
          total: 0,
        },
      },
      additionalRequestParameters: {
        externalField: '',
      },

      url: '/site/api/grid-data',
    };
  },

  computed: {
    gridApi() {
      return this.$refs.myGrid && this.$refs.myGrid.api();
    },
  },

  methods: {
    toggleColumns() {
      if (this.columnsToggled) {
        this.grid.columns = {};
      } else {
        this.grid.columns = this.customColumns;
      }

      this.columnsToggled = !this.columnsToggled;
    },

    addColumn() {
      this.gridApi.addColumn('fullName', {
        label: 'Full Name',
      });
    },

    removeColumn() {
      this.gridApi.removeColumn('fullName');
    },

    goToPage2() {
      this.gridApi.page(2);
    },

    changeItemsPerPage(e) {
      this.gridApi.perPage(e.target.value);
    },

    prepareSelectionText() {
      const $grid = this.$refs.myGrid;

      if (!$grid || !$grid.data.selectedRows.length) {
        this.selectionText = '';
        return;
      }

      const customersCount = $grid.data.selectedRows.filter(row => row.columns.roles.value.includes('ROLE_CUSTOMER')).length;
      const adminsCount = $grid.data.selectedRows.filter(row => row.columns.roles.value.includes('ROLE_ADMIN')).length;

      this.selectionText = `
        Selected users: ${customersCount + adminsCount}. Customers: ${customersCount}, Admins: ${adminsCount}
      `;
    },

    reloadGrid() {
      this.gridApi.reload();
    },

    toggleDetails(row) {
      this.gridApi.toggleDetailsForRow(row);
    },

    displayDetailsText(row) {
      return this.gridApi.isRowDetailsExpanded(row)
        ? 'Hide details'
        : 'Show details';
    },
  },
};
</script>

```

#### Configuration
##### Props

| Prop            | Description                                                                                                       | Required | Available values / Example | Default value |
|-----------------|-------------------------------------------------------------------------------------------------------------------|:--------:|----------------------------|:-------------:|
| data-url        | Url from where to fetch data                                                                                      | true     |             -              |       -       |
| options.columns | Object describing columns and there behavior. If nothing defined columns will be generated using data from sever. | false    |              -             |       -       |
|                 |                                                                                                                   |          |                            |               |
