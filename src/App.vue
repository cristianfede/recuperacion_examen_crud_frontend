<script setup lang="ts">
import {RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <!-- Barra de navegación -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Sistema de Reservas</v-toolbar-title>

      <!-- Menú de navegación -->
      <v-spacer></v-spacer>
      <v-btn variant="text" to="/" router>Inicio</v-btn>
      <v-btn variant="text" to="/clientes" router>Clientes</v-btn>
      <v-btn variant="text" to="/habitaciones" router>Habitaciones</v-btn>
      <v-btn variant="text" to="/reservas" router>Reservas</v-btn>
      <v-btn variant="text" to="/calendario" router>Calendario</v-btn>
    </v-app-bar>

    <!-- Contenido de las vistas -->
    <v-main class="pa-4">
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  min-height: calc(100vh - 64px);
}
</style>
