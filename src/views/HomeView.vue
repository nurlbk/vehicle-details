<template>
  <div class="home">

    <h1>Калькулятор деталей машины</h1>
    <VehicleTable :vehicle="vehicle"/>


  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import VehicleTable from "@/components/VehicleTable.vue";
import { VehicleDetail } from '@/models/VehicleDetail';

@Options({
  components: {
    VehicleTable
  },
})

export default class HomeView extends Vue {
  vehicle: VehicleDetail = {
    ordId: -1,
    name: "Машина",
    unitPrice: 5000,
    quantity: 10,
    parent: null,
    childs: [
      {
        ordId: 1,
        name: "Кузов",
        unitPrice: 5000,
        quantity: 10,
        parent: null,
        childs: [
          {
            ordId: 1,
            name: "Двери",
            unitPrice: 5000,
            quantity: 10,
            parent: null,
            childs: null
          },
          {
            ordId: 2,
            name: "Капот",
            unitPrice: 5000,
            quantity: 10,
            parent: null,
            childs: null
          },
          {
            ordId: 3,
            name: "Багажник",
            unitPrice: 5000,
            quantity: 10,
            parent: null,
            childs: null
          }
        ]
      },
      {
        ordId: 2,
        name: "Двигатель",
        unitPrice: 5000,
        quantity: 10,
        parent: null,
        childs: null
      },
      {
        ordId: 3,
        name: "Трансмиссия",
        unitPrice: 5000,
        quantity: 10,
        parent: null,
        childs: null
      }
    ]
  }
  setParentReferences(item: VehicleDetail, parent: VehicleDetail | null) {
    item.parent = parent;
    if (item.childs != null) {
      item.childs.forEach(child => this.setParentReferences(child, item));
    }
  }
  mounted() {
    this.setParentReferences(this.vehicle, null);
  }
}


</script>

<style scoped></style>