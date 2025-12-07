import { defineConfig } from 'vite'
import React from 'react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    React,
    tailwindcss(),
  ],
})