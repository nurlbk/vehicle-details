<template>
  <div class="container">
    <div class="export">
      <BButton variant="success" class="export-button" @click="exportToExcel">
        Выгрузить в Excel
      </BButton>
    </div>

    <BTableSimple ref="exportTable">
      <BThead>
        <BTr>
          <BTh :style="{ width: '15%', minWidth: '120px' }">ID</BTh>
          <BTh :style="{ minWidth: '150px' }">Деталь</BTh>
          <BTh>Цена</BTh>
          <BTh>Количество</BTh>
          <BTh>Стоимость</BTh>
          <BTh>Действия (кнопки)</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <VehicleTableItem :detail="vehicle"></VehicleTableItem>
      </BTbody>
    </BTableSimple>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType, toRefs } from 'vue';
import { VehicleDetail } from '@/models/VehicleDetail';
import { VehicleDetailJson } from '@/models/VehicleDetailJson';
import VehicleTableItem from './VehicleTableItem.vue';
import * as XLSX from 'xlsx';


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

  setup(props) {
    const { vehicle } = toRefs(props);

    const getKeyFromDetail = (detail: VehicleDetail): string => {
      if (detail.ordId === -1) {
        return "Все"
      }
      if (detail.parent == null || detail.parent.parent == null) {
        return detail.ordId.toString()
      }
      return `${getKeyFromDetail(detail.parent)}.${detail.ordId}`
    }


    const toJson = (detail: VehicleDetail): VehicleDetailJson[] => {
      const detailJson: VehicleDetailJson = {
        ordString: getKeyFromDetail(detail),
        name: detail.name,
        unitPrice: detail.unitPrice,
        quantity: detail.quantity,
        totalPrice: detail.unitPrice * detail.quantity,
      }
      let detailJsons = [detailJson]
      detail.childs?.forEach(element => {
        const childJsons = toJson(element)
        detailJsons = detailJsons.concat(childJsons)
      });
      return detailJsons
    }

    const exportToExcel = () => {

      const vehicleDetailJsons = toJson(vehicle.value);
      const dataForExport = [
        ["ID", "Деталь", "Цена", "Количество", "Стоимость"],
        ...vehicleDetailJsons.map(item => [
          item.ordString,
          item.name,
          item.unitPrice,
          item.quantity,
          item.totalPrice
        ])
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(dataForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'VehicleDetails');
      XLSX.writeFile(workbook, 'VehicleDetails.xlsx');
    };
    return {
      exportToExcel
    }
  },

})
</script>




<style scoped>
.container {
  width: 85%;
}


.export {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}
</style>
