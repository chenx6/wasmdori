import { resolve } from 'path'
import { defineConfig } from 'vite'


export default defineConfig({
  base: "/wasmdori/",
  build: {
    outDir: "docs",
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        card_recognize: resolve(__dirname, 'card_recognize.html'),
        team_builder: resolve(__dirname, 'team_builder.html'),
        profile: resolve(__dirname, 'profile.html'),
        eventGacha: resolve(__dirname, 'gacha.html')
      }
    },
    sourcemap: true,
  }
})
