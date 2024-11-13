<template>
  <div class="home">

    <h1>Калькулятор деталей машины</h1>
    <VehicleTable :vehicle="vehicle" />


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
    unitPrice: 0,
    quantity: 1,
    parent: null,
    level: 0,
    childs: [
      {
        ordId: 1,
        name: "Кузов",
        unitPrice: 0,
        quantity: 1,
        parent: null,
        level: 1,

        childs: [
          {
            ordId: 1,
            name: "Двери",
            unitPrice: 90000,
            quantity: 4,
            parent: null,
            level: 2,
            childs: null,
          },
          {
            ordId: 2,
            name: "Капот",
            unitPrice: 200000,
            quantity: 1,
            parent: null,
            level: 2,
            childs: null
          },
          {
            ordId: 3,
            name: "Багажник",
            unitPrice: 150000,
            quantity: 1,
            parent: null,
            level: 2,
            childs: null
          }
        ]
      },
      {
        ordId: 2,
        name: "Трансмиссия",
        unitPrice: 0,
        quantity: 1,
        parent: null,
        level: 1,
        childs: [
          {
            ordId: 1,
            name: "Сцепление",
            unitPrice: 150000,
            quantity: 1,
            parent: null,
            level: 2,
            childs: null
          },
          {
            ordId: 2,
            name: "Коробка передач",
            unitPrice: 0,
            quantity: 1,
            parent: null,
            level: 2,
            childs: [
              {
                ordId: 1,
                name: "Шестерни",
                unitPrice: 20000,
                quantity: 12,
                parent: null,
                level: 3,
                childs: null
              },
              {
                ordId: 2,
                name: "Механизм",
                unitPrice: 360000,
                quantity: 1,
                parent: null,
                level: 3,
                childs: null
              }
            ]
          }
        ]
      },
      {
        ordId: 3,
        name: "Двигатель",
        unitPrice: 800000,
        quantity: 1,
        parent: null,
        level: 1,
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