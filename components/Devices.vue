<template>
  <div class="ui stackable cards">
    <DeviceDetail
      icon="/img/printer-net.png"
      name="EPSON EPL-N2550"
      id="15759"
      connection="TCP"
      description="Seminario 3P Redes y Sistemas CPD"
    />
  </div>
</template>

<script>
import DeviceDetail from '@/components/DeviceDetail.vue'

export default {
  name: 'Devices',
  components: {
    DeviceDetail
  }
}
</script>
