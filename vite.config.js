import { resolve } from 'path'

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        card_recognize: resolve(__dirname, 'card_recognize.html'),
        team_builder: resolve(__dirname, 'team_builder.html')
      }
    }
  }
}
