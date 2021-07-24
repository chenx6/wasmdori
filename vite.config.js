import { resolve } from 'path'

export default {
  base: "/wasmdori/",
  build: {
    outDir: "docs",
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        card_recognize: resolve(__dirname, 'card_recognize.html'),
        team_builder: resolve(__dirname, 'team_builder.html'),
        profile: resolve(__dirname, 'profile.html')
      }
    }
  }
}
