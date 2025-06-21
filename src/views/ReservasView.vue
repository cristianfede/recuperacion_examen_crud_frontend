<template>
  <v-container>
    <h1 class="text-h4 mb-4">Reservas</h1>

    <!-- Alerta de mensajes -->
    <v-alert
      v-if="mensaje"
      :type="tipoMensaje"
      class="mb-4"
      closable
      @click:close="mensaje = ''"
    >
      {{ mensaje }}
    </v-alert>

    <!-- Formulario para crear reserva -->
    <v-form @submit.prevent="crear">
      <v-select
        v-model="nuevaReserva.cliente_id"
        :items="clientes"
        item-title="nombre"
        item-value="id"
        label="Seleccionar Cliente"
        required
      />

      <v-select
        v-model="nuevaReserva.habitacion_id"
        :items="habitaciones"
        item-title="numero"
        item-value="id"
        label="Seleccionar Habitación"
        required
      />

      <v-text-field v-model="nuevaReserva.fecha_inicio" label="Fecha Inicio" type="date" required />
      <v-text-field v-model="nuevaReserva.fecha_fin" label="Fecha Fin" type="date" required />

      <v-btn type="submit" color="primary" class="mt-2">Agregar Reserva</v-btn>
    </v-form>

    <v-divider class="my-6" />

    <!-- Tabla de reservas -->
    <template v-if="datosCargados && reservas.length > 0">
      <v-table class="mt-4" hover>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Habitación</th>
            <th>Fechas</th>
            <th>Estado</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservas" :key="reserva.id">
            <td>{{ reserva.cliente.nombre }}</td>
            <td>{{ reserva.habitacion.numero }}</td>
            <td>{{ reserva.fecha_inicio }} a {{ reserva.fecha_fin }}</td>
            <td>{{ reserva.estado }}</td>
            <td class="text-right">
              <v-btn color="green" class="mr-2" @click="cambiarEstado(reserva.id, 'confirmada')" size="small">
                Confirmar
              </v-btn>
              <v-btn color="orange" class="mr-2" @click="cambiarEstado(reserva.id, 'cancelada')" size="small">
                Cancelar
              </v-btn>
              <v-btn color="blue" class="mr-2" @click="cambiarEstado(reserva.id, 'finalizada')" size="small">
                Finalizar
              </v-btn>
              <v-btn color="red" @click="eliminar(reserva.id)" size="small" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </template>

    <!-- Mensaje cuando no hay reservas o aún está cargando -->
    <template v-else>
      <v-alert type="info" class="mt-4">
        {{ datosCargados ? 'No hay reservas registradas.' : 'Cargando datos...' }}
      </v-alert>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { obtenerReservas, crearReserva, eliminarReserva, actualizarReserva } from '@/Api/reservas'
import { obtenerClientes } from '@/Api/clientes'
import { obtenerHabitaciones } from '@/Api/habitaciones'

// Estados reactivos
const reservas = ref<any[]>([])
const clientes = ref<any[]>([])
const habitaciones = ref<any[]>([])
const datosCargados = ref(false)

// Manejo de mensajes
const mensaje = ref('')
const tipoMensaje = ref<'success' | 'error'>('success')

// Formulario de reserva
const nuevaReserva = ref({
  cliente_id: null,
  habitacion_id: null,
  fecha_inicio: '',
  fecha_fin: ''
})

// Carga de datos
const cargarDatos = async () => {
  await cargarClientes()
  await cargarHabitaciones()
  await cargarReservas()

  if (clientes.value.length > 0) {
    nuevaReserva.value.cliente_id = clientes.value[0].id
  }

  if (habitaciones.value.length > 0) {
    nuevaReserva.value.habitacion_id = habitaciones.value[0].id
  }

  datosCargados.value = true
}

const cargarReservas = async () => {
  const response = await obtenerReservas()
  reservas.value = response
}

const cargarClientes = async () => {
  const response = await obtenerClientes()
  clientes.value = response
}

const cargarHabitaciones = async () => {
  const response = await obtenerHabitaciones()
  habitaciones.value = response
}

// Crear reserva con manejo de errores
const crear = async () => {
  try {
    await crearReserva(nuevaReserva.value)
    await cargarReservas()

    mensaje.value = 'Reserva creada exitosamente.'
    tipoMensaje.value = 'success'

    const clienteIndex = clientes.value.findIndex((c) => c.id === nuevaReserva.value.cliente_id)
    const habitacionIndex = habitaciones.value.findIndex((h) => h.id === nuevaReserva.value.habitacion_id)

    const siguienteCliente = clientes.value[(clienteIndex + 1) % clientes.value.length]
    const siguienteHabitacion = habitaciones.value[(habitacionIndex + 1) % habitaciones.value.length]

    nuevaReserva.value = {
      cliente_id: siguienteCliente.id,
      habitacion_id: siguienteHabitacion.id,
      fecha_inicio: '',
      fecha_fin: ''
    }
  } catch (error: any) {
    mensaje.value = error.response?.data?.message || 'Error al crear la reserva.'
    tipoMensaje.value = 'error'
  }
}

const eliminar = async (id: number) => {
  await eliminarReserva(id)
  await cargarReservas()
}

const cambiarEstado = async (id: number, nuevoEstado: string) => {
  await actualizarReserva(id, { estado: nuevoEstado })
  await cargarReservas()
}

// Inicialización
onMounted(() => {
  cargarDatos()
})
</script>
