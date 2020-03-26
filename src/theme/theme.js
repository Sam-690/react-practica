import {createMuiTheme} from '@material-ui/core/styles'

const theme = createMuiTheme({
  typography: {
    useNextVarianst: true
  },
  palette: {
    primary: {
      main: "#01579b"
    },
    common: {
      white: "white"
    },
    secondary: {
      main: "#0288d1"
    }
  },
  spacing: 10
});

export default theme;