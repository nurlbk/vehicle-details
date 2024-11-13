<template>
  <div class="container">
    <div class="export">
      <BButton variant="success" class="export-button">
        Выгрузить в Excel
      </BButton>
    </div>

    <BTableSimple>
      <thead>
        <tr>
          <th>ID</th>
          <th>Деталь</th>
          <th>Цена</th>
          <th>Количество</th>
          <th>Стоимость</th>
          <th>Действия (кнопки)</th>

        </tr>
      </thead>
      <tbody>
        <VehicleTableItem :detail="vehicle"></VehicleTableItem>
      </tbody>
    </BTableSimple>




  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType } from 'vue';
import { VehicleDetail } from '@/models/VehicleDetail';
import VehicleTableItem from './VehicleTableItem.vue';

export default defineComponent({
  name: 'VehicleTable',
  components: {
    VehicleTableItem
  },
  props: {
    vehicle: {
      type: Object as PropType<VehicleDetail>,
      required: true
    }
  },

  setup() {
  },

})
</script>




<style scoped>
.container{
  width: 75%;
}


.export {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

</style>
