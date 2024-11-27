import { versions } from "src/preload/preload";


declare global {
  interface Window {
    versions : versions
  }
}
