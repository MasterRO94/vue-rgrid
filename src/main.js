import VGrid from './components/VGrid.vue';

export default function Grid(vm, options = {}) {
  vm.prototype.$grids = {
    options,
  };

  vm.component('v-grid', VGrid);
}
