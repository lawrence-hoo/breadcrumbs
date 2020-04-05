import { List, ListItem, ListItemText } from '@material-ui/core'
import React from 'react'
import { LocationContents } from '../api'

/** Returns the data required to render a directory's children (subdirectories and/or files) */
function getChildProps(children, path, setPath) {
  return children.map(({ name, type }) => {
    const childPath = `${path}${name}${type === 'dir' ? '/' : ''}`
    return {
      id: childPath,
      name,
      type,
      onClick: () => {
        setPath(childPath)
      },
    }
  })
}

type Props = {
  /** The current path location's contents to display */
  contents: LocationContents
  /** The path up to and including the current directory or file, (delimited by `/` characters) */
  path: string
  /** Updates the path with the new path string provided - used to enable navigation of breadcrumbs */
  setPath: React.Dispatch<React.SetStateAction<string>>
}

/**
 * Displays the contents of the current path location
 * - if it's a file: the file's name
 * - if it's a directory: the directory's subdirectories and/or files
 */
const PageContents: React.FC<Props> = ({ contents, path, setPath }) => (
  <>
    {contents.type === 'dir' && contents.children && (
      <List aria-label={`${contents.name} contents`}>
        {getChildProps(contents.children, path, setPath).map(({ id, name: childName, onClick }) => (
          <ListItem button key={id} onClick={onClick}>
            <ListItemText primary={childName} />
          </ListItem>
        ))}
      </List>
    )}
    {contents.type === 'file' && <p>THIS IS FILE: {contents.name}</p>}
  </>
)

export default PageContents
