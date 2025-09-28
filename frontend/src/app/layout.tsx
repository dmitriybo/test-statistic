import './globals.css'
import '@radix-ui/themes/styles.css'
import { ReactNode } from 'react'

import { Theme } from '@radix-ui/themes'

export const metadata = {
  title: 'Тестовое задание',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Theme>{children}</Theme>
      </body>
    </html>
  )
}
