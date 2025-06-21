<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-h4 mb-4">Habitaciones</h1>

        <!-- Formulario para crear o editar habitación -->
        <v-form @submit.prevent="modoEdicion ? actualizar() : crear()">
          <v-text-field v-model.number="formHabitacion.numero" label="Número" type="number" required />
          <v-text-field v-model="formHabitacion.tipo" label="Tipo" required />
          <v-text-field v-model.number="formHabitacion.precio" label="Precio" type="number" required />
          <v-btn type="submit" color="primary" class="mt-2">
            {{ modoEdicion ? 'Actualizar Habitación' : 'Agregar Habitación' }}
          </v-btn>
          <v-btn v-if="modoEdicion" class="mt-2 ml-2" color="grey" @click="cancelarEdicion">
            Cancelar
          </v-btn>
        </v-form>

        <v-divider class="my-6" />

        <!-- Tabla de habitaciones -->
        <template v-if="habitaciones.length > 0">
          <v-table class="mt-4" hover>
            <thead>
              <tr>
                <th>Número</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="habitacion in habitaciones" :key="habitacion.id">
                <td>{{ habitacion.numero }}</td>
                <td>{{ habitacion.tipo }}</td>
                <td>${{ habitacion.precio }}</td>
                <td class="text-right">
                  <v-btn color="blue" class="mr-2" @click="editar(habitacion)" size="small" icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn color="red" @click="eliminar(habitacion.id)" size="small" icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </template>

        <!-- Alerta si no hay habitaciones -->
        <template v-else>
          <v-alert type="info" class="mt-4">
            No hay habitaciones registradas.
          </v-alert>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  obtenerHabitaciones,
  crearHabitacion,
  eliminarHabitacion,
  actualizarHabitacion
} from '@/Api/habitaciones'

const habitaciones = ref<any[]>([])

const formHabitacion = ref<{ id: number | null; numero: number | null; tipo: string; precio: number | null }>({
  id: null,
  numero: null,
  tipo: '',
  precio: null
})

const modoEdicion = ref(false)

const cargarHabitaciones = async () => {
  const response = await obtenerHabitaciones()
  habitaciones.value = response
}

const crear = async () => {
  await crearHabitacion(formHabitacion.value)
  formHabitacion.value = { id: null, numero: null, tipo: '', precio: null }
  cargarHabitaciones()
}

const editar = (habitacion: any) => {
  formHabitacion.value = { ...habitacion }
  modoEdicion.value = true
}

const actualizar = async () => {
  await actualizarHabitacion(formHabitacion.value.id!, formHabitacion.value)
  formHabitacion.value = { id: null, numero: null, tipo: '', precio: null }
  modoEdicion.value = false
  cargarHabitaciones()
}

const cancelarEdicion = () => {
  formHabitacion.value = { id: null, numero: null, tipo: '', precio: null }
  modoEdicion.value = false
}

const eliminar = async (id: number) => {
  await eliminarHabitacion(id)
  cargarHabitaciones()
}

onMounted(() => cargarHabitaciones())
</script>
