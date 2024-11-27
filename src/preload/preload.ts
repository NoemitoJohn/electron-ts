import { contextBridge }  from 'electron'

export interface versions {
  node : () => string
  chrome : () => string
  electron: () => string
}

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
} satisfies versions);
