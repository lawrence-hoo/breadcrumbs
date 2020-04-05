import { PromiseFn } from 'react-async'
import DIRECTORY_STRUCTURE from './directory-structure.json'

export const ROOT_NAME = 'root'

type DirectoryStructure = {
  type: string
  children?: {
    [key: string]: DirectoryStructure
  }
}

type LocationInDirectoryStructure = DirectoryStructure & {
  name: string
}

type LocationMetadata = {
  name: string
  type: string
}

export type LocationContents = LocationMetadata & {
  children?: LocationMetadata[]
}

/**
 * Given the location of the path's data in the directory structure,
 * returns the metadata for the directory or file pointed to by the path.
 * (if the path points to a directory, also returns its files and/or subdirectories)
 */
function getLocationContents(location: LocationInDirectoryStructure): LocationContents {
  const { name, type, children } = location

  if (children) {
    return {
      name,
      type,
      children: Object.entries(children).map(([name, child]) => ({ name, type: child.type })),
    }
  } else {
    return { name, type }
  }
}

/** Traverses `path` in the directory structure to find the current location (at the end of the path) */
function getPathLocation(path: string): LocationInDirectoryStructure | undefined {
  if (path === '/') {
    return { name: ROOT_NAME, ...DIRECTORY_STRUCTURE }
  } else {
    const pathArray = path.split('/').filter((str) => str !== '') // first element is always '', last element is '' if the path is a directory
    let location = DIRECTORY_STRUCTURE
    let locationExists
    let name
    pathArray.forEach((pathLocation) => {
      if (location.children && location.children[pathLocation]) {
        location = location.children[pathLocation]
        name = pathLocation
        locationExists = true
      } else {
        locationExists = false
      }
    })
    return locationExists ? { name, ...location } : undefined
  }
}

/** Fetches the contents to display for the `path` string provided (from data in the directory structure). */
export const getContents: PromiseFn<LocationContents> = async ({ path }) => {
  const location = getPathLocation(path)
  if (location) {
    return Promise.resolve(getLocationContents(location))
  } else {
    return Promise.reject(new Error(`Could not find directory or file for path: ${path}`))
  }
}
