<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-h4 mb-4">Clientes</h1>

        <!-- Formulario para crear o editar cliente -->
        <v-form @submit.prevent="modoEdicion ? actualizar() : crear()">
          <v-text-field v-model="formCliente.nombre" label="Nombre" required />
          <v-text-field v-model="formCliente.email" label="Email" type="email" required />
          <v-btn type="submit" color="primary" class="mt-2">
            {{ modoEdicion ? 'Actualizar Cliente' : 'Agregar Cliente' }}
          </v-btn>
          <v-btn v-if="modoEdicion" class="mt-2 ml-2" color="grey" @click="cancelarEdicion">
            Cancelar
          </v-btn>
        </v-form>

        <v-divider class="my-6" />

        <!-- Tabla de clientes -->
        <template v-if="clientes.length > 0">
          <v-table class="mt-4" hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cliente in clientes" :key="cliente.id">
                <td>{{ cliente.nombre }}</td>
                <td>{{ cliente.email }}</td>
                <td class="text-right">
                  <v-btn color="blue" class="mr-2" @click="editar(cliente)" size="small" icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn color="red" @click="eliminar(cliente.id)" size="small" icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </template>

        <!-- Alerta cuando no hay clientes -->
        <template v-else>
          <v-alert type="info" class="mt-4">
            No hay clientes registrados.
          </v-alert>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { obtenerClientes, crearCliente, eliminarCliente, actualizarCliente } from '@/Api/clientes'

const clientes = ref<any[]>([])

const formCliente = ref<{ id: number | null; nombre: string; email: string }>({
  id: null,
  nombre: '',
  email: ''
})

const modoEdicion = ref(false)

const cargarClientes = async () => {
  const response = await obtenerClientes()
  clientes.value = response
}

const crear = async () => {
  await crearCliente(formCliente.value)
  formCliente.value = { id: null, nombre: '', email: '' }
  cargarClientes()
}

const editar = (cliente: any) => {
  formCliente.value = { ...cliente }
  modoEdicion.value = true
}

const actualizar = async () => {
  await actualizarCliente(formCliente.value.id!, formCliente.value)
  formCliente.value = { id: null, nombre: '', email: '' }
  modoEdicion.value = false
  cargarClientes()
}

const cancelarEdicion = () => {
  formCliente.value = { id: null, nombre: '', email: '' }
  modoEdicion.value = false
}

const eliminar = async (id: number) => {
  await eliminarCliente(id)
  cargarClientes()
}

onMounted(() => cargarClientes())
</script>
