<template>
  <v-container>
    <h1 class="text-h4 mb-4">Calendario de Reservas</h1>

    <!-- Indicador de carga -->
    <v-alert v-if="loading" type="info" class="mb-4">
      Cargando reservas...
    </v-alert>

    <!-- Calendario -->
    <VueCal
      v-if="!loading"
      style="height: 700px"
      :events="eventos"
      default-view="month"
      locale="es"
      @event-click="mostrarDetalles"
    />

    <!-- Diálogo de detalles -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Detalles de la Reserva</v-card-title>
        <v-card-text>
          <p><strong>{{ eventoSeleccionado?.title }}</strong></p>
          <p>{{ eventoSeleccionado?.content }}</p>
          <p>Inicio: {{ formatearFecha(eventoSeleccionado?.start) }}</p>
          <p>Fin: {{ formatearFecha(eventoSeleccionado?.end) }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notificación -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VueCal } from 'vue-cal'
import 'vue-cal/style.css'
import { obtenerReservas } from '@/Api/reservas'

// Estados
const reservas = ref<any[]>([])
const eventos = ref<any[]>([])
const loading = ref(true)
const dialog = ref(false)
const eventoSeleccionado = ref<any | null>(null)
const snackbar = ref({ show: false, message: '', color: 'success' })

// Cargar reservas y transformarlas a eventos del calendario
const cargarReservas = async () => {
  try {
    loading.value = true
    const response = await obtenerReservas()
    reservas.value = response

    eventos.value = reservas.value.map((reserva) => {
  if (!esFechaValida(reserva.fechaInicio) || !esFechaValida(reserva.fechaFin)) return null

  return {
    start: `${reserva.fechaInicio} 00:00`, // Formato local sin UTC
    end: `${reserva.fechaFin} 23:59`,
    title: `${reserva.cliente.nombre} - Habitación ${reserva.habitacion.numero}`,
    content: `Estado: ${reserva.estado}`,
    class: obtenerClaseEvento(reserva.estado)
  }
}).filter(evento => evento !== null)


console.log('Eventos para el calendario: ', JSON.parse(JSON.stringify(eventos.value)))


    mostrarSnackbar('Reservas cargadas correctamente', 'success')
  } catch (error) {
    console.error('Error al cargar reservas', error)
    mostrarSnackbar('Error al cargar reservas', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarReservas()
})

// Mostrar detalles al hacer clic
const mostrarDetalles = (evento: any) => {
  eventoSeleccionado.value = evento
  dialog.value = true
}

// Formatear fecha para mostrar bonito
const formatearFecha = (fecha: string | Date) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Validar si una fecha es válida
const esFechaValida = (fecha: any) => {
  const d = new Date(fecha)
  return d instanceof Date && !isNaN(d.getTime())
}

// Clase por estado para el color
const obtenerClaseEvento = (estado: string) => {
  switch (estado) {
    case 'confirmada':
      return 'evento-confirmada'
    case 'cancelada':
      return 'evento-cancelada'
    case 'finalizada':
      return 'evento-finalizada'
    default:
      return ''
  }
}

// Notificaciones
const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.value = { show: true, message: mensaje, color }
}
</script>

<style scoped>
.evento-confirmada {
  background-color: #4caf50 !important;
  color: white !important;
}

.evento-cancelada {
  background-color: #f44336 !important;
  color: white !important;
}

.evento-finalizada {
  background-color: #2196f3 !important;
  color: white !important;
}
</style>
