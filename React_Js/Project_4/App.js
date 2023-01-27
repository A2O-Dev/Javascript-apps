import React from "react";
import AppRouter from "./src/routers/AppRouter";
import "./App.css";
import "animate.css";
import Snackbar from './src/components/ui/Snackbar';
import { Provider } from 'react-redux';
import store from './src/store/store';

import { createMuiTheme, ThemeProvider } from '@material-ui/core';
const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#3C8DBC",
        },
        secondary:{
            main:"#009FF6",
            contrastText: '#fff',
        }
    }
});
const App = () => {
    return(
        <ThemeProvider theme={theme}>
            <Provider store={ store }>
                <AppRouter/>
                <Snackbar/>
            </Provider>
        </ThemeProvider>
    );
};

export  default App;