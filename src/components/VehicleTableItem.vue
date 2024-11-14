<template>
  <BTr>
    <BTd v-if="detail.ordId == -1" class="id-row" :style="{ paddingLeft: 30 + 'px' }">Все</BTd>
    <BTd v-else class="id-row">
      <button v-if="detail.childs && detail.childs.length" @click="toggleChildren" class="toggle-button"
        :style="{ paddingLeft: (detail.level - 1) * 15 + 'px' }">
        <span v-if="isExpanded" class="toggle-logo fa fa-chevron-down"></span>
        <span v-else class="toggle-logo fa fa-chevron-right"></span>
      </button>
      <div :style="{ paddingLeft: (detail.level - 1) * 15 + 30 + 'px' }">
        {{ getKeyFromDetail(detail) }}
      </div>
    </BTd>
    <BTd>{{ detail.name }}</BTd>
    <BTd>{{ detail.unitPrice }}</BTd>
    <BTd>{{ detail.quantity }}</BTd>
    <BTd>{{ detail.unitPrice * detail.quantity }}</BTd>
    <BButtonGroup class="mx-1">
      <BButton variant="primary" @click="plusQuantity()" class="quantity-changer"><b>+</b></BButton>
      <BButton variant="danger" @click="minusQuantity()" class="quantity-changer"><b>-</b></BButton>
      <BButton variant="secondary" @click="onAddDetailClick">Добавить</BButton>
    </BButtonGroup>
  </BTr>
  <VehicleTableItem v-if="isExpanded" v-for="child in detail.childs" :key="child.ordId" :detail="child" />


  <BModal v-model="showModal" title="Добавить деталь">
    <div>
      <label>Название детали:</label>
      <BFormInput v-model="newDetailName" type="text" class="form-control" placeholder="Введите название" />
      <BAlert :model-value="newDetailNameAlert" variant="danger">Поле пустое</BAlert>

      <label>Стоимость:</label>
      <BFormInput v-model.number="newDetailUnitPrice" type="number" :min="0" class="form-control"
        placeholder="Введите cтоимость" />
      <BAlert :model-value="newDetailUnitPriceAlert" variant="danger">Поле Стоимость не может быть отрицательным
      </BAlert>

      <label>Количество:</label>
      <BFormInput v-model.number="newDetailQuantity" type="number" :min="1" class="form-control"
        placeholder="Введите количество" />
      <BAlert :model-value="newDetailQuantityAlert" variant="danger">Количество минимум 1</BAlert>
    </div>
    <template #footer>
      <BButton variant="primary" @click="handleOk">OK</BButton>
    </template>
  </BModal>

</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { VehicleDetail } from '@/models/VehicleDetail';


export default defineComponent({
  name: 'VehicleTableItem',
  props: {
    detail: {
      type: Object as PropType<VehicleDetail>,
      required: true
    },
  },
  setup() {
    function toggleChildren() {
      isExpanded.value = !isExpanded.value;
    }

    const showModal = ref(false)
    const newDetailName = ref('')
    const newDetailUnitPrice = ref(0)
    const newDetailQuantity = ref(1)
    const newDetailNameAlert = ref(false)
    const newDetailUnitPriceAlert = ref(false)
    const newDetailQuantityAlert = ref(false)
    const isExpanded = ref(true);
    return {
      showModal,
      newDetailName,
      newDetailUnitPrice,
      newDetailQuantity,
      newDetailNameAlert,
      newDetailUnitPriceAlert,
      newDetailQuantityAlert,
      isExpanded,
      toggleChildren
    };
  },
  methods: {
    getKeyFromDetail(detail: VehicleDetail): string {
      if (detail.parent == null || detail.parent.parent == null) {
        return detail.ordId.toString()
      }
      return `${this.getKeyFromDetail(detail.parent)}.${detail.ordId}`
    },
    calculateUnitPrice(detail: VehicleDetail): number {
      if (detail.childs == null) {
        return detail.unitPrice
      }
      let price = 0
      detail.childs.forEach(element => {
        price += this.calculateUnitPrice(element) * element.quantity
      });
      detail.unitPrice = price
      return price
    },
    plusQuantity() {
      this.detail.quantity += 1
      this.handlePriceChange(this.detail)
    },
    minusQuantity() {
      if (this.detail.quantity !== 0) {
        this.detail.quantity -= 1
        this.handlePriceChange(this.detail)
        return
      }
      if (this.detail.parent === null) {
        this.handlePriceChange(this.detail)
        return
      }
      this.detail.parent.childs?.splice(this.detail.parent.childs.indexOf(this.detail), 1)
      if (this.detail.parent.childs != null) {
        for (let i = 0; i < this.detail.parent.childs.length; i++) {
          this.detail.parent.childs[i].ordId = i + 1
        }
      }
      this.handlePriceChange(this.detail)
    },

    handlePriceChange(detail: VehicleDetail): number {
      if (detail.parent == null) {
        detail.unitPrice = this.calculateUnitPrice(detail)
        return detail.unitPrice
      }
      return this.handlePriceChange(detail.parent)
    },
    handleOk() {
      if (this.newDetailName == '') {
        this.newDetailNameAlert = true
      } else {
        this.newDetailNameAlert = false
      }
      if (this.newDetailUnitPrice < 0) {
        this.newDetailUnitPriceAlert = true
      } else {
        this.newDetailUnitPriceAlert = false
      }
      if (this.newDetailQuantity < 1) {
        this.newDetailQuantityAlert = true
      } else {
        this.newDetailQuantityAlert = false
      }
      if (!this.newDetailNameAlert && !this.newDetailUnitPriceAlert && !this.newDetailQuantityAlert) {

        if (this.detail.childs == null) {
          const newDetail: VehicleDetail = {
            ordId: 1,
            name: this.newDetailName,
            unitPrice: this.newDetailUnitPrice,
            quantity: this.newDetailQuantity,
            parent: this.detail,
            childs: null,
            level: this.detail.level + 1
          }
          this.detail.childs = [newDetail]
        } else {
          const newDetail: VehicleDetail = {
            ordId: this.detail.childs.length + 1,
            name: this.newDetailName,
            unitPrice: this.newDetailUnitPrice,
            quantity: this.newDetailQuantity,
            parent: this.detail,
            childs: null,
            level: this.detail.level + 1
          }
          this.detail.childs.push(newDetail)
        }

        this.showModal = false
        this.newDetailName = ''
        this.handlePriceChange(this.detail)
      }
    },
    onAddDetailClick() {
      this.showModal = true
      this.newDetailName = ''
      this.newDetailUnitPrice = 0
      this.newDetailQuantity = 1
      this.newDetailNameAlert = false
      this.newDetailUnitPriceAlert = false
      this.newDetailQuantityAlert = false
    }
  },

  mounted() {
    this.calculateUnitPrice(this.detail)
  }
})

</script>



<style scoped>
.quantity-changer {
  width: 36px;
}

.id-row {
  text-align: left;
  position: relative;
}

.toggle-button {
  position: absolute;
  background: none;
  border: none;
  padding-right: 0px;
}

.toggle-logo {
  width: 26px;
}
</style>