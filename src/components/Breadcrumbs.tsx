import { Breadcrumbs as UIBreadcrumbs, Link } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import React from 'react'
import { ROOT_NAME } from '../api'

type Breadcrumb = {
  /** Breadcrumb will be displayed with this as its label */
  name: string
  /** Used to update the path when breadcrumb is clicked */
  pathToBreadcrumb: string
}

/**
 * Returns an array of Breadcrumb data for each directory in `path`
 * (if current location at end of `path` is a file, `path` will not end in '/' and the function will know to exclude it from the resulting array)
 */
function getBreadcrumbs(path: string): Breadcrumb[] {
  let pathToBreadcrumb = '/'
  return [
    { name: ROOT_NAME, pathToBreadcrumb: '/' },
    ...path
      .split('/')
      .slice(1, -1)
      .map((name) => {
        pathToBreadcrumb += `${name}/` // the path up to and including the breadcrumb
        return {
          name,
          pathToBreadcrumb,
        }
      }),
  ]
}

type Props = {
  /** The path up to and including the current directory or file, (delimited by `/` characters) */
  path: string
  /** Updates the path with the new path string provided - used to enable navigation of breadcrumbs */
  setPath: React.Dispatch<React.SetStateAction<string>>
}

/**
 * Displays breadcrumbs for each directory in the `path` location.
 * (if the current location is a file, it is therefore not inclued in the breadcrumbs)
 */
const Breadcrumbs: React.FC<Props> = ({ path, setPath }) => {
  const pathBreadcrumbs = getBreadcrumbs(path)

  return (
    <UIBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {pathBreadcrumbs.map(({ name, pathToBreadcrumb }) => {
        return (
          <Link
            color="textSecondary"
            key={pathToBreadcrumb}
            component="button"
            onClick={() => {
              setPath(pathToBreadcrumb)
            }}
            variant="body2"
          >
            {name}
          </Link>
        )
      })}
    </UIBreadcrumbs>
  )
}

export default Breadcrumbs
