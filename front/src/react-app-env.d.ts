/// <reference types="react-scripts" />
import {Theme} from "@mui/material/styles";

declare module "@mui/private-theming" {
    import type { Theme } from "@mui/material/styles";

    interface DefaultTheme extends Theme {}
}
