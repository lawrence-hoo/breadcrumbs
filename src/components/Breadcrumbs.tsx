import { Breadcrumbs as UIBreadcrumbs, Link, Typography } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import React from 'react'
import { ROOT_NAME } from '../api'

type Breadcrumb = {
  /** Breadcrumb will be displayed with this as its label */
  name: string
  /** Used to update the path when breadcrumb is clicked */
  pathToBreadcrumb: string
  /** Used to determine whether or not the breadcrumb should be clickable */
  isFile: boolean
}

/**
 * Returns an array of Breadcrumb data for `path`
 */
function getBreadcrumbs(path: string): Breadcrumb[] {
  const endsInFile = path.charAt(path.length - 1) !== '/'
  const pathElements = endsInFile ? path.split('/') : path.split('/').slice(0, -1)

  let pathToBreadcrumb = ''
  return pathElements.map((pathElement, index) => {
    const isFile = endsInFile && index === pathElements.length - 1
    pathToBreadcrumb += `${pathElement}${isFile ? '' : '/'}`
    return {
      name: pathElement || ROOT_NAME, // if pathElement === '', it's the root directory
      pathToBreadcrumb,
      isFile,
    }
  })
}

type Props = {
  /** The path up to and including the current directory or file, (delimited by `/` characters) */
  path: string
  /** Updates the path with the new path string provided - used to enable navigation of breadcrumbs */
  setPath: React.Dispatch<React.SetStateAction<string>>
}

/**
 * Displays breadcrumbs for each part of the `path` location.
 */
const Breadcrumbs: React.FC<Props> = ({ path, setPath }) => {
  const pathBreadcrumbs = getBreadcrumbs(path)

  return (
    <UIBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {pathBreadcrumbs.map(({ name, pathToBreadcrumb, isFile }) => {
        return isFile ? (
          <Typography key={pathToBreadcrumb} variant="body2">
            {name}
          </Typography>
        ) : (
          <Link
            key={pathToBreadcrumb}
            color="textSecondary"
            component="button"
            display="block"
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
