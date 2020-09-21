import React from 'react'

const {Consumer, Provider } = React.createContext()

export const ThemeConsumer = Consumer // is going to be what we use in order to consume the information that we put on provider
export const ThemeProvider = Provider // allow us what information is going to be available to any component in our application that needs it 